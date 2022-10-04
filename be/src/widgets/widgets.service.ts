import { Injectable } from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { WidgetsRepository } from './widgets.repository';

@Injectable()
export class WidgetsService {
  constructor(private readonly widgetsRepository: WidgetsRepository) {}
  async create(createWidgetDto: CreateWidgetDto) {
    try {
      return await this.widgetsRepository.create(createWidgetDto);
    } catch (error) {
      return undefined;
    }
  }

  async findAll() {
    try {
      return await this.widgetsRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async update(updateWidgetDto: UpdateWidgetDto) {
    try {
      return await this.widgetsRepository.findOneAndUpdate(
        { _id: updateWidgetDto._id },
        updateWidgetDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string) {
    try {
      return await this.widgetsRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
