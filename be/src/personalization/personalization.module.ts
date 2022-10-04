import { Module } from '@nestjs/common';
import {
  Personalization,
  PersonalizationSchema,
} from './entities/personalization.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleModule } from 'src/rule/rule.module';
import { PagesModule } from 'src/pages/pages.module';
import { CromaModule } from 'src/croma/croma.module';
import { PagesService } from 'src/pages/pages.service';
import { PersonalizationService } from './personalization.service';
import { PersonalizationController } from './personalization.controller';
import { PersonalizationRepository } from './personalization.repository';
import { PlaceholdersModule } from 'src/placeholders/placeholders.module';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';
import { PlaceholderUnomiModule } from 'src/placeholder-unomi/placeholder-unomi.module';
import { PlaceholderUnomiService } from 'src/placeholder-unomi/placeholder-unomi.service';
import { TemplatePersonalizationModule } from 'src/template-personalization/template-personalization.module';
import { TemplatePersonalizationService } from 'src/template-personalization/template-personalization.service';



@Module({
  imports: [
    PlaceholderUnomiModule,
    PlaceholdersModule,
    TemplatePersonalizationModule,
    PagesModule,
    RuleModule,
    CromaModule,
    MongooseModule.forFeature([
      { name: Personalization.name, schema: PersonalizationSchema },
    ]),
  ],
  exports: [PersonalizationService],
  controllers: [PersonalizationController],
  providers: [
    PersonalizationService,
    PlaceholderUnomiService,
    PlaceholdersService,
    PersonalizationRepository,
    TemplatePersonalizationService,
    PagesService,
  ],
})
export class PersonalizationModule {}
