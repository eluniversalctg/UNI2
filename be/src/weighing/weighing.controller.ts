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
import { WeighingService } from './weighing.service';
import { Weighing } from './entities/weighing.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWeighingDto } from './dto/create-weighing.dto';
import { UpdateWeighingDto } from './dto/update-weighing.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('weighing')
@ApiBearerAuth()
@ApiTags('weighing')
@UseGuards(JwtAuthGuard)
export class WeighingController {
  constructor(private readonly weighingService: WeighingService) {}

  @Post()
  @ApiOkResponse({ type: Weighing })
  create(@Body() createWeighingDto: CreateWeighingDto) {
    return this.weighingService.create(createWeighingDto);
  }

  //get all templates
  @Get()
  @ApiOkResponse({ type: Weighing, isArray: true })
  async findAll() {
    return this.weighingService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Weighing })
  async findOne(@Param('id') id: string) {
    return this.weighingService.findOne(id);
  }

  // update Weighing
  @Put()
  @ApiOkResponse({ type: Weighing, isArray: false })
  async update(
    @Body() updateWeighingDto: UpdateWeighingDto,
  ): Promise<Weighing> {
    const weighing = this.weighingService.update(updateWeighingDto);

    if (!weighing) {
      throw new NotFoundException();
    }
    return weighing;
  }

  // update dlete
  @Delete(':id')
  @ApiOkResponse({ type: Weighing, isArray: false })
  async remove(@Param('id') id: string) {
    return this.weighingService.remove(id);
  }
}
