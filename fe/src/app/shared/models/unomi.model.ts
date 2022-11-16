import { Actions, Metadata, parentCondition, ParentCondition } from './';

export class UNOMI {
  metadata: Metadata;
  itemId: string;
  itemType: string;
  startDate?: Date;
  endDate?: Date;
  cost?: number;
  currency?: string;
  primaryGoal?: string;
  systemTags?: any[];
  timezone?: string;
  condition?: parentCondition | null;
  secCondition?: parentCondition;
  elements?: ScoringElements[];
  campaignId?: string;
  actions?: Actions[];
  linkedItems?: string[];
  raiseEventOnlyOnceForProfile?: boolean;
  raiseEventOnlyOnceForSession?: boolean;
  priority?: number;
  // activityLog fields
  userId?: string;
  screen?: string;
  action?: string;
}

export class ScoringElements {
  value: number;
  Condition?: ParentCondition[];
  condition?: parentCondition | null;
}
