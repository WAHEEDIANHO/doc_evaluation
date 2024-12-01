import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { MongooseError } from 'mongoose';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx =  host.switchToHttp();
    
    const { httpAdapter } = this.httpAdapterHost;
    
    // console.log('exception', exception instanceof MongooseError);
    
    const httpStatus = exception instanceof HttpException ? 
      exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const responseBody = {  
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception instanceof Error ? exception.message : exception
    }
    
    httpAdapter.reply(ctx.getResponse<Response>(), responseBody, httpStatus);
  }
}