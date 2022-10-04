import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TagsDocument = Tags & Document;
@Schema()
export class Tags {
  _id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  module: string;

  @ApiProperty()
  @Prop()
  tag: string;

  @ApiProperty()
  @Prop()
  columns: Columns[];

  @ApiProperty()
  @Prop()
  customParameters: Columns[];
}

export class Columns {
  @ApiProperty()
  @Prop()
  header: string;
  @ApiProperty()
  @Prop()
  field: string;
}
export class CustomParams {
  @ApiProperty()
  @Prop()
  parameter: string;
  @ApiProperty()
  @Prop()
  value: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);
