import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly dtoClass: new () => T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    return next.handle().pipe(
      map(data => {
        // Check if data is an array
        if (Array.isArray(data)) {
          return data.map(item => 
            plainToInstance(this.dtoClass, item, {
              excludeExtraneousValues: true,
            })
          );
        } else {
          // If it's a single object
          return plainToInstance(this.dtoClass, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
