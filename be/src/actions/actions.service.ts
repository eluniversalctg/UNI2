import { catchError, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Utilities } from 'src/utils/utilities';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';

@Injectable()
export class ActionsService {
  credentialUnomi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly utilities: Utilities,
  ) {
    this.credentialUnomi = this.utilities.getCredenctialsUnomi();
  }
  /**
   *
   * get the actions from unomi server
   */
  findAll() {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = this.httpService
      .get(
        `${this.config.get<string>('UNOMI_URL')}/cxs/definitions/actions/`,
        configuration,
      )
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );

    return response;
  }

  /**
   *
   * create the actions from unomi server
   */
  create(createActionDto: CreateActionDto) {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = this.httpService
      .post(
        `${this.config.get<string>('UNOMI_URL')}/cxs/definitions/actions/`,
        createActionDto,
        configuration,
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
