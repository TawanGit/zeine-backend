import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { AuthGuard } from '../auth/auth.guard';

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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update an existing user',
    description:
      'Updates an existing user with new name, email, or password. Password will be hashed before storing.',
  })
  @ApiBody({ type: UpdateUserDto, description: 'User update payload' })
  @ApiCreatedResponse({ description: 'User successfully updated' })
  @ApiBadRequestResponse({
    description: 'Invalid input or email already registered',
  })
  async update(
    @Body() userData: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateUserDto> {
    return this.userService.update(userData, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes an existing user by ID.',
  })
  @ApiCreatedResponse({ description: 'User successfully deleted' })
  @ApiBadRequestResponse({
    description: 'Invalid user ID or user not found',
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
