import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/schemas/admin.schema';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

// AuthService class that contains authentication logic
@Injectable()
export class AuthService {
  // Inject the Admin model, PasswordService, and JwtService into the AuthService
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /* login method that takes in a loginDto and type as arguments and returns a token
      Parameters:
        - loginDto: LoginDto
        - type: 'admin' | 'user'
      Returns:
        - token: string
      Errors:
        - UnauthorizedException: 'Invalid credentials'
        - 
  */
  async login(loginDto: LoginDto, type: 'admin' | 'user') {
    try {
      // destructure email and password from loginDto
      const { email, password } = loginDto;
      // determine the model based on the type (admin or user)
      const model: Model<AdminDocument | UserDocument> = type === 'admin' ? this.adminModel : this.userModel;
      // find user or admin by email in the database and check if it exists
      const user = await model.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // check if password is valid and compare password with hashed password in the database
      const IsValidPassword = await this.passwordService.comparePassword(password, user.password);
      if (!IsValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // create a payload with user id, email, and type and sign the payload with jwt
      const payload = { _id: user._id.toString(), email: user.email, type };
      const token = await this.jwtService.signAsync(payload);
      return token;
    } 
    catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while logging in');
    }
  }
}
