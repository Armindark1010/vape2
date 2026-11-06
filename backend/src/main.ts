import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

async function bootstrap() {
  console.log('1. bootstrap started');
  const app = await NestFactory.create(AppModule);
  console.log('2. NestFactory created');

  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vape Store API Documentation')
    .setDescription(
      'API specification for Vape Store (Products, Auth, Orders, Categories, Suppliers, Settlements)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('vapelab_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Vape Store Backend is running on http://localhost:${port}`);
  console.log(`📑 Swagger Documentation available on http://localhost:${port}/api/docs`);
}
bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
