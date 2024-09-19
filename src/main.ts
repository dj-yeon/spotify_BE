import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  // CORS 설정
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키를 사용한 인증이 필요할 경우
  });

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
