import { Component } from '@angular/core';
import { Options } from 'src/app/shared/models';
import { genWord } from 'src/app/shared/enums/genericWords';
@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
})
export class SegmentsComponent {
  ruleComponent: Options = {
    label: genWord.SEGMENTLABEL2,
    value: genWord.SEGMENT,
  };

  constructor() {}
}
