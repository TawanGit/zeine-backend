import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaService } from '../database/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, PrismaService, CloudinaryService],
})
export class ContactsModule {}
