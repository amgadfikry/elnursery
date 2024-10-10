import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AdminService } from './admin/admin.service';
import { CommonModule } from './common/common.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';

@Module({ 
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [
    MongooseModule.forRoot(databaseConfig.uri),
    CommonModule,
    CronJobsModule,
    AdminModule,
    PasswordModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },// Provide the AuthGuard as a global guard
    AdminService,
  ],
})
export class AppModule implements OnModuleInit {
  // Inject the AdminService into the AppModule
  constructor(private readonly adminService: AdminService) {}

  // Create a new admin account when the module is initialized
  async onModuleInit() {
    try {
      // create a new admin account
      await this.adminService.create({
        email: 'dr.amgad_sh92@yahoo.com',
        name: 'Amgad Fikry Mohamed',
        roles: ["owner"],
      });
      console.log('Admin account created successfully');
    } catch (error) {
      if (error.code === 11000) {
        console.error('Admin account already exists');
      } else {
      console.error('Error while creating admin account', error);
      }
    }
  }
}
