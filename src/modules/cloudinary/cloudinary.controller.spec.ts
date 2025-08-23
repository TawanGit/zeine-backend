import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryController', () => {
  let controller: CloudinaryController;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinaryController],
      providers: [
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CloudinaryController>(CloudinaryController);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o serviço e retornar a URL da imagem', async () => {
    const mockFile = {
      originalname: 'test.png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const mockUrl = 'https://cloudinary.com/test.png';
    (cloudinaryService.uploadImage as jest.Mock).mockResolvedValue(mockUrl);

    const result = await controller.uploadImage(mockFile);

    expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
    expect(result).toEqual({ url: mockUrl });
  });
});
