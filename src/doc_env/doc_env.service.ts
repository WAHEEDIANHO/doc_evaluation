import { Injectable, Query } from '@nestjs/common';
import { CreateDocEnvDto } from './dto/create-doc_env.dto';
import { UpdateDocEnvDto } from './dto/update-doc_env.dto';
import { DocEnv } from './entities/doc_env.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DocEnvService {
  
  constructor(@InjectModel(DocEnv.name) private docEnvModel: Model<DocEnv>) { 
  }
  
  create(createDocEnvDto: CreateDocEnvDto) {
    const doc_env =  new this.docEnvModel(createDocEnvDto);
    return doc_env.save();
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
