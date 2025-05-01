import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateTestimonialDto {
  
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsString()
  message: string;
}
