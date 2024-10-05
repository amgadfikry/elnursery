import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';

@Module({ 
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [MongooseModule.forRoot(databaseConfig.uri), AdminModule, PasswordModule, AuthModule, UserModule ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, // Provide the AuthGuard as a global guard
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
