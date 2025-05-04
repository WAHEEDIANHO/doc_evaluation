import { PaginationReqDto } from '../../utils/dto/pagination-req.dto';
import { DocEnv, Status } from '../entities/doc_env.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TestimonialStatus } from '../../testimonial/entities/testimonial.entity';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DocEnvQueryDto extends PaginationReqDto<DocEnv> {

  @ApiProperty({ enum: Status, required: false })
  @IsEnum(Status, {message: "value must be one of the following: PENDING, PROCESSING, APPROVED, REJECTED"})
  status: Status;

  @ApiProperty({ required: false })
  @IsString()
  email: string
  
  @ApiProperty({ required: false })
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  
  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  endDate: Date
}