import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({})
export class CloudinaryModule {
  providers: [CloudinaryService];
  controllers: [CloudinaryController];
}
