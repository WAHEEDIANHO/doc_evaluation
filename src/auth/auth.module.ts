import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UtilsModule, UserModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('SECRET_KEY'),
      signOptions: { expiresIn: '60s' },
    }),
    global: true,
  })],
  controllers: [AuthController],
  providers: [AuthService],
  // exports: [AuthGuard],
})
export class AuthModule {}
