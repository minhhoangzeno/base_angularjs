import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { select_profitExplorerURL } from '@/store/pages/profit-explorer/profit-explorer.selectors';

@Component({
  selector: 'cel-profit-explorer',
  templateUrl: 'profit-explorer.component.html',
  styleUrls: ['./profit-explorer.component.scss'],
})
export class ProfitExplorerComponent {
  src = this.store.select(select_profitExplorerURL);
  sanitiedSrc = this.src.pipe(map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url)));

  constructor(private readonly sanitizer: DomSanitizer, private readonly store: Store) {}
}
