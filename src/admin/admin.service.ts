import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnedAdminDto } from './dto/returned-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async create(createAdminDto: CreateAdminDto): Promise<ReturnedAdminDto> {
    try {
      const newAdmin = new this.adminModel(createAdminDto);
      return await newAdmin.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("Admin with this email already exist");
      }
      throw new InternalServerErrorException('An Error occurred while creating the admin');
    }
  }

  async findAll(): Promise<ReturnedAdminDto[]> {
    try {
      const admins = await this.adminModel.find().exec();
      return admins;
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while Getting the list of admins');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.adminModel.deleteOne({ _id: id});
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Admin with this ID ${id} not found`)
      }
      return { message: 'Successfully deleted admin from records' };
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('An Error occurred while delete admin record');
    }
  }
}
