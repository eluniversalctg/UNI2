import { HttpService } from '@nestjs/axios';
import { Utilities } from 'src/utils/utilities';
import { map, catchError, lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileAnaliticRepository } from './profile-analitic.repository';
import { CreateProfileAnaliticDto } from './dto/create-profile-analitic.dto';

@Injectable()
export class ProfileAnaliticService {
  credentialUnomi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly utilities: Utilities,
    private readonly profileAnaliticRepository: ProfileAnaliticRepository,
  ) {
    this.credentialUnomi = this.utilities.getCredenctialsUnomi();
  }
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async create() {
    try {
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };

      //create request object
      const filter = {
        offset: 0,
        limit: 0,
        condition: {
          type: 'booleanCondition',
          parameterValues: {
            operator: 'and',
            subConditions: [
              {
                type: 'profilePropertyCondition',
                parameterValues: {
                  comparisonOperator: 'exists',
                  propertyName: 'properties.enabled',
                },
              },
              {
                type: 'profilePropertyCondition',
                parameterValues: {
                  comparisonOperator: 'equals',
                  propertyName: 'properties.enabled',
                  propertyValue: 'true',
                },
              },
              {
                type: 'profilePropertyCondition',
                parameterValues: {
                  comparisonOperator: 'exists',
                  propertyName: 'properties.email',
                  propertyValue: 'true',
                },
              },
            ],
          },
        },
      };
      const count = await lastValueFrom(
        this.httpService
          .post(
            `${this.config.get<string>('UNOMI_URL')}/cxs/profiles/search`,
            filter,
            configuration,
          )
          .pipe(
            map((response) => {
              return response.data['totalSize'];
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );
      const save: CreateProfileAnaliticDto = {
        quantity: count,
        date: new Date(),
      };
      await this.profileAnaliticRepository.create(save);
    } catch (error) {
      return error;
    }
  }

  async findAll(data) {
    const period = data.period;
    const date = data.date;
    let filter;

    switch (period) {
      case 'month':
        const y = new Date(date).getFullYear();
        const m = new Date(date).getMonth();

        const startDate = new Date(y, m, 1);
        const endDate = new Date(y, m + 1, 0);

        filter = {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        };

        break;

      case 'week':
        const first = new Date(date).getDate() - new Date(date).getDay();
        const last = first + 6;

        const firstday = new Date(date.setDate(first)).toUTCString();
        const lastday = new Date(date.setDate(last)).toUTCString();

        filter = { date: { $gte: firstday, $lte: lastday } };

        break;

      case 'year':
        const year = new Date(date).getFullYear();
        const startDateY = new Date(`01/01/${year}`);
        const endDateY = new Date(`12/31/${year}`);

        filter = { date: { $gte: startDateY, $lte: endDateY } };

        break;

      case 'day':
        filter = { date: { $eq: new Date() } };

        break;

      case 'range':
        filter = { date: { $gte: new Date(date[0]), $lte: new Date(date[1]) } };

        break;
    }

    return await this.profileAnaliticRepository.find(filter);
  }
}
