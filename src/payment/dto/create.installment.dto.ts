import { ArrayNotEmpty, IsArray, IsEmail, IsMongoId, IsNumber, IsUUID, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstallmentDto {
  
  @ApiProperty()
  @IsNumber({maxDecimalPlaces: 2})
  amount: number;
  
  
  @ApiProperty()
  @IsNumber({maxDecimalPlaces: 0})
  no_of_installment: number;
  
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, {each: true})
  installment_schedule_percent: Array<number>;
  
  @ApiProperty()
  @IsMongoId()
  clientId: string
  
}