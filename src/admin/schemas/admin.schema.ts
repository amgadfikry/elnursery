import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null})
  avatar: string;

  @Prop({ default: [] })
  roles: string[];

  @Prop({ default: null })
  forgetPasswordToken: string;

  @Prop({ default: null })
  forgetPasswordTokenExpiry: Date;

  @Prop({ default: false })
  changePassword: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
