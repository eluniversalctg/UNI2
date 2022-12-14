import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('pages')
@UseGuards(JwtAuthGuard)
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blocksService.create(createBlockDto);
  }

  @Get()
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Put()
  update(@Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(updateBlockDto);
  }

  @Post('/updateMany')
  updateManyPages(@Body() updatePage) {
    return this.blocksService.updateManyPages(updatePage);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id);
  }
}
