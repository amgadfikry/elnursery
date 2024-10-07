import { Controller, Post, Res, Req, Body, Param, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public-guard.decorator';

// This controller is responsible for handling password-related requests
// as change password and reset password.
@ApiTags('Password')
@Controller('password')
export class PasswordController {
  // Inject the PasswordService into the PasswordController
  constructor(private readonly passwordService: PasswordService) {}

  // POST /password/change - change password
  @Post('change')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Successful change password.' })
  @ApiErrorResponses([400, 401, 404, 500])
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Res() res: Response, @Req() req: any) {
    const { _id, type } = req.user;
    await this.passwordService.changePassword(changePasswordDto, _id, type);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.status(200).send({ message: 'Password changed successfully' });
  }

  // POST /password/reset - reset password
  @Post('reset/:type')
  @Public()
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Successful reset password.' })
  @ApiErrorResponses([400, 401, 404, 500])
  async resetPassword(@Param('type') type: string, @Query('email') email: string): Promise<{ message: string }> {
    return await this.passwordService.resetPassword(email, type);
  }
}
