import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';

@Module({
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [MongooseModule.forRoot(databaseConfig.uri), AdminModule, PasswordModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
