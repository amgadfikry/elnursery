import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';

@Module({
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [MongooseModule.forRoot(databaseConfig.uri), AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
