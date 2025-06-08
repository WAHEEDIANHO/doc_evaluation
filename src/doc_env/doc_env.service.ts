import { Injectable } from '@nestjs/common';
import { CreateDocEnvDto } from './dto/create-doc_env.dto';
import { DocEnv, Status } from './entities/doc_env.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerserviceService } from '../mailerservice/mailerservice.service';
import { PaginatedResultDto } from '../utils/dto/paginated-result.dto';
import { PaginationReqDto } from '../utils/dto/pagination-req.dto';

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
    // this.mailerService.sendMail(doc._id);
    this.mailerService.submissionConfirmationLink(doc._id, {email: doc.email});
    return doc;
  }

  async findAll(paginationReqDto: PaginationReqDto<DocEnv>): Promise<PaginatedResultDto> {
    const { limit = 10, cursor, order = 'DESC', cursorField = '_id' } = paginationReqDto;

    ['cursor', 'limit', 'order', 'cursorField'].forEach(key => delete paginationReqDto[key]);
    const sortOrder = order === 'ASC' ? 1 : -1;

    const filter: any = cursor
      ? { [cursorField]: { [sortOrder === 1 ? '$gt' : '$lt']: Types.ObjectId.createFromHexString(cursor) } }
      : {};

    const res = await this.docEnvModel
      .find({ ...paginationReqDto, ...filter })
      .sort({ [cursorField]: sortOrder as 1 | -1 })
      .limit(limit + 1)
      .exec();

    let hasNextPage = false;
    let hasPreviousPage = false;
    let nextCursor = null;
    let previousCursor = null;
    let data = res;

    // console.log(order, "order is ", order == 'ASC')
    if (order == 'ASC') {
      if (res.length > limit) {
        hasPreviousPage = true;
        data = res.slice(0, limit);
        // console.log(data)
        previousCursor = hasPreviousPage ? data[data.length - 1][cursorField] : null;
      } else if (res.length > 0) {
        previousCursor = hasPreviousPage ? data[data.length - 1][cursorField] : null;
      }

      if (data.length > 0) {
        nextCursor = !!cursor ? data[0][cursorField] : null;
        hasNextPage = !!cursor;
      }
      
      data = data.reverse()
    }
    
    else {
      if (res.length > limit) {
        hasNextPage = true;
        data = res.slice(0, limit);
        nextCursor = hasNextPage ? data[data.length - 1][cursorField] : null;
      } else if (res.length > 0) {
        nextCursor = hasNextPage ? data[data.length - 1][cursorField] : null;
      }

      if (data.length > 0) {
        previousCursor = !!cursor ? data[0][cursorField] : null;
        hasPreviousPage = !!cursor;
      }  
    }
    

    return {
      data,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    };
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
    // if (updateDocEnvDto.status == Status.APPROVED) {
    //   console.log("update")
    //   // this.mailerService.sendMail(doc.email);
    //   this.mailerService.sendConfirmationMail(id,  {email: doc.email});
    // }else if (updateDocEnvDto.status == Status.REJECTED) {
    //   console.log("rejected");
    // }
    return;
    // return `This action updates a #${id} docEnv`;
  }

  async  remove(email: string) {
     return await this.docEnvModel.findOneAndDelete({email}).exec();
  }
}
