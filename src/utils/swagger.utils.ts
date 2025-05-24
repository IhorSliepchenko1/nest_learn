import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

export function setupSwagger(app: INestApplication): void {
     const config = new DocumentBuilder()
          .setTitle('Nest JS')
          .setDescription('Обучающий курс по nestJS')
          .setVersion('1.0.0')
          .setContact('Ihor', 'https://cv-sliepchenko.pages.dev', 'slp.i008511586@gmail.com')
          .addBearerAuth()
          .build()

     const document = SwaggerModule.createDocument(app, config, {
          include: [AppModule],
     });

     SwaggerModule.setup('swagger', app, document);
}
