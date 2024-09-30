import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnedAdminDto } from './dto/returned-admin.dto';

/* Admin Service with methods for CRUD operations
    Attributes:
      adminModel: Model for Admin schema
    Methods:
      -create: Create a new admin account
      -findAll: Get all admins records
      -findOne: Get admin by id
      -update: Update admin by id
      -remove: Delete admin by id
*/
@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  /* Create a new admin account and return the created admin
      Parameters:
        - createAdminDto: admin details to create a new admin
      Returns:
        - created admin details in ReturnedAdminDto format
      Errors:
        - ConflictException: If admin with the email already exist
        - InternalServerErrorException: An error occurred while creating the admin
  */
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

  /* Get all admins records and return the list of admins
      Returns:
        - list of admins records in ReturnedAdminDto format
      Errors:
        - InternalServerErrorException: An error occurred while Getting the list of admins
  */
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

  /* Delete admin by id
      Parameters:
        - id: admin id to delete
      Returns:
        - message: success message after deleting the admin
      Errors:
        - NotFoundException: If admin with the id not found
        - InternalServerErrorException: An error occurred while delete admin record
  */
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
