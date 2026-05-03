import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow frontend to connect
  await app.listen(process.env.PORT ?? 5005, '127.0.0.1');
}
void bootstrap();
