import { Injectable, Query } from '@nestjs/common';
import { CreateDocEnvDto, QueryDto } from './dto/create-doc_env.dto';
import { UpdateDocEnvDto } from './dto/update-doc_env.dto';
import { DocEnv, Status } from './entities/doc_env.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerserviceService } from '../mailerservice/mailerservice.service';
import { PaginationReqDto } from '../utils/dto/pagination-req.dto';
import { PaginatedResultDto } from '../utils/dto/paginated-result.dto';

@Injectable()
export class DocEnvService {
  
  constructor(
    @InjectModel(DocEnv.name) private docEnvModel: Model<DocEnv>,
    private readonly mailerService: MailerserviceService
    ) { 
  }
  
  async create(createDocEnvDto: CreateDocEnvDto) {
    const doc_env =  new this.docEnvModel(createDocEnvDto);
    const doc: any = await doc_env.save();
    // console.log(doc.email)
    this.mailerService.sendMail(doc._id);
    this.mailerService.submissionConfirmationLink(doc._id, {email: doc.email});
    return doc;
  }

  async findAll(paginationReqDto: PaginationReqDto<DocEnv>): Promise<PaginatedResultDto> {
    const { limit = 10, cursor, order = 'DESC', cursorField = '_id' } = paginationReqDto;
    const sortOrder = order === 'ASC' ? 1 : -1;

    const filter: any = cursor
      ? { [cursorField]: { [sortOrder === 1 ? '$gt' : '$lt']: cursor } }
      : {};

    console.log(filter)
    const res = await this.docEnvModel
      .find({ ...filter })
      .sort({ [cursorField]: sortOrder as 1 | -1 })
      .limit(limit+1)
      .exec();  
    
    const nextCursor = res.length > limit ? res.pop() : null;
    
    return {
      data: res,
      hasNextPage: !!nextCursor,
      nextCursor: nextCursor ? nextCursor[cursorField] : null,
      previousCursor: cursor,
    }
  
  }

  async findOne(email: string) {
    return await this.docEnvModel.findOne({email}).exec();
  }

  async findById(id: string) {
    return await this.docEnvModel.findById(id).exec();
  }

  async update(id: string, updateDocEnvDto: { status: string }): Promise<void> {
    const doc: any = await this.docEnvModel.findById(id);
    if(doc == null) return;
    await this.docEnvModel.findByIdAndUpdate(id, {status: updateDocEnvDto.status}).exec();
    // console.log(updateDocEnvDto.status, Status.APPROVED.toString())
    if (updateDocEnvDto.status == Status.APPROVED) {
      console.log("update")
      // this.mailerService.sendMail(doc.email);
      this.mailerService.sendConfirmationMail(id,  {email: doc.email});
    }else if (updateDocEnvDto.status == Status.REJECTED) {
      console.log("rejected");
    }
    return;
    // return `This action updates a #${id} docEnv`;
  }

  async  remove(email: string) {
     return await this.docEnvModel.findOneAndDelete({email}).exec();
  }
}
