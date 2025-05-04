import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTestimonialDto } from './create-testimonial.dto';
import { TestimonialStatus } from '../entities/testimonial.entity';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateTestimonialDto 
{
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({each: true})
  testimonialIds: Array<string>;
  
  @ApiProperty({ enum: TestimonialStatus })
  @IsEnum(TestimonialStatus, { message: 'status must be one of the following: PENDING, APPROVED, REJECTED' })
  status: TestimonialStatus;
}
