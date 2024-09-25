// initialize createAdminDto
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsArray, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
	@ApiProperty({ example: 'email@example.com', description: 'Unique email address of admin'})
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		example: 'AbcdefG@22',
		description: 'Password must be at least 8 character, not more than 20 character,\
		and contain at least one uppercase, one lowercase, one number, and one special character'
	})
	@IsString({ message: 'Password must be a string' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
	@Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
	@Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
	@Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
	@Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: 'John Doe', description: 'Full name of admin'})
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: ['organizer', 'groupName'], description: 'Roles of admin as organizer or name of group controll them'})
	@IsArray({ message: 'Roles must be an array of strings' })
	@IsOptional()
	roles?: string[];
}
