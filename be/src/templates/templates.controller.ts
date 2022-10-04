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
import { Template } from './entities/template.entity';
import { TemplateService } from './templates.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('templates')
@ApiBearerAuth()
@ApiTags('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplateService) {}
  @Post()
  @ApiOkResponse({ type: Template })
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  //get all templates
  @Get()
  @ApiOkResponse({ type: Template, isArray: true })
  async findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Template })
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  // update Template
  @Put()
  @ApiOkResponse({ type: Template, isArray: false })
  async update(
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    const template = this.templatesService.update(updateTemplateDto);

    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: Template, isArray: false })
  async remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }

  // update many Template
  @Post('/updateMany')
  @ApiOkResponse({ type: Template, isArray: false })
  async updateMany(
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<boolean> {
    const template = this.templatesService.updateMany(updateTemplateDto);

    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }
}
