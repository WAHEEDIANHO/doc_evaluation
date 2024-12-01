import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Prop } from '@nestjs/swagger';

export type DocEnvDocument = HydratedDocument<DocEnv>

@Schema()
export class DocEnv {
  @Prop()
  phone_number: string
  @Prop({type: String, unique: true, required: true})
  email: string
  @Prop()
  category_petitioning_for: string
  @Prop()
  field_of_specialization: string
  @Prop()
  highest_level_of_education: string
  @Prop()
  no_of_year_experience: number
  @Prop()
  recognize_price_award?: string
  @Prop()
  no_of_recognize_price?: string
  @Prop()
  evidence_membership_assoc?: string
  @Prop()
  no_evidence_membership_assoc?: string
  @Prop()
  evidence_published_material?: string
  @Prop()
  no_published_material?: string
  @Prop()
  judge_other_work: boolean
  @Prop()
  no_of_work_judged: number
  @Prop()
  business_related_contribution?: string
  @Prop()
  no_business_related_contribution?: number
  @Prop()
  authored_scholarly_article: boolean
  @Prop()
  no_authored_scholarly_article: number
  @Prop()
  has_work_display: boolean
  @Prop()
  no_work_display?: number
  @Prop()
  commanded_high_salary: boolean
  @Prop()
  possess_commercial_success: boolean
  @Prop()
  published_material_in_profession: boolean
  @Prop()
  no_published_material_in_profession?: number
  
}


const DocEnvSchema = SchemaFactory.createForClass(DocEnv);

// DocEnvSchema.set("toJSON", {
//   transform: doc => (doc,  ret) => {
//     delete ret._id;
//     delete ret.__v;
//
//     ret.id = doc._id;
//     return ret;
//   }
// })

export { DocEnvSchema }