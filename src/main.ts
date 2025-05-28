import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { setupSwagger } from './utils/swagger.utils';
import * as fs from 'fs';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadPath = path.join(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Создана папка для загрузок: ${uploadPath}`);
  }

  app.useStaticAssets(uploadPath);
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())

  setupSwagger(app)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
