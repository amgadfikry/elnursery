import { Injectable ,ConflictException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from 'src/password/password.service';
import { User, UserDocument } from './schemas/user.schema';
import { EmailService } from 'src/common/email.service';

/* User Service with methods for CRUD operations
    Attributes:
      userModel: Model for User schema
    Methods:
      -create: Create a new user account
      -findAll: Get all user records
      -findOne: Get user by id
      -update: Update user by id
      -remove: Delete user by id
*/
@Injectable()
export class UserService {
  // Inject the User model into the service and the PasswordService
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  /* create method to create a new user account
    Parameters:
      -createUserDto: CreateUserDto object
    Returns:
      -Promise<User>: User object
    Throws:
      -ConflictException: If user already exists
      -InternalServerErrorException: If error occurs while saving user
  */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // generate a random password for the user account
      const password = this.passwordService.generateRandomPassword();
      const hashPassword = await this.passwordService.hashPassword(password);
      // create a new user object
      const userData = { ...createUserDto, password: hashPassword };
      const newUser = new this.userModel(userData);
      const createdUser = await newUser.save();
      // send account credentials email to the user
      await this.emailService.sendAccountCredentials(createdUser.name, createdUser.email, password);
      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException('Error while saving user');
      }
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
