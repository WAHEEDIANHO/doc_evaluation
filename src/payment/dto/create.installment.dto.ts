import { IsEmail, IsMongoId, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstallmentDto {
  
  @ApiProperty()
  @IsNumber({maxDecimalPlaces: 2})
  amount: number;
  
  
  @ApiProperty()
  @IsNumber({maxDecimalPlaces: 0})
  no_of_installment: number;
  
  @ApiProperty()
  @IsMongoId()
  clientId: string
  
}