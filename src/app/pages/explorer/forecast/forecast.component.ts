import { select_forecastURL } from '@/store/pages/demand-planning/demand-planning.selectors';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cel-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  constructor(private readonly sanitizer: DomSanitizer, private readonly store: Store) {}

  srcObs = this.store
    .select(select_forecastURL)
    // eslint-disable-next-line ngrx/avoid-mapping-selectors
    .pipe(map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url)));
}
