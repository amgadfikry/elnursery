import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';

// PartialType() method to create a new class with all properties of CreateAdminDto set to optional
export class UpdateAdminDto extends PartialType(CreateAdminDto) {
}
