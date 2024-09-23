import * as dotenv from 'dotenv';

// This line loads the environment variables from the .env file into the process.env object.
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// This is the entry point of the application. It uses the NestFactory class to create a new Nest application instance.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
