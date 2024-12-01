import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateDocEnvDto {
  // @ApiProperty()
  // userId: string;
  @ApiProperty()
  @IsString()
  phone_number: string
  @ApiProperty()
  @IsEmail()
  email: string
  @ApiProperty()
  category_petitioning_for: string
  @ApiProperty()
  field_of_specialization: string
  @ApiProperty()
  highest_level_of_education: string
  @ApiProperty()
  no_of_year_experience: number
  @ApiProperty()
  recognize_price_award?: string
  @ApiProperty()
  no_of_recognize_price?: string
  @ApiProperty()
  evidence_membership_assoc?: string
  @ApiProperty()
  no_evidence_membership_assoc?: string
  @ApiProperty()
  evidence_published_material?: string
  @ApiProperty()
  no_published_material?: string
  @ApiProperty()
  judge_other_work: boolean
  @ApiProperty()
  no_of_work_judged: number
  @ApiProperty()
  business_related_contribution?: string
  @ApiProperty()
  no_business_related_contribution?: number
  @ApiProperty()
  authored_scholarly_article: boolean
  @ApiProperty()
  no_authored_scholarly_article: number
  @ApiProperty()
  has_work_display: boolean
  @ApiProperty()
  no_work_display?: number
  @ApiProperty()
  commanded_high_salary: boolean
  @ApiProperty()
  possess_commercial_success: boolean
  @ApiProperty()
  published_material_in_profession: boolean
  @ApiProperty()
  no_published_material_in_profession?: number
}
