import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from './schemas/admin.schema';
import { ReturnedAdminDto } from './dto/returned-admin.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ErrorResponseDto } from '../common//dto/error-response.dto';
import { ApiErrorResponses } from '../common/decorators/api.error.response.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto))
  @ApiOperation({ summary: 'Create a new admin account' })
  @ApiResponse({ status: 200, description: 'Successful create a new admin record.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 409, 500])
  async create(@Body() createAdminDto: CreateAdminDto): Promise<ReturnedAdminDto> {
    return await this.adminService.create(createAdminDto);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto))
  @ApiOperation({ summary: 'Get all admins records' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of admins records.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 500])
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
