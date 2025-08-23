import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact-dto';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  const mockContactsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: mockContactsService,
        },
      ],
    })

      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create e retornar resultado', async () => {
      const dto: CreateContactDto = {
        name: 'John',
        email: 'john@test.com',
        phone: '123456',
        userId: 1,
      };
      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const result = { id: 1, ...dto };

      mockContactsService.create.mockResolvedValue(result);

      expect(await controller.create(dto, file)).toEqual(result);
      expect(mockContactsService.create).toHaveBeenCalledWith(dto, file);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll e retornar lista de contatos', async () => {
      const contacts = [{ id: 1, name: 'John' }];
      mockContactsService.findAll.mockResolvedValue(contacts);

      expect(await controller.findAll(1, 'J')).toEqual(contacts);
      expect(mockContactsService.findAll).toHaveBeenCalledWith('J', 1);
    });
  });

  describe('remove', () => {
    it('deve chamar service.delete e retornar mensagem', async () => {
      mockContactsService.delete.mockResolvedValue(undefined);

      expect(await controller.remove(1, 1)).toEqual({
        message: 'Contact successfully deleted',
      });
      expect(mockContactsService.delete).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('deve chamar service.update e retornar contato atualizado', async () => {
      const dto: UpdateContactDto = {
        name: 'Jane',
        email: 'jane@test.com',
        phone: '654321',
      };
      const file = {
        originalname: 'newphoto.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const result = { id: 1, ...dto };

      mockContactsService.update.mockResolvedValue(result);

      expect(await controller.update(1, 1, dto, file)).toEqual(result);
      expect(mockContactsService.update).toHaveBeenCalledWith(1, 1, dto, file);
    });
  });
});
