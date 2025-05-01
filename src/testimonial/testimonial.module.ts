import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocEnv, DocEnvSchema } from '../doc_env/entities/doc_env.entity';
import { Testimonial, TestimonialSchema } from './entities/testimonial.entity';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [AuthModule, UtilsModule,  MongooseModule.forFeature([{name: Testimonial.name, schema: TestimonialSchema}])],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule 
{}