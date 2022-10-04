import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ArticleDocument = Article & Document;
@Schema({ collection: 'article' })
export class Article {
  @ApiProperty()
  @Prop()
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  summary: string;

  @ApiProperty()
  @Prop()
  text: string;

  @ApiProperty()
  @Prop()
  publish_date: Date;

  @ApiProperty()
  @Prop()
  url: string;

  @ApiProperty()
  @Prop()
  author: Array<any[]>;

  @ApiProperty()
  @Prop()
  keywords: Array<any[]>;

  @ApiProperty()
  @Prop()
  categories: Array<any[]>;

  @ApiProperty()
  @Prop()
  publication: string;

  @ApiProperty()
  @Prop()
  pub_art_id: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
