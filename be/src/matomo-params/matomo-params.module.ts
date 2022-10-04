import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatomoParamsService } from './matomo-params.service';
import { MatomoParamRepository } from './matomo-params.repository';
import { MatomoParamsController } from './matomo-params.controller';
import { MatomoParam, MatomoParamSchema } from './entities/matomo-param.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatomoParam.name, schema: MatomoParamSchema },
    ]),
  ],
  controllers: [MatomoParamsController],
  providers: [MatomoParamsService, MatomoParamRepository],
})
export class MatomoParamsModule {}
