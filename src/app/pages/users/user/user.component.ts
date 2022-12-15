/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NbToastrService } from '@nebular/theme';

import { UserData, User } from '../../../@core/interfaces/common/users';
import { EMAIL_PATTERN, NUMBERS_PATTERN } from '../../../@auth/components';
import { NbAuthOAuth2JWTToken, NbTokenService } from '@nebular/auth';
import { UserStore } from '../../../@core/stores/user.store';

// eslint-disable-next-line no-shadow
export enum UserFormMode {
  VIEW = 'View',
  EDIT = 'Edit',
  ADD = 'Add',
  EDIT_SELF = 'EditSelf',
}

@Component({
  selector: 'cel-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  userForm?: FormGroup = undefined;

  protected readonly unsubscribe$ = new Subject<void>();

  get firstName() {
    return this.userForm?.get('firstName');
  }

  get lastName() {
    return this.userForm?.get('lastName');
  }

  get login() {
    return this.userForm?.get('login');
  }

  get email() {
    return this.userForm?.get('email');
  }

  get age() {
    return this.userForm?.get('age');
  }

  get street() {
    return this.userForm?.get('address')?.get('street');
  }

  get city() {
    return this.userForm?.get('address')?.get('city');
  }

  get zipCode() {
    return this.userForm?.get('address')?.get('zipCode');
  }

  mode?: UserFormMode = undefined;
  setViewMode(viewMode: UserFormMode) {
    this.mode = viewMode;
  }

  constructor(
    private readonly usersService: UserData,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly tokenService: NbTokenService,
    private readonly userStore: UserStore,
    private readonly toasterService: NbToastrService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initUserForm();
    void this.loadUserData();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      id: this.fb.control(''),
      role: this.fb.control(''),
      firstName: this.fb.control('', [Validators.minLength(3), Validators.maxLength(20)]),
      lastName: this.fb.control('', [Validators.minLength(3), Validators.maxLength(20)]),
      login: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      age: this.fb.control('', [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
        Validators.pattern(NUMBERS_PATTERN),
      ]),
      email: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      address: this.fb.group({
        street: this.fb.control(''),
        city: this.fb.control(''),
        zipCode: this.fb.control(''),
      }),
    });
  }

  get canEdit(): boolean {
    return this.mode !== UserFormMode.VIEW;
  }

  async loadUserData() {
    const id = this.route.snapshot.paramMap.get('id');
    const isProfile = this.route.snapshot.queryParamMap.get('profile');
    if (isProfile) {
      this.setViewMode(UserFormMode.EDIT_SELF);
      await this.loadUser();
    } else {
      if (id) {
        const currentUserId = this.userStore.getUser()?.id;
        this.setViewMode(currentUserId === id ? UserFormMode.EDIT_SELF : UserFormMode.EDIT);
        await this.loadUser(id);
      } else {
        this.setViewMode(UserFormMode.ADD);
      }
    }
  }

  async loadUser(id?: string) {
    const user = !id
      ? null
      : await (this.mode === UserFormMode.EDIT_SELF
          ? this.usersService.getCurrentUser()
          : this.usersService.get(id)
        ).toPromise();

    this.userForm?.setValue({
      id: user?.id || '',
      role: user?.role || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      login: user?.login || '',
      age: user?.age || '',
      email: user?.email,
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        zipCode: user?.address?.zipCode || '',
      },
    });

    // this is a place for value changes handling
    // this.userForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {   });
  }

  convertToUser(value: unknown): User {
    const user: User = value as User;
    return user;
  }

  save() {
    const user: User = this.convertToUser(this.userForm?.value);

    let observable = new Observable<User>();
    if (this.mode === UserFormMode.EDIT_SELF) {
      this.usersService.updateCurrent(user).subscribe(
        (result: any) => {
          this.tokenService.set(new NbAuthOAuth2JWTToken(result, 'email', new Date()));
          this.handleSuccessResponse();
        },
        () => {
          this.handleWrongResponse();
        },
      );
    } else {
      observable = user.id ? this.usersService.update(user) : this.usersService.create(user);
    }

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => {
        this.handleSuccessResponse();
      },
      () => {
        this.handleWrongResponse();
      },
    );
  }

  handleSuccessResponse() {
    this.toasterService.success(
      '',
      `Item ${this.mode === UserFormMode.ADD ? 'created' : 'updated'}!`,
    );
    this.back();
  }

  handleWrongResponse() {
    this.toasterService.danger('', `This email has already taken!`);
  }

  back() {
    void this.router.navigate(['/pages']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
