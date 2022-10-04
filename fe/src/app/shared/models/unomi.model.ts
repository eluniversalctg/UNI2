import { Actions, Metadata, parentCondition } from './';

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
