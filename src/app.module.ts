import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { PasswordModule } from './password/password.module';

@Module({
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [MongooseModule.forRoot(databaseConfig.uri), AdminModule, PasswordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
