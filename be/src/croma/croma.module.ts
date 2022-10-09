import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CromaService } from './croma.service';
import { ConfigService } from '@nestjs/config';
import { CromaController } from './croma.controller';
import { MatomoModule } from 'src/matomo/matomo.module';
import { DomainsModule } from 'src/domains/domains.module';
import { DomainsService } from 'src/domains/domains.service';
import { PlaceholdersModule } from 'src/placeholders/placeholders.module';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';

@Module({
  imports: [
    HttpModule,
    MatomoModule,
    DomainsModule,
    PlaceholdersModule,
  ],
  controllers: [CromaController],
  providers: [CromaService, ConfigService, DomainsService, PlaceholdersService],
  exports: [CromaService],
})
export class CromaModule {}
