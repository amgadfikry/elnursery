import { Injectable ,ConflictException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from 'src/password/password.service';
import { User, UserDocument } from './schemas/user.schema';

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
      const password = await this.passwordService.generateAndHashPassword();
      // assign the generated password to the user object
      createUserDto.password = password;
      // create a new user object
      const createdUser = new this.userModel(createUserDto);
      // save the user object
      return await createdUser.save();
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
