import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceholdersService } from './placeholders.service';
import { PlaceholderRepository } from './placeholders.repository';
import { PlaceholdersController } from './placeholders.controller';
import { Placeholder, PlaceholderSchema } from './entities/placeholder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Placeholder.name, schema: PlaceholderSchema },
    ]),
  ],
  controllers: [PlaceholdersController],
  providers: [PlaceholdersService, PlaceholderRepository],
  exports: [PlaceholdersService, PlaceholderRepository],
})
export class PlaceholdersModule {}
