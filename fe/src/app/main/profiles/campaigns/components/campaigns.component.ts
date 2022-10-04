import { Component } from '@angular/core';
import { Options } from 'src/app/shared/models';
import { genWord } from 'src/app/shared/enums/genericWords';

@Component({
  selector: 'app-rules',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {
  ruleComponent: Options = {
    label: genWord.CAMPAIGNLABEL,
    value: genWord.CAMPAIGN,
  };

  constructor() {}
}
