import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Utilities } from 'src/utils/utilities';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { ConditionRepository } from './conditions.repository';
import { CreateConditionDto } from './dto/create-condition.dto';

@Injectable()
export class ConditionsService {
  credentialUnomi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly utilities: Utilities,
    private readonly conditionRepository: ConditionRepository,
  ) {
    this.credentialUnomi = this.utilities.getCredenctialsUnomi();
  }
  /**
   *
   * get all the conditions from unomi server
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
        `${this.config.get<string>('UNOMI_URL')}/cxs/definitions/conditions/`,
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
   * get the conditions from database
   */
  async findConditions() {
    try {
      return await this.conditionRepository.find({});
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * create the conditions from unomi server
   */
  async create(createConditionDto: CreateConditionDto) {
    //create the structure of the condition according to unomi
    const saveConditon = {
      conditionId: createConditionDto.metadata.id,
      name: createConditionDto.metadata.name,
      conditionEvaluator: createConditionDto.conditionEvaluator,
      queryBuilder: createConditionDto.queryBuilder,
      parentCondition: createConditionDto.parentCondition,
      treeParentCondition: createConditionDto.treeParentCondition,
    };
    delete createConditionDto.treeParentCondition;

    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = await lastValueFrom(
      this.httpService
        .post(
          `${this.config.get<string>('UNOMI_URL')}/cxs/definitions/conditions/`,
          createConditionDto,
          configuration,
        )
        .pipe(
          map(() => {
            return { message: `Created successfully`, status: 200 };
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );

    // save condition in database
    if (response) {
      this.saveCondition(saveConditon);
    }

    return response;
  }

  /**
   *
   * @param saveConditon
   * Save condition in database
   */
  async saveCondition(saveConditon) {
    return await this.conditionRepository.findOneAndUpdate(
      { conditionId: saveConditon.conditionId },
      saveConditon,
    );
  }
}
