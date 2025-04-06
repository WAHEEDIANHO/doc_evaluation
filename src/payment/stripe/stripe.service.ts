import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export type GenerateInstallmentLinksProps = {
  amount: number;
  installments: number;
  clientId: string;
  paymentId: string;
}

export type PaymentLink = {
  url: string;
  id: string;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;
  
  constructor(private configService: ConfigService) {
    console.log(configService.get("STRIPE_SECRET_KEY"))
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
  }

  async generateInstallmentLinks({ amount, installments, clientId, paymentId }: GenerateInstallmentLinksProps): Promise<PaymentLink[]> {
    if (installments < 1) {
      throw new BadRequestException('Installments must be at least 1');
    }

    const installmentAmount: number = Number((amount / installments).toFixed(2)); // Round up for accuracy
    const paymentLinks: PaymentLink[] = [];

    for (let i = 0; i < installments; i++) {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Installment Payment ${i + 1}/${installments}`,
              },
              unit_amount: installmentAmount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        success_url: `${this.configService.get('BASE_SERVER_URL')}/payment/success?paymentId=${paymentId}`,
        cancel_url: `${this.configService.get('BASE_SERVER_URL')}/payment/cancel`,
      });
    
      console.log(session.id)
      paymentLinks.push({url: session.url, id: session.id});
    }

    return paymentLinks;
  }

  // async handleWebhookEvent(req: Request): Promise<void> {
  //   const sig = req.header['stripe-signature'];
  //   const endpointSecret = this.configService.get('WEBHOOK_SIGNING_SECRET');
  //
  //   try {
  //     const event = this.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  //     console.log('Webhook event received:', event);
  //
  //     // Handle the event
  //     switch (event.type) {
  //       case 'checkout.session.completed':
  //         // Payment was successful
  //         console.log('Payment succeeded:', event.data.object);
  //         break;
  //       case 'checkout.session.async_payment_failed':
  //         // Payment failed
  //         console.log('Payment failed:', event.data.object);
  //         break;
  //       default:
  //         console.log(`Unhandled event type ${event.type}`);
  //     }
  //   }catch (e: any) {
  //     console.log(e.message)
  //   }
  // }
  
  getStripe(): Stripe {
    return this.stripe;
  }
}
