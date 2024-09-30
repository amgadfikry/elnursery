import * as dotenv from 'dotenv';

// This line loads the environment variables from the .env file into the process.env object
// before the application starts so that they can be accessed throughout the application.
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './common/filters/global-exception.filter';

// This is the entry point of the application. It uses the NestFactory class to create a new Nest application instance.
async function bootstrap() {
  // Create the Nest application instance
  const app = await NestFactory.create(AppModule);

  // Create the Swagger document and set up the Swagger UI
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Apply the global validation pipe that validates payloads against the DTO classes
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that are not in the DTO
  }));

  // Apply the global exception filter that formats exceptions as JSON responses
  app.useGlobalFilters(new GlobalExceptionsFilter());
  
  // Start the application on port 3000
  await app.listen(3000);
}

bootstrap();
