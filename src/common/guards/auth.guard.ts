import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public-guard.decorator';

// JwtAuthGuard class that protects routes with JWT authentication
@Injectable()
export class AuthGuard implements CanActivate {
  // Inject JwtService and Reflector
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /* canActivate method that checks if the request contains a valid JWT token
      and attaches the user info to the request object 
      Parameters:
        - context: ExecutionContext object that contains the request object
      Returns:
        - boolean: true if the token is valid, false otherwise
      Errors:
        - UnauthorizedException: if the token is missing or invalid
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the isPublic metadata from the route handler or class
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If the route is public, bypass the guard
    if (isPublic) {
      return true; // Bypass guard if the route is public
    }

    const request: Request = context.switchToHttp().getRequest();
    // Get the token from the request cookies
    const token = request.cookies['token'];
    // If no token is found, throw an error
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      // Attach the user info to the request object
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}