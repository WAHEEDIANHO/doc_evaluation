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
  
  async sendMail (id: string) {
    try {
      // console.log(process.cwd() + "current")
      const template: string = await this.renderTemplateFile(id);
      // console.log(template)
      await this.mailerService.sendMail({
        to: "info@elitepetitions.com", //"info@elitepetitions.com waheedianho65@gmail.com" gran24jefe10@gmail.com,
        // to: "waheedianho65@gmail.com", //"info@elitepetitions.com waheedianho65@gmail.com" gran24jefe10@gmail.com,
        // from: 'noreply@elitepetition.com', // sender address
        subject: 'Document Evaluation Entry', // Subject line
        // text: 'welcome', // plaintext body
        html: template, // HTML body content
      })
      console.log("mail sent successfully")
    }catch (e) {
      console.log("error sending mail", e);
    }
  }
  
  private async renderTemplateFile(id: string): Promise<string> {
    return  await ejs.renderFile(path.join(process.cwd() + "/src/mailerservice/template", 'mail.ejs') , {
      baseUrl: this.configService.get<string>("CLIENT_URL"),
      id
    });
  }
}
