import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Utilities } from 'src/utils/utilities';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUnomiProfileDto } from './dto/create-unomi-profile.dto';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Injectable()
export class UnomiProfilesService {
  credentialUnomi: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly utilities: Utilities,
    private readonly activityLogSrv: ActivityLogService,
  ) {
    this.credentialUnomi = this.utilities.getCredenctialsUnomi();
  }

  async findAll(conditionReq) {
    try {
      const data = {
        offset: conditionReq[1][0],
        condition: conditionReq[0] ? conditionReq[0] : {},
        limit: conditionReq[1][1],
      };
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };
      const response = await lastValueFrom(
        this.httpService
          .post(
            `${this.config.get<string>('UNOMI_URL')}/cxs/profiles/search`,
            data,
            configuration,
          )
          .pipe(
            map((response) => {
              return [response.data];
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );
      return response;
    } catch (error) {
      return undefined;
    }
  }

  async create(createUnomiProfileDto: CreateUnomiProfileDto) {
    try {
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };

      const log = { ...createUnomiProfileDto[0].log };
      delete createUnomiProfileDto[0].log;

      const response = await lastValueFrom(
        this.httpService
          .post(
            `${this.config.get<string>('UNOMI_URL')}/cxs/profiles/`,
            createUnomiProfileDto[0],
            configuration,
          )
          .pipe(
            map((res) => {
              return res.data;
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );

      if (response) {
        createUnomiProfileDto[0].log = { ...log };
        this.activityLogSrv.registerLog(
          createUnomiProfileDto[0],
          createUnomiProfileDto[1],
        );
      }
      return response;
    } catch (error) {
      return undefined;
    }
  }
  async findSessions(id: string) {
    try {
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };

      const response = await lastValueFrom(
        this.httpService
          .get(
            `${this.config.get<string>(
              'UNOMI_URL',
            )}/cxs/profiles/${id}/sessions/?size=-1&sort=profile.properties.firstVisit`,
            configuration,
          )
          .pipe(
            map((res) => {
              return { status: res.status, message: res.data };
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );
      return response;
    } catch (error) {
      return undefined;
    }
  }

  async batchProfiles(batchProfiles) {
    try {
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };

      const response = await lastValueFrom(
        this.httpService
          .post(
            `${this.config.get<string>(
              'UNOMI_URL',
            )}/cxs/profiles/batchProfilesUpdate/`,
            batchProfiles,
            configuration,
          )
          .pipe(
            map((res) => {
              return { status: res.status, message: ` Updated , ${res.data}` };
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );
      if (response) {
        for (let i = 0; i < batchProfiles[1].length; i++) {
          this.activityLogSrv.registerLog(
            batchProfiles[1][i],
            batchProfiles[2][i],
          );
        }
      }
      return response;
    } catch (error) {
      return undefined;
    }
  }

  async getCountProfiles() {
    try {
      const configuration = {
        headers: {
          Authorization: `Basic ${this.credentialUnomi}`,
        },
      };

      const response = await lastValueFrom(
        this.httpService
          .get(
            `${this.config.get<string>('UNOMI_URL')}/cxs/profiles/count/`,
            configuration,
          )
          .pipe(
            map((res) => {
              return res.data;
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );
      return response;
    } catch (error) {
      return undefined;
    }
  }
}
