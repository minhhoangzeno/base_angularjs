/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NbAuthModule } from '@nebular/auth';
import { CommonBackendModule } from './backend/common/common-backend.module';
import { SettingsService } from './backend/common/services/settings.service';
import { UsersService } from './backend/common/services/users.service';
import { SimcelBackendModule } from './backend/simcel/simcel-backend.module';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { UsersnapService } from './utils/usersnap.service';
import { KpisService } from './services/kpis.service';
import { UserStore } from './stores/user.store';
import { AnalyticsService, LayoutService, PlayerService } from './utils';


export const NB_CORE_PROVIDERS = [
  ...(CommonBackendModule.forRoot().providers || []),
  ...(SimcelBackendModule.forRoot().providers || []),

  AnalyticsService,
  LayoutService,
  PlayerService,
  UsersnapService,
  KpisService,
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS, UserStore, UsersService, SettingsService],
    };
  }
}
