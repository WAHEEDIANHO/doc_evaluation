import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './app-exception.filter';
import { raw } from 'express';
// import { AppExceptionFilter } from '../app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use("/payment/webhook", raw({ type: 'application/json' }))
  app.enableCors();
  
  app.useGlobalFilters(new AppExceptionFilter(app.get(HttpAdapterHost)));
  
  //swagger docs
  const config = new DocumentBuilder()
    .setTitle("DOc Evaluation")
    .setDescription("")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  
  const docs = SwaggerModule.createDocument(app,  config);
  SwaggerModule.setup('api', app,  docs)
  await app.listen(process.env.PORT ?? 3030, '0.0.0.0');
  
}
bootstrap();
