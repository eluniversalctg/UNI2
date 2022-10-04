import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from './templates.service';
import { TemplateRepository } from './templates.repository';
import { TemplatesController } from './templates.controller';
import { Template, TemplateSchema } from './entities/template.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  exports: [TemplateService, TemplateRepository],
  controllers: [TemplatesController],
  providers: [TemplateService, TemplateRepository],
})
export class TemplatesModule { }
