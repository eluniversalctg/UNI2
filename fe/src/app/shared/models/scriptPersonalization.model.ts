import { parentCondition } from "./";

export class ScriptPersonalization{
  id: string;
  strategy: string;
  strategyOptions: {
    fallback:string;
  };
  contents : Contents[];
}

export class Contents{
  ​
    id: string;
    filters?: ConditionPers[];
  }


class ConditionPers
{
  condition: parentCondition
}
