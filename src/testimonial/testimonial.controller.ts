import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../utils/validation.pipe';
import { TestimonialQueryDto } from './dto/testimonial-query.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';


@ApiTags("Testmonial")
@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(createTestimonialDto);
  }

  @Get()
  async  findAll(@Query() query: TestimonialQueryDto, @Res() res: Response): Promise<Response> {
    const result = await this.testimonialService.findAll(query)
    return res.status(HttpStatus.OK).json({ message: "successfully retrieve data", statusCode: 200,  data: result });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(id);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialService.update(id, updateTestimonialDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('bulk-update')
  async bulkUpdate(@Body(new ValidationPipe()) updateTestimonialDto: UpdateTestimonialDto, @Res() res: Response): Promise<Response> {
    const isAllUpdate = await this.testimonialService.bulkUpdate(updateTestimonialDto);
    if (isAllUpdate.length > 0) 
    {
      return res.status(HttpStatus.BAD_REQUEST).json({data: isAllUpdate})
    }
    return res.status(HttpStatus.OK).json({message: 'successfully update testimonials'});
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
