import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { DocEnvService } from './doc_env.service';
import { CreateDocEnvDto } from './dto/create-doc_env.dto';
import { UpdateDocEnvDto } from './dto/update-doc_env.dto'
import { Response } from 'express'
import { DocEnv } from './entities/doc_env.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationPipe } from '../validation.pipe';

class QueryDto {
  [key: string]: any
}
@Controller('doc-env')
export class DocEnvController {
  constructor(private readonly docEnvService: DocEnvService) {}

  @Post()
  async create(@Res() res: Response, @Body(new ValidationPipe()) createDocEnvDto: CreateDocEnvDto) {
    return res.status(HttpStatus.OK).json(await this.docEnvService.create(createDocEnvDto));
  }

  @Get()
  async findAll(@Res() res: Response, @Query() query: QueryDto): Promise<Response> {
    const docs = await this.docEnvService.findAll(query);
    return res.status(HttpStatus.OK).json(docs)
  }

  @Get(':email')
  async findOne(@Res() res: Response, @Param('email') email: string) {
    const doc = await this.docEnvService.findOne(email);
    return res.status(HttpStatus.OK).json(doc);
  }
  // @Patch(':id')
  // update(@Param('email') email: string, @Body() updateDocEnvDto: UpdateDocEnvDto) {
  //   return this.docEnvService.update(email, updateDocEnvDto);
  // }

  @Delete(':email')
  async remove(@Res() res: Response, @Param('email') email: string) {
    return res.status(HttpStatus.OK).json(await this.docEnvService.remove(email));
  }
}
