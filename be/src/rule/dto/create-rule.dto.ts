import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty() readonly id: string;
  @ApiProperty() readonly name: string;
  @ApiProperty() readonly description: string;
  @ApiProperty() readonly tags?: string[];
  @ApiProperty() readonly systemTags?: string[];
  @ApiProperty() readonly scope?: string;
  @ApiProperty() readonly enabled?: boolean;
  @ApiProperty() readonly missingPlugins?: boolean;
  @ApiProperty() readonly hidden?: boolean;
  @ApiProperty() readonly readOnly?: boolean;
}
export class subCondition {
  @ApiProperty() readonly type: string | undefined;
  @ApiProperty() readonly parameterValues: any;
}
export class parameterValues {
  @ApiProperty() readonly subCondition: subCondition[];
  @ApiProperty() readonly operator: string;
  @ApiProperty() readonly eventTypeId?: string;
}

export class parentCondition {
  @ApiProperty() readonly type: string;
  @ApiProperty() readonly parameterValues: parameterValues;
}

export class Variable {
  @ApiProperty() readonly _id?: string;
  @ApiProperty() readonly id: string;
  @ApiProperty() readonly type: string;
  @ApiProperty() readonly multivalued: boolean;
  @ApiProperty() readonly defaultValue?: string | null;
  @ApiProperty() readonly optionValues?: optionValues[];
}
export class Actions {
  @ApiProperty() readonly actionExecutor?: string;
  @ApiProperty() readonly parameters: Variable[];
  @ApiProperty() readonly metadata?: Metadata = new Metadata();
  @ApiProperty() readonly id?: string;
  @ApiProperty() readonly name?: string;
  @ApiProperty() readonly description?: string;
  @ApiProperty() readonly tags?: string[];
  @ApiProperty() readonly systemTags?: string[];
  @ApiProperty() readonly version?: number;
}
export class Options {
  @ApiProperty() readonly label: string;
  @ApiProperty() readonly value?: string;
}
export class optionValues {
  @ApiProperty() readonly value: string;
  @ApiProperty() readonly options: Options[] | string[];
}

export class CreateRuleDto {
  @ApiProperty() readonly metadata: Metadata;
  @ApiProperty() readonly itemId: string;
  @ApiProperty() readonly itemType: string;
  @ApiProperty() readonly startDate?: Date;
  @ApiProperty() readonly endDate?: Date;
  @ApiProperty() readonly cost?: number;
  @ApiProperty() readonly currency?: string;
  @ApiProperty() readonly primaryGoal?: string;
  @ApiProperty() readonly systemTags?: any[];
  @ApiProperty() readonly timezone?: string;
  @ApiProperty() readonly condition?: parentCondition;
  @ApiProperty() readonly secCondition?: parentCondition;
  @ApiProperty() readonly campaignId?: string;
  @ApiProperty() readonly actions?: Actions[];
  @ApiProperty() readonly linkedItems?: string[];
  @ApiProperty() readonly raiseEventOnlyOnceForProfile?: boolean;
  @ApiProperty() readonly raiseEventOnlyOnceForSession?: boolean;
  @ApiProperty() readonly priority?: number;
  @ApiProperty() userId: string;
  @ApiProperty() screen: string;
  @ApiProperty() action: string;
}
