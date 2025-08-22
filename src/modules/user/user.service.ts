import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'generated/prisma';

import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/UserResponseDto';
import { CreateUserDto } from './dtos/CreateUserDto';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async findUser(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Email é necessário');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    if (!data.email || !data.password) {
      throw new BadRequestException('email e senha são necessários');
    }

    const userExists = await this.findUser(data.email);
    if (userExists) {
      throw new BadRequestException('Esse email já está cadastrado');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashPassword,
      },
    });

    return plainToInstance(UserResponseDto, user);
  }

  async update(data: UpdateUserDto, id: number): Promise<UpdateUserDto> {
    if (!data.email || !data.password) {
      throw new BadRequestException('email e senha são necessários');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        password: hashPassword,
      },
    });

    return plainToInstance(UpdateUserDto, user);
  }
}
