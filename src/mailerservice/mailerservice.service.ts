import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import ejs from "ejs";
import * as path from 'path';
import process from 'node:process';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailerserviceService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
    ) {}
  
  async sendMail (email: string) {
    // console.log(process.cwd() + "current")
    const template: string = await this.renderTemplateFile(email);
    // console.log(template)
    await this.mailerService.sendMail({
      to: "info@elitepetitions.com", //"waheedianho65@gmail.com" gran24jefe10@gmail.com,
      from: 'noreply@elitepetition.com', // sender address
      subject: 'Document Evalaution Entry', // Subject line
      // text: 'welcome', // plaintext body
      html: template, // HTML body content
    })
    // console.log("mail sent successfully")
  }
  
  private async renderTemplateFile(email: string): Promise<string> {
    return  await ejs.renderFile(path.join(process.cwd() + "/src/mailerservice/template", 'mail.ejs') , {
      baseUrl: this.configService.get<string>("CLIENT_URL"),
      email
    });
  }
}
