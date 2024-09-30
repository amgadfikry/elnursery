// common/decorators/api-response-error.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

// Default status code messages
const defaultMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

// Function to apply ApiResponse decorators dynamically
export function ApiErrorResponses(codes: number[]) {
  return applyDecorators(
    ...codes.map(code =>
      ApiResponse({
        status: code,
        description: defaultMessages[code],
        type: code === 500 ? ErrorResponseDto : null
      })
    )
  );
}
