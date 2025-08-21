import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @ApiProperty({
    description: 'Valid email address of the user to find',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Digite um email válido' })
  email: string;
}
