import {IsString, IsOptional, IsArray, IsEmail} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class ReturnedAdminDto {
	@ApiProperty()
	@Expose()
	_id: any;

	@ApiProperty()
	@IsEmail()
	@Expose()
	email: string;

	@ApiProperty()
	@IsString()
	@Expose()
	name: string;

	@ApiProperty()
	@IsArray()
	@IsOptional()
	@Expose()
	roles?: string[];

	@ApiProperty()
	@IsString()
	@IsOptional()
	@Expose()
	avatar?: string;
}
