import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainsService } from './domains.service';
import { DomainRepository } from './domain.repository';
import { DomainsController } from './domains.controller';
import { DomainSchema, Domain } from './entities/domain.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Domain.name, schema: DomainSchema }]),
  ],
  controllers: [DomainsController],
  providers: [DomainsService, DomainRepository],
  exports: [DomainsService, DomainRepository],
})
export class DomainsModule {}
