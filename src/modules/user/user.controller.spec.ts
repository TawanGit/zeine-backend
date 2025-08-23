import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('deve chamar service.createUser e retornar o usuário', async () => {
      const dto: CreateUserDto = {
        email: 'john@test.com',
        password: '123456',
      };
      const result = { id: 1, name: 'John', email: 'john@test.com' };

      mockUserService.createUser.mockResolvedValue(result);

      expect(await controller.createUser(dto)).toEqual(result);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('deve chamar service.update e retornar usuário atualizado', async () => {
      const dto: UpdateUserDto = {
        email: 'jane@test.com',
      };
      const result = { id: 1, ...dto };

      mockUserService.update.mockResolvedValue(result);

      expect(await controller.update(dto, 1)).toEqual(result);
      expect(mockUserService.update).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('deleteUser', () => {
    it('deve chamar service.delete', async () => {
      mockUserService.delete.mockResolvedValue(undefined);

      await controller.deleteUser(1);
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
    });
  });
});
