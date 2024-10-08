import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { PasswordModule } from 'src/password/password.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  // Import the Admin model and schema into the AdminModule
  // Import PasswordModule into the AdminModule
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => PasswordModule),
    CommonModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [MongooseModule],
})
export class AdminModule {}
