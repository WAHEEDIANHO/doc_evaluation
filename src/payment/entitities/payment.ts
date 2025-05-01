import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,  Schema as MongooseSchema} from 'mongoose';
import { DocEnv, DocEnvDocument } from '../../doc_env/entities/doc_env.entity';


export type PaymentDocument = HydratedDocument<Payment>;

export enum   PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

@Schema()
export class Payment {

  @Prop({type: Number, required: true})
  amount: number;
  @Prop({type: Number, required: true})
  no_of_installment: number;
  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'DocEnv', required: true, unique: true})
  clientId: DocEnvDocument;
  @Prop({type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING})
  status: PaymentStatus;
  
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)

//add timestamp to schema
PaymentSchema.set('timestamps', true);