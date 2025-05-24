import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from './core/@shared/infra/db-conn';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectDB();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
