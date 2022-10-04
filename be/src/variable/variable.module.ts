import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VariableService } from './variable.service';
import { VariableRepository } from './variable.repository';
import { VariableController } from './variable.controller';
import { Variable, VariableSchema } from './entities/variable.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]),
  ],
  exports: [VariableService],
  controllers: [VariableController],
  providers: [VariableService, VariableRepository],
})
export class VariableModule {}
