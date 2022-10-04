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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TemplatePersonalizationService } from './template-personalization.service';
import { TemplatePersonalization } from './entities/template-personalization.entity';
import { CreateTemplatePersonalizationDto } from './dto/create-template-personalization.dto';
import { UpdateTemplatePersonalizationDto } from './dto/update-template-personalization.dto';

@Controller('template-personalization')
@ApiBearerAuth()
@ApiTags('template-personalization')
@UseGuards(JwtAuthGuard)
export class TemplatePersonalizationController {
  constructor(
    private readonly templatePersonalizationService: TemplatePersonalizationService,
  ) {}

  @Post()
  @ApiOkResponse({ type: TemplatePersonalization })
  create(
    @Body() createTemplatePersonalizationDto: CreateTemplatePersonalizationDto,
  ) {
    return this.templatePersonalizationService.create(
      createTemplatePersonalizationDto,
    );
  }

  //get all templates
  @Get()
  @ApiOkResponse({ type: TemplatePersonalization, isArray: true })
  async findAll() {
    return this.templatePersonalizationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TemplatePersonalization })
  async findOne(@Param('id') id: string) {
    return this.templatePersonalizationService.findOne(id);
  }

  // update TemplatePersonalization
  @Put()
  @ApiOkResponse({ type: TemplatePersonalization, isArray: false })
  async update(
    @Body() updateTemplatePersonalizationDto: UpdateTemplatePersonalizationDto,
  ): Promise<TemplatePersonalization> {
    const template = this.templatePersonalizationService.update(
      updateTemplatePersonalizationDto,
    );

    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }
  // update many TemplatePersonalization
  @Post('/updateMany')
  @ApiOkResponse({ type: TemplatePersonalization, isArray: false })
  async updateMany(
    @Body() updateTemplatePersonalizationDto: UpdateTemplatePersonalizationDto,
  ): Promise<boolean> {
    const template = this.templatePersonalizationService.updateMany(
      updateTemplatePersonalizationDto,
    );

    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: TemplatePersonalization, isArray: false })
  async remove(@Param('id') id: string) {
    return this.templatePersonalizationService.remove(id);
  }
}
