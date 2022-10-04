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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PropertiesUnomiService } from './properties-unomi.service';
import { PropertiesUnomi } from './entities/properties-unomi.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePropertiesUnomiDto } from './dto/create-properties-unomi.dto';
import { UpdatePropertiesUnomiDto } from './dto/update-properties-unomi.dto';

@Controller('properties-unomi')
@ApiBearerAuth()
@ApiTags('properties-unomi')
@UseGuards(JwtAuthGuard)
export class PropertiesUnomiController {
  constructor(
    private readonly propertiesUnomiService: PropertiesUnomiService,
  ) {}

  @Post()
  @ApiOkResponse({ type: PropertiesUnomi })
  create(@Body() createPropertiesUnomiDto: CreatePropertiesUnomiDto) {
    return this.propertiesUnomiService.create(createPropertiesUnomiDto);
  }

  //get all
  @Get()
  @ApiOkResponse({ type: PropertiesUnomi, isArray: true })
  async findAll() {
    return this.propertiesUnomiService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PropertiesUnomi })
  async findOne(@Param('id') id: string) {
    return this.propertiesUnomiService.findOne(id);
  }

  // update PropertiesUnomi
  @Put()
  @ApiOkResponse({ type: PropertiesUnomi, isArray: false })
  async update(
    @Body() updatePropertiesUnomiDto: UpdatePropertiesUnomiDto,
  ): Promise<PropertiesUnomi> {
    const placeholder = this.propertiesUnomiService.update(
      updatePropertiesUnomiDto,
    );

    if (!placeholder) {
      throw new NotFoundException();
    }
    return placeholder;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: PropertiesUnomi, isArray: false })
  async remove(@Param('id') id: string) {
    return this.propertiesUnomiService.remove(id);
  }
}
