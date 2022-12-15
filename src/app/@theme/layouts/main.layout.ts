/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { BehaviorSubject, Subscription } from 'rxjs';
import { bufferTime, filter, skip } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { select_selectedWorkspace } from '@/store/workspace/workspace.selectors';

import { environment } from '@/environments/environment';
import { Workspace } from '@/app/@core/interfaces/common/workspace';

@Component({
  selector: 'cel-main-layout',
  template: `
    <nb-layout>
      <nb-layout-header class="page-header">
        <cel-header></cel-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" start state="compacted">
        <img
          src="/assets/images/simcel-icon-menu.svg"
          class="menu-icon"
          (click)="logoClickObs.next()"
        />
        <img src="/assets/images/simcel-logo-menu.svg" class="menu-logo" />
        <h3 *ngIf="selectedWorkspace" class="workspace-name">
          {{ selectedWorkspace.name }}
        </h3>
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
  styles: [
    `
      @import '../styles/themes';
      @import '~bootstrap/scss/mixins/breakpoints';
      @import '~@nebular/theme/styles/global/breakpoints';
      @include nb-install-component() {
        .menu-sidebar {
          width: 70px;
        }

        .menu-sidebar ::ng-deep .scrollable {
          background-color: #00355c;
          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
          width: 70px;
          padding: 0px;
        }

        .page-header {
          display: none;
        }

        .menu-icon {
          width: 67px;
          height: 80px;
        }

        .menu-logo {
          width: 53px;
          height: 27px;
          margin-left: 6px;
        }

        // The !important is used to ignore the layout-container class
        .page-footer {
          display: none !important;
        }

        ::ng-deep {
          nb-layout .layout .layout-container .content .columns nb-layout-column {
            padding-left: 0px;
            padding-right: 0px;
            padding-top: 0px;
            border-radius: 0px;
            width: 500px;
          }
        }

        .workspace-name {
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          text-align: center;
          overflow: hidden;
          padding: 0 5px;
          line-height: 2;
          margin-top: 10px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  logoClickObs = new BehaviorSubject<void>(undefined);
  selectedWorkspace?: Workspace;
  private sub?: Subscription;
  private subWorkspace?: Subscription;

  constructor(
    private readonly toastrService: NbToastrService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.subWorkspace = this.store.select(select_selectedWorkspace).subscribe((workspace: Workspace) => {
      this.selectedWorkspace = workspace;
    });
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
    this.subWorkspace?.unsubscribe();
  }

  showVersionInfo() {
    this.toastrService.show(`You are running ${environment.version} version`, 'Info', {
      position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
      duration: 15000,
    });
  }
}
