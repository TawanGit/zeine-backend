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
      throw new BadRequestException(
        'id do usuário é necessário e deve ser um número válido',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User id ${userId} não existe`);
    }

    const photoUrl = await this.cloudinaryService.uploadImage(photo);
    if (!photoUrl) {
      throw new BadRequestException('Falha ao fazer upload da foto');
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
      throw new BadRequestException('Id do usuário é necessário');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`usuario com ID ${userId} não existe`);
    }

    if (letter && letter.length > 1) {
      throw new BadRequestException('A letra deve ter apenas um caractere');
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
      throw new NotFoundException('Você não possui contatos cadastrados');
    }

    return contacts;
  }
}
