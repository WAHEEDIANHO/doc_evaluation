import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DocEnvService } from './doc_env.service';
import { CreateDocEnvDto, QueryDto } from './dto/create-doc_env.dto';
import { Response } from 'express'
import { ValidationPipe } from '../validation.pipe';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateDocEnvDto } from './dto/update-doc_env.dto';
import { Status } from './entities/doc_env.entity';
import { AppResponseDto } from '../app.response.dto';


@Controller('doc-env')
export class DocEnvController {
  constructor(
    private readonly docEnvService: DocEnvService,
    private readonly _res: AppResponseDto
  ) {}

  @Post()
  async create(@Res() res: Response, @Body(new ValidationPipe()) createDocEnvDto: CreateDocEnvDto) {
    return res.status(HttpStatus.OK).json(await this.docEnvService.create(createDocEnvDto));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiQuery({type: QueryDto})
  @Get()
  async findAll(@Res() res: Response, @Query() query: Record<string, string>): Promise<Response> {
    const docs = await this.docEnvService.findAll(query);
    return res.status(HttpStatus.OK).json(docs)
  }

  // @Get(':email')
  // async findOne(@Res() res: Response, @Param('email') email: string) {
  //   const doc = await this.docEnvService.findOne(email);
  //   return res.status(HttpStatus.OK).json(doc);
  // }


  @Get(':id')
  async findById(@Res() res: Response, @Param('id') id: string) {
    const doc = await this.docEnvService.findById(id);
    return res.status(HttpStatus.OK).json(doc);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateDocEnvDto: UpdateDocEnvDto,
    @Res() res: Response
  ) {
    if (updateDocEnvDto.status > 2 || updateDocEnvDto.status < 0) throw new BadRequestException('Invalid status value');
    await this.docEnvService.update(id, { status: Object.keys(Status)[updateDocEnvDto.status] });
    this._res.message = 'updated successfully';
    this._res.status = HttpStatus.OK;
    return res.status(HttpStatus.OK).json(this._res);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':email')
  async remove(@Res() res: Response, @Param('email') email: string) {
    return res.status(HttpStatus.OK).json(await this.docEnvService.remove(email));
  }
}
