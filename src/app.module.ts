import { Module } from '@nestjs/common';
import { ContactsModule } from './modules/contacts/contacts.module';

@Module({
  imports: [ContactsModule]
})
export class AppModule {}
