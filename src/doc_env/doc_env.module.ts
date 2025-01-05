import { Module } from '@nestjs/common';
import { DocEnvService } from './doc_env.service';
import { DocEnvController } from './doc_env.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocEnv, DocEnvSchema } from './entities/doc_env.entity';
import { MailerserviceModule } from '../mailerservice/mailerservice.module';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { AppResponseDto } from '../app.response.dto';

@Module({
  imports: [AuthModule, UtilsModule, MongooseModule.forFeature([{name: DocEnv.name, schema: DocEnvSchema}]), MailerserviceModule],
  controllers: [DocEnvController],
  providers: [DocEnvService, AppResponseDto],
})
export class DocEnvModule {}
