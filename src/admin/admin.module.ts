import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { PasswordModule } from 'src/password/password.module';

@Module({
  // Import the Admin model and schema into the AdminModule
  // Import PasswordModule into the AdminModule
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    PasswordModule, 
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
