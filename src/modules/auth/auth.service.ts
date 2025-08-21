import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';
import { SignInDto } from '../user/dtos/SignInDto';

@Injectable()
export class AuthService {
  @Inject()
  private readonly prisma: PrismaService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly jwtService: JwtService;

  async signin(
    signInDto: SignInDto,
  ): Promise<{ access_token: string; userId: number }> {
    const user = await this.userService.findUser(signInDto.email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciais inválidas');

    const payload = { userId: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id,
    };
  }
}
