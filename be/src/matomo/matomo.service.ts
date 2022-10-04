import * as https from 'https';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { Tags } from './entities/matomoTags.entity';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { MatomoRepository } from './matomo.repository';
import { HttpException, Injectable } from '@nestjs/common';
@Injectable()
export class MatomoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly tagsRepository: MatomoRepository,
  ) {}

  /**
   * create matomo tag
   */
  async createTag(createTagDto: CreateTagDto): Promise<Tags | undefined> {
    try {
      return await this.tagsRepository.create(createTagDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get matomo tags
   * @returns tags array
   */

  async getList(): Promise<Tags[]> {
    try {
      return await this.tagsRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * remove matomo tag
   */
  async delete(id): Promise<boolean> {
    try {
      return await this.tagsRepository.deleteMany({ _id: id });
    } catch (error) {
      return null;
    }
  }

  /**
   *  update matomo tag
   * @param params tags doby
   */

  async update(
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<Tags | undefined> {
    try {
      return await this.tagsRepository.findOneAndUpdate(
        { _id: id },
        updateTagDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get info from matomo
   */
  getMatomoInfo(params) {
    const response = this.httpService
      .get(
        `${this.config.get<string>(
          'MATOMO_URL',
        )}&module=API&${params}format=JSON`,
        {
          // para produccion quitar esto del httpsAgent debido a que debemos de tener un certificado de verdad
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
    return response;
  }
}
