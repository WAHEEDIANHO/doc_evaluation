import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UtilsModule } from '../utils/utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AppResponseDto } from '../app.response.dto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, AppResponseDto, AdminAuthGuard, AuthGuard],
  imports: [UtilsModule, MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  exports: [UserService],
})
export class UserModule {}