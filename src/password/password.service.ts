import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { EmailService } from '../common/email.service';

// This service is responsible for hashing passwords, changing passwords, and resetting passwords.
@Injectable()
export class PasswordService {
  // Inject the Admin model and User model into the PasswordService
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}
  /* hashPassword is a method that takes a password and hashes it using bcrypt.
      Parameters:
      - password: string
      Returns:
        - hashed password: string
  */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  }

  /* comparePassword is a method that takes a password and a hashed password and compares them.
      Parameters:
      - password: string
      - hashedPassword: string
      Returns:
        - boolean
  */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error);
    }
  }

  /* generateRandomPassword is a method that generates a random password using the generate-password library.
      Returns:
        - random password: string
  */
  generateRandomPassword(): string {
    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });
    return password;
  }

  /* changePassword is a method that takes a user's old password, new password, and confirm password and changes the password.
      Parameters:
      - changePasswordDto: ChangePasswordDto
      - id: string
      - userType: string
      Returns:
        - "password changed successfully" message: string
      Errors:
        -InternalServerErrorException: if an error occurs
        - BadRequestException: if the old password is incorrect
  */
  async changePassword(changePasswordDto: ChangePasswordDto, id: string, userType: string): Promise<string> {
    try {
      // Extract oldPassword and newPassword from changePasswordDto
      const { oldPassword, newPassword } = changePasswordDto;
      // Check if the userType is admin or user and get the model accordingly
      const model: Model<AdminDocument | UserDocument> = userType === 'admin' ? this.adminModel : this.userModel;
      // Find the user by id and check if the user exists
      const user = await model.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // Compare the old password with the hashed password
      const isPasswordValid = await this.comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }
      // Hash the new password and update the user's password
      const hashedPassword = await this.hashPassword(newPassword);
      await model.findByIdAndUpdate(id, { password: hashedPassword, changePassword: true });
      return 'Password changed successfully';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Couldn't change password");
    }
  }

  /* resetPassword is a method that takes a user's email and generate code and send it to email.
      - email: string
      - userType: string
      Returns:
        - success message: string
      Errors:
        - NotFoundException: if the user is not found
        - InternalServerErrorException: if an error occurs
  */
  async resetPassword(email: string, userType: string): Promise<{ message: string }> {
    try {
      // Check if the userType is admin or user and get the model accordingly
      const model: Model<AdminDocument | UserDocument> = userType === 'admin' ? this.adminModel : this.userModel;
      const user = await model.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Generate a random code form of 6 numbers
      const code = Math.floor(100000 + Math.random() * 900000);
      // add code to token in database and expire date after 1 hour
      await model.findOneAndUpdate({ email }, { forgetPasswordToken: code, forgetPasswordTokenExpiry: new Date(Date.now() + 3600000) });
      // send password reset email
      await this.emailService.sendPasswordResetEmail(user.name, email, code);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Couldn't reset password");
    }
  }
}
