import { Injectable, Query } from '@nestjs/common';
import { CreateDocEnvDto } from './dto/create-doc_env.dto';
import { UpdateDocEnvDto } from './dto/update-doc_env.dto';
import { DocEnv } from './entities/doc_env.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerserviceService } from '../mailerservice/mailerservice.service';

@Injectable()
export class DocEnvService {
  
  constructor(
    @InjectModel(DocEnv.name) private docEnvModel: Model<DocEnv>,
    private readonly mailerService: MailerserviceService
    ) { 
  }
  
  async create(createDocEnvDto: CreateDocEnvDto) {
    const doc_env =  new this.docEnvModel(createDocEnvDto);
    const doc = await doc_env.save();
    // console.log(doc.email)
    this.mailerService.sendMail(doc.email);
    return doc;
  }

  async findAll(query: { [key: string]: any }): Promise<DocEnv[]> {
    return await this.docEnvModel.find(query).exec();
  }

  async findOne(email: string) {
    return await this.docEnvModel.findOne({email}).exec();
  }

  async findById(id: string) {
    return await this.docEnvModel.findById(id).exec();
  }

  // update(id: number, updateDocEnvDto: UpdateDocEnvDto) {
  //   return `This action updates a #${id} docEnv`;
  // }

  async  remove(email: string) {
     return await this.docEnvModel.findOneAndDelete({email}).exec();
  }
}
