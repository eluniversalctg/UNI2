import { Component } from '@angular/core';
import { Options } from 'src/app/shared/models';
import { genWord } from 'src/app/shared/enums/genericWords';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
})
export class GoalsComponent {
  ruleComponent: Options = {
    label: genWord.GOALLABEL2,
    value: genWord.GOAL,
  };
  constructor() {}
}
