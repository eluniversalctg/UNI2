import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Utilities } from 'src/utils/utilities';
import { map, catchError, lastValueFrom } from 'rxjs';
import { CreateRuleDto } from './dto/create-rule.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpException, Injectable } from '@nestjs/common';
import { RuleRepository, SegmentRepository } from './rule.repository';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Injectable()
export class RuleService {
  credentialUnomi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly utilities: Utilities,
    private readonly ruleRep: RuleRepository,
    private readonly activityLogSrv: ActivityLogService,
    private readonly segmentRep: SegmentRepository,
  ) {
    this.credentialUnomi = this.utilities.getCredenctialsUnomi();
  }

  /**
   *
   * @param param type rule (segment,goal,campaings,personalization)
   * @returns get all rule from unomi
   */
  async findAllRules(param: string) {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.config.get<string>('UNOMI_URL')}/cxs/${param}`,
          configuration,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   *
   * @param from type ru;e
   * @returns get all rules from mongo DB
   */
  async findAllRulesMongo(from: string) {
    return await this.ruleRep.find({ type: from });
  }

  /**
   *
   * @param createRuleDto rule to create
   * @param from type rule
   * @returns created object
   */
  async create(createRuleDto: CreateRuleDto, from: string) {
    //the object is created to save in unomi and in mongo DB
    try {
      const saveUnomi = { ...createRuleDto[0] };
      const lastUnomi = { ...createRuleDto[1] };
      delete createRuleDto[0]['Condition'];
      delete createRuleDto[0]['conditionString'];
      delete createRuleDto[0]['userId'];
      delete createRuleDto[0]['screen'];
      delete createRuleDto[0]['action'];
      delete createRuleDto[0]['firstCondition'];
      delete createRuleDto[0]['objectModified'];
      if (createRuleDto[0]['secConditionString']) {
        delete createRuleDto[0]['secConditionString'];
      }

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
            `${this.config.get<string>('UNOMI_URL')}/cxs/${from}`,
            createRuleDto[0],
            configuration,
          )
          .pipe(
            map(() => {
              return {
                message: `${from} created successfully`,
                status: 200,
              };
            }),
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );

      //save in mongo DB
      if (response.message) {
        this.saveIntoMongo(saveUnomi, from);
        //create binnacle
        this.activityLogSrv.registerLog(saveUnomi, lastUnomi);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  /**
   *
   * @param UNOMI rule to save
   * @param from tupe rule
   * @returns saved object
   */
  async saveIntoMongo(UNOMI, from) {
    //the object is modeled
    const saveUnomi = {
      id: UNOMI.metadata.id,
      type: from,
      condition: UNOMI.conditionString,
      secCondition: UNOMI.secConditionString,
      priority: UNOMI.priority,
      cost: UNOMI.cost,
      currency: UNOMI.currency,
      timezone: UNOMI.timezone,
      startDate: UNOMI.startDate,
      endDate: UNOMI.endDate,
      raiseEventOnlyOnceForProfile: UNOMI.raiseEventOnlyOnceForProfile,
      raiseEventOnlyOnceForSession: UNOMI.raiseEventOnlyOnceForSession,
    };

    //save in mongo DB
    return await this.ruleRep.findOneAndUpdate(
      {
        $and: [{ type: from }, { id: UNOMI.metadata.id }],
      },
      saveUnomi,
    );
  }

  /**
   *
   * @param conditionReq condition to obtain the sessions
   * @returns get all session
   */
  async getSessions(conditionReq) {
    //condition accepted by unomi
    const data = {
      offset: 0,
      condition: conditionReq ? conditionReq : {},
      limit: -1,
    };

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
          `${this.config.get<string>(
            'UNOMI_URL',
          )}/cxs/profiles/search/sessions`,
          data,
          configuration,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   *
   * @param sessionID id the session
   * @returns session by id
   */
  async getSessionId(sessionID) {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.config.get<string>(
            'UNOMI_URL',
          )}/cxs/profiles/sessions/${sessionID}`,
          configuration,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   *
   * @param segmentsID id the session
   * @returns count the session by id
   */
  async getCountSegments(segmentsID) {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.config.get<string>(
            'UNOMI_URL',
          )}/cxs/segments/${segmentsID}/count/`,
          configuration,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   *
   * @param segmentsID id the segment
   * @returns impacted the segment by id Segement
   */
  async getImpactedSegments(segmentsID) {
    //create configuration and autorization to access server
    const configuration = {
      headers: {
        Authorization: `Basic ${this.credentialUnomi}`,
      },
    };

    //create request object
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.config.get<string>(
            'UNOMI_URL',
          )}/cxs/segments/${segmentsID}/impacted/`,
          configuration,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   * save the number of segments per day
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cronJobSaveSegements() {
    //get all segments from mongo DB
    const segments: any[] = await new Promise(async (resolve) => {
      resolve(this.findAllRules('segments'));
    });

    const saveSegments: any[] = [];

    if (segments.length > 0) {
      for (let i = 0; i < segments.length; i++) {
        //get count of each segment
        const count = await new Promise(async (resolve) => {
          resolve(this.getCountSegments(segments[i].id));
        });

        //create object type segment
        const segmentSave = {
          idSegement: segments[i].id,
          dateSegement: new Date(),
          count: count,
        };
        saveSegments.push(segmentSave);
      }
    }

    //save in the database
    try {
      this.segmentRep.createMany(saveSegments);
    } catch (e) {
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  /**
   * get all segments
   */
  async findAllSegments() {
    try {
      return await this.segmentRep.find({});
    } catch (e) {
      throw new HttpException(e.response.data, e.response.status);
    }
  }
}
