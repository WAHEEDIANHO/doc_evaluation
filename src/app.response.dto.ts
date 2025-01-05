import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class AppResponseDto {
  @ApiProperty()
  status: number;
  @ApiProperty()
  message?: string;
  @ApiProperty()
  data: any;
}