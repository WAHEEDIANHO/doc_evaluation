import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDocEnvDto } from './create-doc_env.dto';
import { Status } from '../entities/doc_env.entity';
import { IsNumber } from 'class-validator';

export class UpdateDocEnvDto  { //extends PartialType(CreateDocEnvDto)
  @ApiProperty()
  @IsNumber()
  status: number;
}
