import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationReqDto<T extends any> {
  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsString()
  cursor?: string;

  @ApiProperty({ required: false })
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

  @ApiProperty({ required: false })
  @IsString()
  cursorField?: string;
}