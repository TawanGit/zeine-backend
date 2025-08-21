import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateContactDto } from './dto/update-contact-dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'Contact successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(AuthGuard)
  create(
    @Body() createContactDto: CreateContactDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.contactsService.create(createContactDto, photo);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all contacts, optionally filtered by first letter and user ID',
  })
  @ApiQuery({
    name: 'letter',
    required: false,
    description: 'Filter contacts by first letter',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter contacts by user ID',
  })
  @ApiResponse({ status: 200, description: 'Returns a list of contacts.' })
  @ApiResponse({
    status: 404,
    description: 'No contacts found or user does not exist.',
  })
  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('letter') letter?: string,
  ) {
    return this.contactsService.findAll(letter, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact by ID' })
  @ApiResponse({ status: 204, description: 'Contact successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  @UseGuards(AuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number, // get userId from query
  ) {
    await this.contactsService.delete(id, userId);
    return { message: 'Contact successfully deleted' };
  }

  @Put(':userId/:id')
  @ApiOperation({ summary: 'Update a contact by ID' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'Contact successfully updated.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  @UseGuards(AuthGuard)
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, userId, updateContactDto);
  }
}
