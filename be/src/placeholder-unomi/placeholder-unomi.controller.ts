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
import { PlaceholderUnomiService } from './placeholder-unomi.service';
import { PlaceholderUnomi } from './entities/placeholder-unomi.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlaceholderUnomiDto } from './dto/create-placeholder-unomi.dto';
import { UpdatePlaceholderUnomiDto } from './dto/update-placeholder-unomi.dto';

@Controller('placeholder-unomi')
@ApiBearerAuth()
@ApiTags('placeholder-unomi')
@UseGuards(JwtAuthGuard)
export class PlaceholderUnomiController {
  constructor(
    private readonly placeholderUnomiService: PlaceholderUnomiService,
  ) {}

  @Post()
  @ApiOkResponse({ type: PlaceholderUnomi })
  create(@Body() createPlaceholderDto: CreatePlaceholderUnomiDto) {
    return this.placeholderUnomiService.create(createPlaceholderDto);
  }

  //get all
  @Get()
  @ApiOkResponse({ type: PlaceholderUnomi, isArray: true })
  async findAll() {
    return this.placeholderUnomiService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PlaceholderUnomi })
  async findOne(@Param('id') id: string) {
    return this.placeholderUnomiService.findOne(id);
  }

  // update PlaceholderUnomi
  @Put()
  @ApiOkResponse({ type: PlaceholderUnomi, isArray: false })
  async update(
    @Body() updatePlaceholderDto: UpdatePlaceholderUnomiDto,
  ): Promise<PlaceholderUnomi> {
    const placeholder =
      this.placeholderUnomiService.update(updatePlaceholderDto);

    if (!placeholder) {
      throw new NotFoundException();
    }
    return placeholder;
  }

  // update PlaceholderUnomi
  @Post('/updateMany')
  @ApiOkResponse({ type: PlaceholderUnomi, isArray: true })
  async updateMany(
    @Body() updatePlaceholderDto: UpdatePlaceholderUnomiDto,
  ): Promise<boolean> {
    const placeholder =
      this.placeholderUnomiService.updateMany(updatePlaceholderDto);

    if (!placeholder) {
      throw new NotFoundException();
    }
    return placeholder;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: PlaceholderUnomi, isArray: false })
  async remove(@Param('id') id: string) {
    return this.placeholderUnomiService.remove(id);
  }
}
