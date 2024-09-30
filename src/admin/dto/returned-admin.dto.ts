import {IsString, IsOptional, IsArray, IsEmail} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for returning an admin
export class ReturnedAdminDto {
  // Unique ID of the admin
	@ApiProperty()
	@Expose()
	_id: any;

  // Unique email address of admin
	@ApiProperty()
	@IsEmail()
	@Expose()
	email: string;

  // Full name of admin
	@ApiProperty()
	@IsString()
	@Expose()
	name: string;

  // Roles of admin
	@ApiProperty()
	@IsArray()
	@IsOptional()
	@Expose()
	roles?: string[];

  // Avatar URL of admin
	@ApiProperty()
	@IsString()
	@IsOptional()
	@Expose()
	avatar?: string;
}
