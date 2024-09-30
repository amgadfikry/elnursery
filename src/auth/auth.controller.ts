import { Body, Controller, Post, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

/* AuthController class that contains routes for authentication
    Routes:
      - POST /auth/login/:type - login and set token in cookie
*/
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Inject the AuthService to the AuthController
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login/:type - login and set token in cookie
  @Post('login/:type')
  @ApiOperation({ summary: 'Login and set token in cookie' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiErrorResponses([400, 401, 404, 500])
  async login(@Body() loginDto: LoginDto, @Param('type') type: 'admin' | 'user', @Res() res: Response) {
    const token = await this.authService.login(loginDto, type);
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // set secure to true in production
        sameSite: 'none', // set sameSite to none for cross-site requests
    });
    return res.status(200).send({ message: 'Login successful' });
  }
}
