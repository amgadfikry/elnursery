import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

// HydratedDocument type to define the type of the UserDocument
export type UserDocument = HydratedDocument<User>;

// Schema for the User collection
@Schema()
export class User {
  // Unique email address of user
  @Prop({ required: true, unique: true })
  email: string;

  // Password
  @Prop({ required: true })
  password: string;

  // Full name of user
  @Prop({ required: true })
  name: string;

  // Avatar URL of user
  @Prop({ default: null})
  avatar: string;

  // Class of user
  @Prop({ required: true })
  class: string;

  // Number of children
  @Prop({ default: 1 })
  children: number;

  // list of childern names and ids of children in children collection
  // Is List of child object form of name of child and id of child string or objectID
  @Prop({ default: [] })
  childrenList: { name: string, id: string | ObjectId }[];

  // Token for email forgot password
  @Prop({ default: null })
  forgetPasswordToken: string;

  // Expiry date for email forgot password token
  @Prop({ default: null })
  forgetPasswordTokenExpiry: Date;

  // Boolean to check if password change is required
  @Prop({ default: false })
  changePassword: boolean;
}

// UserSchema constant to define the schema for the User collection
export const UserSchema = SchemaFactory.createForClass(User);