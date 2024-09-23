import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: [] })
  roles: string[];

  @Prop({ required: true, default: null })
  forgetPasswordToken: string;

  @Prop({ required: true, default: null })
  forgetPasswordTokenExpiry: Date;

  @Prop({ required: true, default: false })
  changePassword: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
