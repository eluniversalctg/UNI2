import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
/**
 * this pipe transform "unsafe" link into safe link
 * prevent this error: NG0904: unsafe value used in a resource URL context (see https://g.co/ng/security#xss)
 */
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
