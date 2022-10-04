import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PageRepository } from './pages.repository';
import { PagesController } from './pages.controller';
import { Page, PageSchema } from './entities/page.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Page.name,
        useFactory: () => {
          const schema = PageSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [PagesController],
  providers: [PagesService, PageRepository],
  exports: [PagesService, PageRepository],
})
export class PagesModule {}
