import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReturnedAdminDto } from './dto/returned-admin.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';

/* Admin Controller with CRUD operations
    Attributes:
      adminService: Service for admin operations
    Methods:
      -create (POST): Create a new admin account
      -findAll (GET): Get all admins records
      -findOne (GET): Get admin by id
      -update (PATCH): Update admin by id
      -remove (DELETE): Delete admin by id
*/
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto)) // Transform the response to the ReturnedAdminDto
  @ApiOperation({ summary: 'Create a new admin account' })
  @ApiResponse({ status: 200, description: 'Successful create a new admin record.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createAdminDto: CreateAdminDto): Promise<ReturnedAdminDto> {
    return await this.adminService.create(createAdminDto);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto)) // Transform the response to the ReturnedAdminDto
  @ApiOperation({ summary: 'Get all admins records' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of admins records.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll(): Promise<ReturnedAdminDto[]> {
    return await this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin using id' })
  @ApiResponse({ status: 200, description: 'Successful delete admin from records.'})
  @ApiErrorResponses([400, 401, 404, 500])
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.adminService.remove(id);
  }
}
