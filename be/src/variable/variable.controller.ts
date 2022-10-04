import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { VariableService } from './variable.service';
import { Variable } from './entities/variable.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('variable')
@Controller('variable')
@UseGuards(JwtAuthGuard)
export class VariableController {
  constructor(private readonly variableService: VariableService) {}

  @Post()
  @ApiOkResponse({ type: Variable })
  create(@Body() createVariableDto: CreateVariableDto) {
    return this.variableService.create(createVariableDto);
  }

  //get all variables
  @Get()
  @ApiOkResponse({ type: Variable, isArray: true })
  async findAll() {
    return this.variableService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Variable })
  async findOne(@Param('id') id: string) {
    return this.variableService.findOne(id);
  }

  // update Variable
  @Put()
  @ApiOkResponse({ type: Variable, isArray: false })
  async update(
    @Body() updateVariableDto: UpdateVariableDto,
  ): Promise<Variable> {
    const variable = this.variableService.update(updateVariableDto);

    if (!variable) {
      throw new NotFoundException();
    }
    return variable;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: Variable, isArray: false })
  async remove(@Param('id') id: string) {
    return this.variableService.remove(id);
  }
}
