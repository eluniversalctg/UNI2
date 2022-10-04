import { Component } from '@angular/core';
import { Options } from 'src/app/shared/models';
import { genWord } from 'src/app/shared/enums/genericWords';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent {
  ruleComponent: Options = {
    label: genWord.RULELABEL,
    value: genWord.RULE,
  };
  constructor() {}
}
