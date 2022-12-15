/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LayoutService } from '@/app/@core/utils';
import { UserStore } from '@/app/@core/stores/user.store';
import { SettingsData } from '@/app/@core/interfaces/common/settings';
import { User } from '@/app/@core/interfaces/common/users';

@Component({
  selector: 'cel-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  user?: User;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = this.getMenuItems();

  constructor(
    private readonly sidebarService: NbSidebarService,
    private readonly menuService: NbMenuService,
    private readonly themeService: NbThemeService,
    private readonly userStore: UserStore,
    private readonly settingsService: SettingsData,
    private readonly layoutService: LayoutService,
    private readonly breakpointService: NbMediaBreakpointsService,
  ) {}

  getMenuItems() {
    const userLink = this.user ? '/pages/users/current/' : '';
    return [
      { title: 'Profile', link: userLink, queryParams: { profile: true } },
      { title: 'Log out', link: '/auth/logout' },
    ];
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userStore
      .onUserStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        this.userMenu = this.getMenuItems();
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl));

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    const user = this.userStore.getUser();
    if (!user) return;
    this.userStore.setSetting(themeName);
    this.settingsService.updateCurrent(user.settings).pipe(takeUntil(this.destroy$)).subscribe();

    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
