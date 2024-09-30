import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()  // This will catch all exceptions in the app
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();  // Switch context to HTTP, could be WebSocket or RPC
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Check if it's an instance of HttpException (known HTTP error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;  // Default to 500 Internal Server Error

    // Build the error response
    const errorResponse = {
      statusCode: status,
      error: exception instanceof HttpException
          ? exception.getResponse()['error'] // HttpException has built-in error
          : 'Server down',  // Fallback error
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception instanceof HttpException
          ? Array.isArray(exception.getResponse()['message']) ?
            exception.getResponse()['message'].join(', ') : exception.getResponse()['message']  // HttpException has built-in messages
          : 'Internal server error',  // Fallback message
    };

    // Log the exception (you can customize the logging here)
    console.error({
      exception,  // actual exception object for debugging
      message: errorResponse.message,  // Log the error message
    });

    // Send the response with appropriate status and error message
    response.status(status).json(errorResponse);
  }
}
