import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ActivityLogDocument = ActivityLog & Document;

interface LogModel extends Document {
  label: string;
  previousValue: string;
  newValue: string;
}
@Schema()
export class ActivityLog {
  _id: string;
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', autopopulate: true })
  user: User;
  @ApiProperty() @Prop() date: Date;
  @ApiProperty() @Prop() screen: string;
  @ApiProperty() @Prop() objectModified: string;
  @ApiProperty() @Prop() log: [LogModel];
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
