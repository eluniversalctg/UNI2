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
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('pages')
@ApiBearerAuth()
@ApiTags('pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @ApiOkResponse({ type: Page })
  async create(@Body() createPageDto: CreatePageDto) {
    return await this.pagesService.create(createPageDto);
  }

  //get all pages
  @Get()
  @ApiOkResponse({ type: Page, isArray: true })
  async findAll(): Promise<Page[]> {
    return await this.pagesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Page })
  async findOne(@Param('id') id: string) {
    return await this.pagesService.findOne(id);
  }

  // update Page
  @Put()
  @ApiOkResponse({ type: Page, isArray: false })
  async update(@Body() updatePageDto: UpdatePageDto): Promise<Page> {
    const placeholder = await this.pagesService.update(updatePageDto);

    if (!placeholder) {
      throw new NotFoundException();
    }
    return placeholder;
  }

  // delete page
  @Delete(':id')
  @ApiOkResponse({ type: Page, isArray: false })
  async remove(@Param('id') id: string) {
    return await this.pagesService.remove(id);
  }

  // update many pages
  @Post('/updateMany')
  @ApiOkResponse({ type: Page, isArray: false })
  async updateMany(@Body() updatePageDto: UpdatePageDto): Promise<boolean> {
    const page = await this.pagesService.updateMany(updatePageDto);

    if (!page) {
      throw new NotFoundException();
    }
    return page;
  }
}
