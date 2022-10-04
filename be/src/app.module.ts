import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-rollbar';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { RuleModule } from './rule/rule.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesModule } from './pages/pages.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CromaModule } from './croma/croma.module';
import { ImagesModule } from './images/images.module';
import { MatomoModule } from './matomo/matomo.module';
import { DomainsModule } from './domains/domains.module';
import { WidgetsModule } from './widgets/widgets.module';
import { ActionsModule } from './actions/actions.module';
import { VariableModule } from './variable/variable.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplatesModule } from './templates/templates.module';
import { ConditionsModule } from './conditions/conditions.module';
import { UserFieldsModule } from './userfields/user-fields.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { PlaceholdersModule } from './placeholders/placeholders.module';
import { MatomoParamsModule } from './matomo-params/matomo-params.module';
import { UnomiProfilesModule } from './unomi-profiles/unomi-profiles.module';
import { PersonalizationModule } from './personalization/personalization.module';
import { PropertiesUnomiModule } from './properties-unomi/properties-unomi.module';
import { PlaceholderUnomiModule } from './placeholder-unomi/placeholder-unomi.module';
import { TemplatePersonalizationModule } from './template-personalization/template-personalization.module';
import { BlocksModule } from './blocks/blocks.module';
import { WeighingModule } from './weighing/weighing.module';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    LoggerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        accessToken: config.get('ROLLBAR_TOKEN'),
        environment: config.get('ENVIROMENT'),
      }),
      inject: [ConfigService],
    }),
    // mongoose config and autopupulate documents.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('UNI2DB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    RuleModule,
    AuthModule,
    RolesModule,
    UsersModule,
    CromaModule,
    MatomoModule,
    ImagesModule,
    ActionsModule,
    DomainsModule,
    WidgetsModule,
    VariableModule,
    TemplatesModule,
    ConditionsModule,
    UserFieldsModule,
    ActivityLogModule,
    PlaceholdersModule,
    MatomoParamsModule,
    UnomiProfilesModule,
    PropertiesUnomiModule,
    PersonalizationModule,
    PlaceholderUnomiModule,
    TemplatePersonalizationModule,
    PagesModule,
    BlocksModule,
    WeighingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
