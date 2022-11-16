import { Component } from '@angular/core';
import { Options } from 'src/app/shared/models';
import { genWord } from 'src/app/shared/enums/genericWords';

@Component({
  selector: 'app-scorign',
  templateUrl: './scoring.component.html',
})
export class ScoringComponent {
  ruleComponent: Options = {
    label: genWord.SCORINGLABEL,
    value: genWord.SCORING,
  };

  constructor() {}
}
