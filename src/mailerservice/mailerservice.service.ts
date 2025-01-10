import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import ejs from "ejs";
import * as path from 'path';
import process from 'node:process';
import { ConfigService } from '@nestjs/config';
// import {  } from "@nestjs-modules/mailer"

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
      await this.mail("info@elitepetitions.com", template)
      // console.log(template)
      console.log("mail sent successfully")
    }catch (e) {
      console.log("error sending mail", e);
    }
  }
  
  async sendConfirmationMail (id: string, data?: { [key: string]: any }) {
    const template: string = await this.renderTemplateFile(id, "confirm.ejs");
    await this.mail(data.email, template, "Evaluation Status");
    console.log("mail sent successfully")
  }

  async submissionConfirmationLink (id: string, data?: { [key: string]: any }) {
    const template: string = await this.renderTemplateFile(id, "sconfirm.ejs");
    await this.mail(data.email, template, "Evaluation Status");
    console.log("mail sent successfully")
  }
  
  private async renderTemplateFile(id: string, template?: string): Promise<string> {
    return  await ejs.renderFile(path.join(process.cwd() + "/src/mailerservice/template", `${ template || 'mail.ejs'}`) , {
      baseUrl: this.configService.get<string>("CLIENT_URL"),
      id
    });
  }
  
  private mail(to: string,  template: string, subject?: string):  Promise<any> {
    return this.mailerService.sendMail({
      to: to, //"info@elitepetitions.com waheedianho65@gmail.com" gran24jefe10@gmail.com,
      // to: "waheedianho65@gmail.com", //"info@elitepetitions.com waheedianho65@gmail.com" gran24jefe10@gmail.com,
      subject: subject || 'Document Evaluation Entry', // Subject line
      html: template, // HTML body content
    })
  }
}
