import { Module } from '@nestjs/common';
import { DocEnvService } from './doc_env.service';
import { DocEnvController } from './doc_env.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocEnv, DocEnvSchema } from './entities/doc_env.entity';
import { MailerserviceModule } from '../mailerservice/mailerservice.module';

@Module({
  imports: [MongooseModule.forFeature([{name: DocEnv.name, schema: DocEnvSchema}]), MailerserviceModule],
  controllers: [DocEnvController],
  providers: [DocEnvService],
})
export class DocEnvModule {}
