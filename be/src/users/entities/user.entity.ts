import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from 'src/roles/entities/role.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  firtSurname: string;

  @ApiProperty()
  @Prop({ required: true })
  secondSurname: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Role', autopopulate: true })
  roles: Role;

  @ApiProperty()
  @Prop({ type: 'string' })
  resetPasswordToken: string;

  @ApiProperty()
  @Prop({ type: 'number' })
  resetPasswordExpires: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
