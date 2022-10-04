import {
  Get,
  Put,
  Res,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateImageDto } from './dto/update-image.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('images')
@ApiBearerAuth()
@ApiTags('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploadedImages',
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.imagesService.create(files);
  }

  @Get(':id')
  @ApiOkResponse({ type: Image })
  findOne(@Param('id') id: string, @Res() res) {
    const file = join(`./uploadedImages`, id);
    return res.sendFile(file);
  }

  @Put()
  @ApiOkResponse({ type: Image, isArray: false })
  async update(@Body() updateImageDto: UpdateImageDto): Promise<Image> {
    const images = this.imagesService.update(updateImageDto);

    if (!images) {
      throw new NotFoundException();
    }
    return images;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
