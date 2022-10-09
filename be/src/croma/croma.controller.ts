import { ApiTags } from '@nestjs/swagger';
import { CromaService } from './croma.service';
import { CreateCromaDto } from './dto/create-croma.dto';
import { RelatedCromaDto } from './dto/related-croma.dto';
import { Get, Post, Body, Param, Controller } from '@nestjs/common';

@Controller('croma')
@ApiTags('croma')
export class CromaController {
  constructor(private readonly cromaService: CromaService) {}

  /**
   * find all articles
   */
  @Get()
  findAll() {
    return this.cromaService.findAll();
  }

  /**
   * analyze text
   * example: "Cristina Kirchner se reunio con Mauricio Macri en la casa rosada"
   */
  @Get('/text/:text/:tags/:period/:date/:site')
  analyzer_text(
    @Param('text') text: string,
    @Param('tags') tags: string,
    @Param('period') period: string,
    @Param('date') date: string,
    @Param('site') site: string,
  ) {
    return this.cromaService.analyzer_text(text, tags, period, date, site);
  }

  /**
   * analyze URL
   * example: "https://www.eluniversal.com.co/"
   */
  @Get('/url/:url/:tags/:period/:date/:site')
  analyzer_url(
    @Param('url') url: string,
    @Param('tags') tags: string,
    @Param('period') period: string,
    @Param('date') date: string,
    @Param('site') site: string,
  ) {
    return this.cromaService.analyzer_url(url, tags, period, date, site);
  }

  /**
   * analyze word
   * example: "kirchnerismo"
   */
  @Get('/word/:word')
  similar_words(@Param('word') word: string) {
    return this.cromaService.similar_words(word);
  }

  /**
   * create publication
   */
  @Post()
  create(@Body() createCromaDto: CreateCromaDto) {
    return this.cromaService.create(createCromaDto);
  }
}
