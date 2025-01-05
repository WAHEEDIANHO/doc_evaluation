import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AppResponseDto } from '../app.response.dto';
import { Response } from 'express';
import { ValidationPipe } from '../utils/validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly response: AppResponseDto
  ) { }

  
  @ApiResponse({type: AppResponseDto })
  @Post()
  @UseGuards(AuthGuard, AdminAuthGuard)
  async create(@Res() res: Response, @Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<Response> {
    await this.userService.createUser(createUserDto);
    this.response.message = 'User created successfully';
    this.response.status = HttpStatus.CREATED;
    return res.status(HttpStatus.CREATED).json(this.response);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
