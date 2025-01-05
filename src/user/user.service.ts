import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash, hashSync } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
  }
  
  async createUser(newUser: CreateUserDto): Promise<void> {
    
    const saltRound =  10;
    
   const hashPassword = await hash(newUser.password, saltRound);
    const user = new User();
    user.email = newUser.email;
    user.username = newUser.email;
    user.password = hashPassword;

    await this.userModel.create(user)
    // this.users.push(newUser);
  }

  // findAll() {
  //   return `This action returns all user`;
  // }
  //
  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email}).exec();
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
