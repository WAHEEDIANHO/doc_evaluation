import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerserviceService } from './mailerservice/mailerservice.service';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // this.mailerService.sendMail()
    //   .then(() => {
    //     console.log("sending mail");
    //   })
    //   .catch((e) => {
    //     console.log("error sending mail\n" + e);
    //     // return "Can't send mail now"
    //   });
      return 'Hello Doc Evaluation!';
  }
}
