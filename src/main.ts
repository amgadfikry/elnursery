import * as dotenv from 'dotenv';

// This line loads the environment variables from the .env file into the process.env object.
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './common/filters/global-exception.filter';

// This is the entry point of the application. It uses the NestFactory class to create a new Nest application instance.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create swagger api documentaion
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Validate error message show in all api responses
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that are not in the DTO
  }));

  // Apply the global exception filter
  app.useGlobalFilters(new GlobalExceptionsFilter());
  
  await app.listen(3000);
}

bootstrap();
