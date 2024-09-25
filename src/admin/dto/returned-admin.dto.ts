import {IsString, IsOptional, IsArray, IsEmail} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnedAdminDto {
	@ApiProperty()
	@IsEmail()
	@Expose()
	email: string;

	@ApiProperty()
	@IsString()
	@Expose()
	name: string;

	@ApiProperty({ example: ['roles strings', 'or empty list']})
	@IsArray()
	@IsOptional()
	@Expose()
	roles?: string[];

	@ApiProperty({ example: 'url or null' })
	@IsString()
	@IsOptional()
	@Expose()
	avatar?: string;
}
