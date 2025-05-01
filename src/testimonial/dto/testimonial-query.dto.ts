import { PaginationReqDto } from '../../utils/dto/pagination-req.dto';
import { Testimonial, TestimonialStatus } from '../entities/testimonial.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';


export class TestimonialQueryDto extends PaginationReqDto<Testimonial> {
  @ApiProperty({ required: false, enum: TestimonialStatus })
  @IsEnum(TestimonialStatus, {message: "value must be one of the following: PENDING, APPROVED, REJECTED"})
  status: TestimonialStatus;
}