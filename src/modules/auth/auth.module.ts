import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY || '',
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PrismaService, UserService],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
