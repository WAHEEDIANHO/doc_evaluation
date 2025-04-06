import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentDocument } from './payment';


export enum InstallmentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
}

export type InstallmentDoc = HydratedDocument<Installment>

@Schema()
export class Installment {
  @Prop({ type: String, required: true })
  link: string;
  @Prop({ type: String, enum: InstallmentStatus,  default: InstallmentStatus.Pending })
  status: InstallmentStatus;
  @Prop({ type: String })
  paidAt: Date;
  @Prop({ type: String, required: true })
  installmentId: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Payment', required: true })
  payment: PaymentDocument;
}

export const InstallmentSchma = SchemaFactory.createForClass(Installment);