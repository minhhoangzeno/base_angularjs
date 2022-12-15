import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';

import { AnalyticsService } from './@core/utils';
import { environment } from '@/environments/environment';
import { UsersnapService } from './@core/utils/usersnap.service';

@Component({
  selector: 'cel-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly titleService: Title,
    private readonly i18n: NzI18nService,
    private readonly usersnapService: UsersnapService,
  ) {}

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.titleService.setTitle(`SIMCEL`);
    this.analytics.trackPageViews();
    this.usersnapService.initialize();
    console.log(
      '🗿 You are running %c%s',
      'font-weight:bold;color:blue',
      environment.version,
      'version',
    );
  }
}
