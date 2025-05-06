import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateBulkTestimonialDto } from './dto/update-bulk-testimonial.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Testimonial } from './entities/testimonial.entity';
import { Model } from 'mongoose';
import { PaginationReqDto } from '../utils/dto/pagination-req.dto';
import { DocEnv, Status } from '../doc_env/entities/doc_env.entity';
import { PaginatedResultDto } from '../utils/dto/paginated-result.dto';
import { UpdateSingleTestimonialDto } from './dto/update-single-testimonial.dto';

@Injectable()
export class TestimonialService {
  
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>
  ) {
  }
  
  async create(createTestimonialDto: CreateTestimonialDto) {
    const testimonial =  new this.testimonialModel(createTestimonialDto);
    const doc: any = await testimonial.save();
    // console.log(doc.email)
    // this.mailerService.sendMail(doc._id);
    // this.mailerService.submissionConfirmationLink(doc._id, {email: doc.email});
    return doc; 
  }

  async findAll(query: PaginationReqDto<DocEnv>): Promise<PaginatedResultDto> {
    const { limit = 10, cursor, order = 'DESC', cursorField = '_id' } = query;
    
    ['cursor', 'limit', 'order', 'cursorField'].forEach(key => delete query[key]);
    
    const sortOrder = order === 'ASC' ? 1 : -1;

    const filter: any = cursor
      ? { [cursorField]: { [sortOrder === 1 ? '$gte' : '$lte']: cursor } }
      : {};

    console.log(filter)
    const res = await this.testimonialModel
      .find({...query, ...filter })
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

  async findOne(id: string): Promise<Testimonial> {
    return await this.testimonialModel.findById(id).exec();
  }

  async update(id: string, updateTestimonialDto: UpdateSingleTestimonialDto): Promise<void> {
    await this.testimonialModel.findByIdAndUpdate(id, { status: updateTestimonialDto.status }).exec();
  }
  
  async bulkUpdate(updateTestimonialDto: UpdateBulkTestimonialDto): Promise<any> {
    const errors: { id: string; error: any }[] = [];

    for (const id of updateTestimonialDto.testimonialIds) {
      try {
        await this.testimonialModel.findByIdAndUpdate(id, { status: Status.PROCESSING });
      } catch (error: any) {
        errors.push({ id, error: error?.message });
      }
    }

    return errors;
  }

  async remove(id: string): Promise<void> {
     await this.testimonialModel.findByIdAndDelete(id).exec();
  }
}
