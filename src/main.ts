import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // CORS 설정
  app.enableCors();
  
  // 정적 파일 제공
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/hls', express.static(join(__dirname, '..', 'hls')));
  app.use('/api/videos', express.static(join(__dirname, '..', 'hls')));

  
  // 서버 시작
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();