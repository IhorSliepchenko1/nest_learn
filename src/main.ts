import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { setupSwagger } from './utils/swagger.utils';
// import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  // app.useGlobalGuards(new RolesGuard(new Reflector()));

  setupSwagger(app)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
