import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { CloudinaryController } from './modules/cloudinary/cloudinary.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    DatabaseModule,
    ContactsModule,
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
})
export class AppModule {}
