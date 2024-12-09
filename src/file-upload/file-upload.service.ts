import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: 'dvhiikuch',
      api_key: '695182958177239',
      api_secret: 'oByJzH5Es1sEfPdobwuEnXpk7ek'
    })
  }
  getFileUploader() {
    return cloudinary;
  }
}
