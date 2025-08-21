import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Contact name',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'contact@email.com',
  })
  @IsEmail({}, { message: 'Digite um email válido' })
  email: string;

  @ApiProperty({
    description: 'User ID associated with the contact',
    example: 1,
  })
  @IsNotEmpty({ message: 'O userId não pode estar vazio' })
  userId: number;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'O telefone não pode estar vazio' })
  phone: string;
}
