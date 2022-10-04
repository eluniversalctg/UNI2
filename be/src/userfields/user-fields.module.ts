import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFieldsService } from './user-fields.service';
import { UserFieldRepository } from './user-fields.repository';
import { UserFieldsController } from './user-fields.controller';
import { UserFields, UserFieldsSchema } from './entities/user-fields.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: UserFields.name,
        useFactory: () => {
          const schema = UserFieldsSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserFieldsController],
  providers: [UserFieldsService, UserFieldRepository],
})
export class UserFieldsModule {}
