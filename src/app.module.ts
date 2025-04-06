import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocEnvModule } from './doc_env/doc_env.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }), 
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('DATABASE_URL')
    })
  }), 
    DocEnvModule, 
    FileUploadModule, AuthModule, PaymentModule, PaymentModule
    // UserModule
    // MailerserviceModule,
    // MailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
