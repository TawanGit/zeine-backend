import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../database/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(createContactDto: CreateContactDto, photo: Express.Multer.File) {
    const userId = Number(createContactDto.userId);
    if (isNaN(userId) || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }

    const photoUrl = await this.cloudinaryService.uploadImage(photo);
    if (!photoUrl) {
      throw new BadRequestException('Failed to upload photo');
    }

    return await this.prisma.contact.create({
      data: {
        email: createContactDto.email,
        name: createContactDto.name,
        phone: createContactDto.phone,
        userId: userId,
        photo: photoUrl,
      },
    });
  }

  async findAll(letter: string | undefined, userId: number | undefined) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }

    const contacts = await this.prisma.contact.findMany({
      where: {
        userId,
        ...(letter
          ? {
              name: {
                startsWith: letter,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });

    if (!contacts.length) {
      throw new NotFoundException('No contacts found for this user');
    }

    return contacts;
  }
}
