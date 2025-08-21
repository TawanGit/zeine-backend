import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './modules/database/prisma.service';
import { createDefaultUser } from './modules/database/seeders/CreateDefaultUser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const prisma = app.get(PrismaService);
  // await createDefaultUser(prisma);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('ClickBeard Api')
    .setDescription('API documentation for ClickBeard app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
