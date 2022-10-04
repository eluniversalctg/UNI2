import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemplatePersonalization,
  TemplatePersonalizationSchema,
} from './entities/template-personalization.entity';
import { TemplatePersonalizationService } from './template-personalization.service';
import { TemplatePersonalizationController } from './template-personalization.controller';
import { TemplatePersonalizationRepository } from './template-personalization.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TemplatePersonalization.name,
        schema: TemplatePersonalizationSchema,
      },
    ]),
  ],
  exports: [TemplatePersonalizationService, TemplatePersonalizationRepository],
  controllers: [TemplatePersonalizationController],
  providers: [
    TemplatePersonalizationService,
    TemplatePersonalizationRepository,
  ],
})
export class TemplatePersonalizationModule {}
