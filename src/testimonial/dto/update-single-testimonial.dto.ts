import { IsEnum } from 'class-validator';
import { TestimonialStatus } from '../entities/testimonial.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSingleTestimonialDto {


  @ApiProperty({ enum: TestimonialStatus })
  @IsEnum(TestimonialStatus, { message: 'status must be one of the following: PENDING, APPROVED, REJECTED' })
  status: TestimonialStatus;
}