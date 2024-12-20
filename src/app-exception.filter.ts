import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { MongooseError } from 'mongoose';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
  catch(exception: any, host: ArgumentsHost): void {
    const ctx =  host.switchToHttp();
    
    const { httpAdapter } = this.httpAdapterHost;
    
    console.log(exception?.message)
    
    console.log(exception);
    if (exception.code === 11000) {
        // console.log('MongooseError', exception);
        const httpStatus = HttpStatus.CONFLICT;
        return httpAdapter.reply(ctx.getResponse<Response>(), {
          statusCode: HttpStatus.CONFLICT,
          // timestamp: new Date().toISOString(),
          message: "Email already exists"
      }, httpStatus);
    }
    
      const httpStatus = exception instanceof HttpException ?
        exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const responseBody = {  
      statusCode: httpStatus,
      // timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception instanceof Error ? exception.message : exception
    }
    
    httpAdapter.reply(ctx.getResponse<Response>(), responseBody, httpStatus);
  }
}