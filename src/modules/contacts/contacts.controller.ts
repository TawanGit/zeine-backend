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
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'Contact successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @UseInterceptors(FileInterceptor('photo'))
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
  findAll(
    @Query('letter') letter?: string,
    @Query('userId', ParseIntPipe) userId?: number,
  ) {
    return this.contactsService.findAll(letter, userId);
  }
}
