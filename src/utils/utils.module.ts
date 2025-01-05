import { Module } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { ExtractToken } from './exract-token';

@Module({
  providers: [ValidationPipe, ExtractToken],
  exports: [ValidationPipe, ExtractToken]
})
export class UtilsModule {}
