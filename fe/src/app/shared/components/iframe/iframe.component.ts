import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent implements OnChanges {
  @Input() htmlTemplate: string;
  @Input() widthIframe;
  @Input() highIframe;
  constructor() {}

  ngOnChanges() {
    let iframe = document.getElementById('iframeRenderisation');
    let content = this.htmlTemplate;
    let doc = iframe['contentDocument'] || iframe['contentWindow'];
    doc.open();
    doc.write(content);
    doc.close();

    if(this.widthIframe){

      this.widthIframe= this.widthIframe+"px";
    }else{
      this.widthIframe = "100%";
    }
    if(this.highIframe){

      this.highIframe= this.highIframe+"px";
    }else{
      this.highIframe = "47vh";
    }


  }
}
