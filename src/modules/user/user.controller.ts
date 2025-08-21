import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/UserResponseDto';
import { CreateUserDto } from './dtos/CreateUserDto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with name, email, and password. Password will be hashed before storing.',
  })
  @ApiBody({ type: CreateUserDto, description: 'User creation payload' })
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiBadRequestResponse({
    description: 'Invalid input or email already registered',
  })
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(userData);
  }
}
