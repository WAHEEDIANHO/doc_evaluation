import { PaginationReqDto } from '../../utils/dto/pagination-req.dto';
import { DocEnv, Status } from '../entities/doc_env.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TestimonialStatus } from '../../testimonial/entities/testimonial.entity';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DocEnvQueryDto extends PaginationReqDto<DocEnv> {

  @ApiProperty({ enum: [0,1,2,3,4], required: false })
  @IsEnum(Status, {message: "value must be one of the following: 0 -> Pending, 1 -> Submission Review, 2 -> Agreement Signed, 3-> Payment received, 4 -> Task Completed"})
  status: number | Status;

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