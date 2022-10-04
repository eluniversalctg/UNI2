import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserFiledsDocument = UserFields & Document;
@Schema()
export class UserFields {
  _id?: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  group: string;

  @ApiProperty()
  @Prop()
  type: string;

  @ApiProperty()
  @Prop()
  isRequired: boolean;

  @ApiProperty()
  @Prop()
  canModify: boolean;

  @ApiProperty()
  @Prop()
  massiveEdition: boolean;

  @ApiProperty()
  @Prop({ default: true, unique: false })
  isActive: boolean;
}

export const UserFieldsSchema = SchemaFactory.createForClass(UserFields);
