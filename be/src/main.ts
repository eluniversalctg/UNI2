import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // initialization of module.
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('uni2Api', { exclude: [] });

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );
  // create initial swagger documentation.
  const config = new DocumentBuilder()
    .setTitle('UNI2')
    .setDescription(
      'API creada con el fin de tener una plataforma que administre, integre y extienda funcionalidades de las plataformas de Apache Unomi, Crona.Ai y Matomo para la personalización de experiendias a los usuarios de los portales web de editoras.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('http://')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('uni2Api/api', app, document);

  // setup port for api

  await app.listen(3000);
}
bootstrap();
