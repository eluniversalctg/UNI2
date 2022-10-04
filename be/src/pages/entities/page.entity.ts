import { Document, SchemaTypes } from 'mongoose';
import { WizardModel } from '../dto/wizard.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Domain } from 'src/domains/entities/domain.entity';

export type PageDocument = Page & Document;

@Schema()
export class Page {
  _id: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  typeSection: string;

  @Prop({ required: false, unique: false })
  children: Page[];

  @Prop({ required: true, unique: false })
  route: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Domain',
    required: true,
    unique: false,
    autopopulate: true,
  })
  site: Domain;

  @Prop({ required: true, unique: false })
  isActive: boolean;

  @Prop({ required: false, unique: false })
  wizardModel: WizardModel[];
  
  @Prop({ required: false, unique: false })
  level: number;
}

export const PageSchema = SchemaFactory.createForClass(Page);
