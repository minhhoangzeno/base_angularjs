/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { NbTokenService } from '@nebular/auth';
import { NbMenuItem, NbMenuService, NbMenuBag, NbDialogService, NbDialogRef } from '@nebular/theme';
import { PagesMenu } from './pages-menu';
import { Store } from '@ngrx/store';
import { GET_CURRENT_USER } from '@/store/auth/auth.actions';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../@components/common/confirm-dialog/confirm-dialog.component';
import { LOCALSTORAGE_KEY_SELECTED_PLAN_ID } from './explorer/shared/explorer.utils';

@Component({
  selector: 'cel-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <cel-main-layout>
      <nb-menu class="page-menu" tag="main-menu" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </cel-main-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {
  menu: NbMenuItem[] = [];
  alive = true;

  constructor(
    private readonly pagesMenu: PagesMenu,
    private readonly tokenService: NbTokenService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly menuService: NbMenuService,
    private readonly dialogService: NbDialogService,
  ) {
    
  }
  
  ngOnInit(): void {
    this.initMenu();
    this.tokenService
      .tokenChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.initMenu();
      });

    this.store.dispatch(GET_CURRENT_USER());
    this.menuService.onItemClick()
      .pipe(takeWhile(() => this.alive))
      .subscribe((payload: NbMenuBag) => {
        if (payload.tag === 'main-menu' && payload.item.title === 'Auth') {
          this.handleClickAuthMenuItem();
        }
      });
  }

  initMenu() {
    this.pagesMenu
      .getMenu()
      .pipe(takeWhile(() => this.alive))
      .subscribe((menu) => {
        this.menu = menu;
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private handleClickAuthMenuItem(): void {
    this.dialogService.open(ConfirmDialogComponent, {
      closeOnBackdropClick: false,
      context: {
        title: 'Are you sure you want to logout?',
        onSubmit: (ref: NbDialogRef<ConfirmDialogComponent>) => {
          this.router.navigate(['auth', 'login']);
          ref.close();
          localStorage.removeItem(LOCALSTORAGE_KEY_SELECTED_PLAN_ID);
        }
      },
    });
  }
}
