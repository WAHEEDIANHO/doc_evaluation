import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe/stripe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entitities/payment';
import { Installment, InstallmentSchma } from './entitities/installment';
import { MailerserviceModule } from '../mailerservice/mailerservice.module';
import { DocEnvModule } from '../doc_env/doc_env.module';
import { DocEnvService } from '../doc_env/doc_env.service';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [AuthModule, UtilsModule, DocEnvModule, MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema },
    { name: Installment.name, schema: InstallmentSchma }]), MailerserviceModule, DocEnvModule],
  providers: [PaymentService, StripeService],
  controllers: [PaymentController]
})
export class PaymentModule {}
