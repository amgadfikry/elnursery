import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';

// This service is responsible for hashing passwords, changing passwords, and resetting passwords.
@Injectable()
export class PasswordService {
  // Inject the Admin model and User model into the PasswordService
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
      const { oldPassword, newPassword } = changePasswordDto;
      let user: AdminDocument | UserDocument;
      if (userType === 'admin') {
        user = await this.adminModel.findById(id);
      } else {
        user = await this.userModel.findById(id);
      }

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await this.comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      const hashedPassword = await this.hashPassword(newPassword);
      if (userType === 'admin') {
        await this.adminModel.findByIdAndUpdate(id, { password: hashedPassword });
      } else {
        await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });
      }
      return 'Password changed successfully';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Couldn't change password");
    }
  }
}
