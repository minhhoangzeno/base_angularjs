/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { BehaviorSubject, Subscription } from 'rxjs';
import { bufferTime, filter, skip } from 'rxjs/operators';

import { environment } from '@/environments/environment';

@Component({
  selector: 'cel-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header class="page-header">
        <cel-header></cel-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" start state="compacted">
        <img
          src="../../../../assets/images/simcel-icon-menu.svg"
          class="menu-icon"
          (click)="logoClickObs.next()"
        />
        <img src="../../../../assets/images/simcel-logo-menu.svg" class="menu-logo" />
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="page-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer class="page-footer">
        <cel-footer></cel-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {
  logoClickObs = new BehaviorSubject<void>(undefined);
  private sub?: Subscription;

  constructor(private readonly toastrService: NbToastrService) {}

  ngOnInit(): void {
    // Show version info when clicking the logo 5 times within 2s
    const triggerCount = 5;
    this.sub = this.logoClickObs
      .pipe(
        // Skip inital value (when subscribe to BehaviorSubject)
        skip(1),
        // Create a buffer and collect clicks within 2s or if the maximum size reached (triggerCount)
        bufferTime(2000, -1, triggerCount),
        filter((buf) => buf.length === triggerCount),
      )
      .subscribe(this.showVersionInfo.bind(this));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  showVersionInfo() {
    this.toastrService.show(`You are running ${environment.version} version`, 'Info', {
      position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
      duration: 15000,
    });
  }
}
