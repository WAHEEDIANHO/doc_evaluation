import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request,  Response} from 'express';
import { PaymentService } from './payment.service';
import { CreateInstallmentDto } from './dto/create.installment.dto';
import { ValidationPipe } from '../validation.pipe';
import { ConfigService } from '@nestjs/config';
import { Schema } from 'mongoose';
import { MailerserviceService } from '../mailerservice/mailerservice.service';
import { DocEnvService } from '../doc_env/doc_env.service';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';



@Controller('payment')
export class PaymentController {
  
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mailService: MailerserviceService,
    private readonly docEnvService: DocEnvService,
    private readonly configService: ConfigService
    ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)  
  @Post('create-installment')
  async createInstallment(@Res() res: Response, @Req() @Body(new ValidationPipe) req: CreateInstallmentDto): Promise<Response> {
    const { amount, no_of_installment, clientId } = req;
    if (!amount || !no_of_installment) {
      return res.status(400).json({ message: 'Amount and number of installments are required' });
    }
    if (isNaN(amount) || isNaN(no_of_installment)) {
      return res.status(400).json({ message: 'Amount and number of installments must be numbers' });
    }
    if (amount <= 0 || no_of_installment <= 0) {
      return res.status(400).json({ message: 'Amount and number of installments must be greater than zero' });
    }
    if (no_of_installment > 12) {
      return res.status(400).json({ message: 'Number of installments cannot exceed 12' });
    }
    // Assuming you have a service method to create the payment intent
    
    const doc = await this.docEnvService.findById(clientId);
    if (!doc) throw new NotFoundException(`Document with ID ${clientId} not found`);
    
    const payment = await this.paymentService.createPayment({ amount, installments: no_of_installment, clientId });
    const paymentIntents  = await this.paymentService.createPaymentIntent({ amount, installments: no_of_installment,  clientId, paymentId: payment.id } );

    let installmentDoc: any[] = [];
    for (const paymentIntent of paymentIntents) {
      const installment = await this.paymentService.savePaymentIntent({ link: paymentIntent.url, paymentId: payment._id, installmentId: paymentIntent.id });
      installmentDoc.push({ link: installment.link, paymentId: installment.payment, status: installment.status });
    }
    
    // const installmentDoc = paymentIntent.map(async (installment) => {
    //   return await this.paymentService.savePaymentIntent({ link: installment.url, paymentId: payment._id, installmentId: installment.id });
    // })
    //
    
    this.mailService.sendPaymentLink(doc.email, installmentDoc);
    console.log(installmentDoc)
    return res.status(200).json({ message: 'Installment created', data: installmentDoc });
  }
  
  @ApiExcludeEndpoint()
  @Get('success')
  async success(@Res() res: Response, @Req() req: Request): Promise<void> {
    const paymentId: string = req.query.paymentId as string;
    if (!paymentId) return;
    const payment = await this.paymentService.trackPaymentInstallment({ paymentId });
    if (!payment) await this.paymentService.updatePaymentStatus({ paymentId });
    
    res.redirect('https://www.google.com');
  }
  
  @ApiExcludeEndpoint()
  @Get('cancel')
  async cancel(@Res() res: Response, @Req() req: Request): Promise<Response> {
    return res.status(200).json({ message: 'Payment canceled', data: req.query });
  }
  
  
  @ApiExcludeEndpoint()
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<Response> {
    console.log('Webhook received, signature ', req.headers['stripe-signature']);    
    await this.paymentService.handleWebhookEvent(req);
    return res.status(200).json({ message: 'Webhook received' });
    
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('get-payment/:documentId')
  async getPaymentByDoc(@Res() res: Response, @Param('documentId') documentId: string): Promise<Response> {
      if (!documentId) throw new BadRequestException('documentId is required');
      const payment = await this.paymentService.getPaymentByDocId(documentId);
      if (!payment) throw new NotFoundException(`Document with ID ${documentId} have no payment`);
      return res.status(200).json({ message: 'Payment', data: payment });
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('get-payment-installments/:paymentId')
  async getPaymentInstallment(@Res() res: Response, @Param('paymentId') paymentId: string): Promise<Response> {
    // const paymentId: string = req.params.id;
    if (!paymentId) throw new BadRequestException('paymentId is required');
    const payment = await this.paymentService.getPaymentInstallments(paymentId);
    if (!payment) throw new NotFoundException(`Document with ID ${paymentId} have no payment`);
    
    return res.status(200).json({ message: 'Payments installment', data: payment });
  }
  
  @Get('get-installment/:installmentId')
  async getInstallment(@Res() res: Response, @Param('installmentId') installmentId: string): Promise<Response> {
    if (!installmentId) throw new BadRequestException('installmentId is required');
    const installment = await this.paymentService.getInstallmentById(installmentId);
    if (!installment) throw new NotFoundException(`Document with ID ${installmentId} not found`);
    
    return res.status(200).json({ message: 'Installment', data: installment });
  }
  
  
}
