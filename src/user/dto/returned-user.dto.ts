import { IsEmail, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

// Data transfer object for returning an user
export class ReturnedUserDto {
  // Unique ID of the user
	@ApiProperty()
	@IsString()
  @Transform(({ value }) => value.toString())
	@Expose()
  id: string;

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

  // number of children
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  children?: number;

  // Class of user
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  class: string;

  // list of childern names and ids of children in children collection
  @ApiProperty()
  @IsArray()
  @IsOptional()
  @Expose()
  childrenList?: { name: string, id: string | ObjectId }[];

  // Avatar URL of admin
	@ApiProperty()
	@IsString()
	@IsOptional()
	@Expose()
	avatar?: string;
}
