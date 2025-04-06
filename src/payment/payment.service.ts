import { Injectable } from '@nestjs/common';
import { GenerateInstallmentLinksProps, PaymentLink, StripeService } from './stripe/stripe.service';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument, PaymentStatus } from './entitities/payment';
import { Model, Schema } from 'mongoose';
import { Installment, InstallmentDoc, InstallmentStatus } from './entitities/installment';
import { Request } from 'express'
import { ConfigService } from '@nestjs/config';


export type TrackPaymentInstallmentProp = {
  paymentId: string
}

export type CreatePaymentProp = {
  amount: number;
  installments: number;
  clientId: string;
}

@Injectable()
export class PaymentService {
  
  constructor(
    private readonly stripeService: StripeService,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Installment.name) private installmentModel: Model<Installment>,
    private readonly configService: ConfigService,
  ) {}
  async createPaymentIntent({ amount, installments, clientId, paymentId }: GenerateInstallmentLinksProps): Promise<PaymentLink[]> {
    try {
      const paymentIntent = await this.stripeService.generateInstallmentLinks({ amount, installments, clientId, paymentId });
      return paymentIntent;
    } catch (error: Error | any) {
      throw new Error(`Failed to create payment intent: ${error?.message}`);
    }
  }
  
  async savePaymentIntent({ link, paymentId, installmentId }: any): Promise<InstallmentDoc>  {
    const savedPayment = await this.installmentModel.create({link, payment: paymentId, installmentId})
    // console.log(savedPayment)
    return savedPayment;
  }
  
  async createPayment({ amount, installments, clientId }: CreatePaymentProp): Promise<PaymentDocument> {
    try {
      return  await this.paymentModel.create({ amount, no_of_installment: installments, clientId });
    } catch (error: Error | any) {
      throw new Error(`Failed to create payment: ${error?.message}`);
    }
  } 
  
  async updatePaidSuccessfulInstallment (installmentId: string, paymentId: string): Promise<Installment | null> {
    try {
      const installment: InstallmentDoc = await this.installmentModel.findOne({ installmentId }).exec();
      if (!installment) {
        throw new Error('Installment not found');
      }
      installment.status = InstallmentStatus.Paid;
      installment.paidAt = new Date(Date.now());
      return await installment.save();
    } catch (error: Error | any) {
      console.log(error);
      throw new Error(`Failed to update paid installment: ${error?.message}`);
    }
  }

  async updatePaidFailInstallment (installmentId: string, paymentId: string): Promise<Installment | null> {
    try {
      const installment: InstallmentDoc = await this.installmentModel.findOne({ installmentId }).exec();
      if (!installment) {
        throw new Error('Installment not found');
      }
      if (installment.status == InstallmentStatus.Paid) return null;
      installment.status = InstallmentStatus.Failed;
      installment.paidAt = new Date(Date.now());
      return await installment.save();
    } catch (error: Error | any) {
      console.log(error);
      throw new Error(`Failed to update paid installment: ${error?.message}`);
    }
  }

  async handleWebhookEvent(req: Request): Promise<void> {
    const sig = req.headers['stripe-signature'];
    console.log(sig)
    console.log("secret-hook", this.configService.get('WEBHOOK_SIGNING_SECRET'))
    const endpointSecret = this.configService.get('WEBHOOK_SIGNING_SECRET');

    try {
      const event = this.stripeService.getStripe().webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook event received:', event);

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          // Payment was successful
          console.log('Payment succeeded:', event.data.object);
          const session = event.data.object;
          await this.updatePaidSuccessfulInstallment(session.id, session.client_reference_id);
          break;
        case 'checkout.session.async_payment_failed':
          // Payment failed
          console.log('Payment failed:', event.data.object);
          const failedSession = event.data.object;
          await this.updatePaidFailInstallment(failedSession.id, failedSession.client_reference_id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }catch (e: any) {
      console.log(e.message)
    }
  }
  
  async trackPaymentInstallment({ paymentId }: TrackPaymentInstallmentProp): Promise<boolean> {
   const availableDocs = await this.installmentModel.countDocuments({ payment: paymentId, status: InstallmentStatus.Pending }).exec();   
   return availableDocs > 0;
  }
  
  async updatePaymentStatus({ paymentId }: { paymentId: string }):   Promise<PaymentDocument | null> {
      return await this.paymentModel.findByIdAndUpdate(paymentId, {status: PaymentStatus.COMPLETED}).exec();
  }

  async getPaymentInstallments(paymentId: string) {
    return await this.installmentModel.find({ payment: paymentId }).exec()
  }
  
  async getInstallmentById(installmentId: string) {
    return await this.installmentModel.findById(installmentId).exec();
  }
  
  async getPaymentByDocId(docId: string) {
    return await this.paymentModel.findOne({ clientId: docId }).exec();
  }
}
