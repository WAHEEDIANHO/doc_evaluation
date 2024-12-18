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
      useFactory: async () => ({
        transport: "smtps://safiuwaheed2023@gmail.com:fyahqabttxaiejet@smtp.gmail.com",
        // transport: "smtps://user@domain.com:pass@smtp.domain.com",
        defaults: {
          from: '"nest-modules" <noreply@localhost>'
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
