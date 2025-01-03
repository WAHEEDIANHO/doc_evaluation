import { Module } from '@nestjs/common';
import { MailerserviceService } from './mailerservice.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import process from 'node:process';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: `smtps://${configService.get<string>('MAILER_SMTP_HOST')}:${configService.get<string>('MAILER_SMTP_KEY')}@smtp.gmail.com`,//fyahqabttxaiejet
        // transport: "smtps://user@domain.com:pass@smtp.domain.com",
        defaults: {
          from: '"elite-petitions" <noreply@localhost>'
        },
        template: {
          // dir: process.cwd() + '/src/template',
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
            inlineCssOptions: {}
          }),
          options: {
            strict: true,
          },
        }
      })
    }),
  ],
  providers: [MailerserviceService],
  exports: [MailerserviceService]
})
export class MailerserviceModule {}
