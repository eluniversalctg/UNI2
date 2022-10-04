import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CromaService } from './croma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CromaController } from './croma.controller';
import { MatomoModule } from 'src/matomo/matomo.module';
import { DomainsModule } from 'src/domains/domains.module';
import { DomainsService } from 'src/domains/domains.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Article, ArticleSchema } from './entities/croma.entity';
import { PlaceholdersModule } from 'src/placeholders/placeholders.module';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';

@Module({
  imports: [
    PlaceholdersModule,
    DomainsModule,
    MatomoModule,
    HttpModule,
    // we add mongo configuration to use other DB.
    MongooseModule.forRootAsync({
      connectionName: 'CromaAIdb',
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('CROMADB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [{ name: Article.name, schema: ArticleSchema }],
      'CromaAIdb',
    ),
  ],
  controllers: [CromaController],
  providers: [CromaService, ConfigService, DomainsService, PlaceholdersService],
  exports: [CromaService],
})
export class CromaModule {}
