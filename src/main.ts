import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './app-exception.filter';
// import { AppExceptionFilter } from '../app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AppExceptionFilter(app.get(HttpAdapterHost)));
  
  //swagger docs
  const config = new DocumentBuilder()
    .setTitle("DOc Evaluation")
    .setDescription("")
    .setVersion("1.0")
    .build();
  
  const docs = SwaggerModule.createDocument(app,  config);
  SwaggerModule.setup('api', app,  docs)
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
