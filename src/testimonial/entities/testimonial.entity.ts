import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TestimonialStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}


@Schema({ timestamps: true })
export class Testimonial 
{
  @Prop({type: String, required: true})
  name: string;
  
  @Prop({type: String, required: true})
  message: string;
  
  @Prop({type: String, enum: TestimonialStatus, default: TestimonialStatus.PENDING,  required: true})
  status: TestimonialStatus;
  
}


export const TestimonialSchema = SchemaFactory.createForClass(Testimonial)
