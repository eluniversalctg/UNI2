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
import { RenderizationDto } from './dto/renderization.dto';
import { PersonalizationService } from './personalization.service';
import { Personalization } from './entities/personalization.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonalizationDto } from './dto/create-personalization.dto';
import { UpdatePersonalizationDto } from './dto/update-personalization.dto';

@Controller('personalization')
// @ApiBearerAuth()
@ApiTags('personalization')
// @UseGuards(JwtAuthGuard)
export class PersonalizationController {
  constructor(private readonly templatesService: PersonalizationService) {}
  @Post()
  @ApiOkResponse({ type: Personalization })
  create(@Body() createPersonalizationDto: CreatePersonalizationDto) {
    return this.templatesService.create(createPersonalizationDto);
  }

  @Post('/renderization')
  render(@Body() renderizationDto: RenderizationDto) {
    return this.templatesService.renderization(renderizationDto);
  }

  //get all personalization
  @Get()
  @ApiOkResponse({ type: Personalization, isArray: true })
  async findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Personalization })
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  // update Personalization
  @Put()
  @ApiOkResponse({ type: Personalization, isArray: false })
  async update(
    @Body() updatePersonalizationDto: UpdatePersonalizationDto,
  ): Promise<Personalization> {
    const template = this.templatesService.update(updatePersonalizationDto);

    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: Personalization, isArray: false })
  async remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
