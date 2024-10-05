import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ReturnedUserDto } from './dto/returned-user.dto';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { User } from './schemas/user.schema';

/* User Controller with CRUD operations
    Attributes:
      userService: Service for user operations
    Methods:
      -create (POST): Create a new user account
      -findAll (GET): Get all user records
      -findOne (GET): Get user by id
      -update (PATCH): Update user by id
      -remove (DELETE): Delete user by id
*/
@ApiTags('User')
@Controller('user')
export class UserController {
  // Inject the UserService to the UserController
  constructor(private readonly userService: UserService) {}

  // POST /user - create a new user account
  @Post()
  @UseInterceptors(new TransformInterceptor(ReturnedUserDto)) // Transform the response to the ReturnedUserDto
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 200, description: 'Successful create a new user record.', type: ReturnedUserDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
