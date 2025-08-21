import { IsOptional, IsString, Length, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindContactsDto {
  @ApiPropertyOptional({
    description: 'Filter contacts by first letter of name',
    example: 'A',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  letter: string;

  @ApiPropertyOptional({
    description: 'User ID to filter contacts',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  userId: number;
}
