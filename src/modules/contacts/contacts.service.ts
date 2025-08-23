import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../database/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateContactDto } from './dto/update-contact-dto';

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
        'O id do usuário é necessário e deve ser um número válido',
      );
    }

    if (!createContactDto.email) {
      throw new BadRequestException('O email é obrigatório');
    }

    const existingContact = await this.prisma.contact.findFirst({
      where: {
        email: createContactDto.email,
        userId: userId,
      },
    });

    if (existingContact) {
      throw new BadRequestException(
        'Este email já está cadastrado para este usuário',
      );
    }

    if (!photo) {
      throw new BadRequestException('A foto do contato é obrigatória');
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

    return contacts;
  }

  async delete(id: number, userId: number) {
    if (!id || !userId) {
      throw new BadRequestException(
        'Id do contato e do usuário são necessários',
      );
    }

    const contact = await this.prisma.contact.findUnique({
      where: { id, userId },
    });

    if (!contact) {
      throw new NotFoundException(`Contato com ID ${id} não encontrado`);
    }

    return await this.prisma.contact.delete({
      where: { id },
    });
  }

  async update(
    id: number,
    userId: number,
    updateContactDto: UpdateContactDto,
    photo: Express.Multer.File,
  ) {
    if (!id || !userId) {
      throw new BadRequestException(
        'Id do contato e do usuário são necessários',
      );
    }

    const contact = await this.prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      throw new NotFoundException(`Contato com ID ${id} não encontrado`);
    }

    if (updateContactDto.email) {
      const emailExists = await this.prisma.contact.findFirst({
        where: {
          email: updateContactDto.email,
          NOT: { id },
        },
      });

      if (emailExists) {
        throw new BadRequestException('Esse email já está cadastrado');
      }
    }
    let newPhoto;
    if (photo) {
      const photoUrl = await this.cloudinaryService.uploadImage(photo);
      if (!photoUrl) {
        throw new BadRequestException('Falha ao fazer upload da foto');
      }
      newPhoto = photoUrl;
    }

    return await this.prisma.contact.update({
      where: { id },
      data: {
        ...updateContactDto,
        userId,
        ...(newPhoto ? { photo: newPhoto } : {}),
      },
    });
  }
}
