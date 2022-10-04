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
import { Placeholder } from './entities/placeholder.entity';
import { PlaceholdersService } from './placeholders.service';
import { CreatePlaceholderDto } from './dto/create-placeholder.dto';
import { UpdatePlaceholderDto } from './dto/update-placeholder.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('placeholders')
@ApiBearerAuth()
@ApiTags('placeholders')
@UseGuards(JwtAuthGuard)
export class PlaceholdersController {
  constructor(private readonly placeholdersService: PlaceholdersService) {}

  @Post()
  @ApiOkResponse({ type: Placeholder })
  create(@Body() createPlaceholderDto: CreatePlaceholderDto) {
    return this.placeholdersService.create(createPlaceholderDto);
  }

  //get all templates
  @Get()
  @ApiOkResponse({ type: Placeholder, isArray: true })
  async findAll() {
    return this.placeholdersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Placeholder })
  async findOne(@Param('id') id: string) {
    return this.placeholdersService.findOne(id);
  }

  // update Placeholder
  @Put()
  @ApiOkResponse({ type: Placeholder, isArray: false })
  async update(
    @Body() updatePlaceholderDto: UpdatePlaceholderDto,
  ): Promise<Placeholder> {
    const placeholder = this.placeholdersService.update(updatePlaceholderDto);

    if (!placeholder) {
      throw new NotFoundException();
    }
    return placeholder;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: Placeholder, isArray: false })
  async remove(@Param('id') id: string) {
    return this.placeholdersService.remove(id);
  }
}
