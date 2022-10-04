import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Widget, WidgetDocument } from './entities/widget.entity';

@Injectable()
export class WidgetsRepository extends EntityRepository<WidgetDocument> {
  constructor(@InjectModel(Widget.name) widgetModel: Model<WidgetDocument>) {
    super(widgetModel);
  }
}
