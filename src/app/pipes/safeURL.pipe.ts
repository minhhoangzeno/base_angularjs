import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeURL' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url: string) {
    return this.domSanitizer.sanitize(SecurityContext.URL, url);
  }
}
