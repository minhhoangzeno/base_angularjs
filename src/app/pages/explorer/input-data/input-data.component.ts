import { Plan } from '@/app/@core/interfaces/business/plan';
import {
  AVAILABLE_MASTER_INPUT_COLLECTIONS,
  ILoadEditedMasterIputDataParams,
  ILoadMasterIputDataParams,
  IGetMasterIputDataTotalParams,
  LOAD_EDITED_INPUT_DATA,
  LOAD_INPUT_DATA,
  LOAD_INPUT_DATA_TOTAL,
  UPSERT_INPUT_DATA,
} from '@/store/pages/input-data/input-data.actions';
import {
  select_editedInputData,
  select_inputData,
  select_inputDataColumns,
  select_inputDataTotal,
  select_loadingInputData,
} from '@/store/pages/input-data/input-data.selectors';
import { SELECT_PLAN } from '@/store/pages/layout/layout.actions';
import { select_selectedPlan } from '@/store/pages/layout/layout.selectors';
import { select_sortedPlan } from '@/store/plan/plan.selectors';
import { select_scenarios } from '@/store/scenario/scenario.selectors';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Subscription, tap } from 'rxjs';
import { InputDataService } from './input-data.service';

@Component({
  selector: 'cel-input-data',
  template: `
    <div class="container-fluid">
      <nb-card class="event-mnt-header -card">
        <!-- TODO: Turn me into another component. -->
        <nb-card-body class="row event-mnt-header -body">
          <div class="col-1 row event-mnt-header -back -div">
            <button class="event-mnt-header -back -btn" (click)="redirectToDemandPlanning()">
              <nb-icon class="event-mnt-header -back -icon" icon="arrow-back-outline"></nb-icon>
            </button>
          </div>
          <div class="col event-mnt-plan">
            <cel-planning-import
              [selected]="selectedPlan | async | defaultTo: undefined"
              (selectedChange)="onSelectPlanChanged($event)"
              [plans]="sortedPlans | async | defaultTo: []"
            ></cel-planning-import>
          </div>
        </nb-card-body>
      </nb-card>

      <div>
        <p class="headline">
          Scenario Master Input Data Edit: <b>{{ scenarioName | async }}</b>
        </p>
      </div>

      <nz-tabset nzType="card" (nzSelectChange)="tabChanged($event)">
        <nz-tab *ngFor="let tab of tabs" [nzTitle]="tab.title">
          <ng-container *ngrxLet="columns as columns">
            <ng-container *ngrxLet="data as data">
              <ng-container *ngrxLet="editedData as editedData">
                <ng-container *ngrxLet="scenarioId as scenarioId">
                  <ng-container *ngrxLet="scenarioInputDatabase as inputDatabase">
                    <nz-table
                      #editRowTable
                      nzBordered
                      nzShowSizeChanger
                      [nzScroll]="{ x: columns.length * 250 + 'px' }"
                      [nzData]="data"
                      [nzFrontPagination]="false"
                      [nzLoading]="loading | ngrxPush"
                      [nzTotal]="total | ngrxPush | defaultTo: 0"
                      [nzPageSize]="pageSize | ngrxPush | defaultTo: 10"
                      (nzPageSizeChange)="pageSize.next($event)"
                      (nzPageIndexChange)="activePage.next($event)"
                    >
                      <thead>
                        <tr>
                          <th *ngFor="let col of columns; let i = index" [nzLeft]="i < 1">
                            {{ col.title }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let row of editRowTable.data" class="editable-row">
                          <ng-container *ngFor="let col of columns; let i = index">
                            <td *ngIf="col.editable" [nzLeft]="i < 1">
                              <div
                                class="editable-cell"
                                [hidden]="editId === row._id"
                                (click)="startEdit(row._id)"
                                [class.edited]="isCellEdited(editedData, row, col.id)"
                              >
                                {{ getCellValue(editedData, row, col.id) }}
                              </div>
                              <input
                                [hidden]="editId !== row._id"
                                type="text"
                                nz-input
                                [defaultValue]="getCellValue(editedData, row, col.id)"
                                (blur)="
                                  stopEdit(
                                    row,
                                    col.id,
                                    tab.id,
                                    inputDatabase,
                                    scenarioId,
                                    $event.target
                                  )
                                "
                              />
                            </td>
                            <td *ngIf="!col.editable" [nzLeft]="i < 1">
                              {{ row[col.id] }}
                            </td>
                          </ng-container>
                        </tr>
                      </tbody>
                    </nz-table>
                  </ng-container>
                </ng-container>
              </ng-container>
            </ng-container>
          </ng-container>
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [
    `
      .editable-cell {
        position: relative;
        padding: 5px 12px;
        cursor: pointer;
      }

      .editable-row:hover .editable-cell {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
      }
      .edited {
        color: blue;
      }
      .headline {
        text-align: center;
      }
      .event-mnt-header {
        &.-card {
          margin-bottom: 0px;
        }

        &.-body {
          padding: 0px;
          background-color: #c8ced9;
        }

        &.-create {
          font-family: Roboto;
          font-style: normal;
          font-weight: 500;
          font-size: 18px;
          line-height: 21px;
          color: #00355c;
          margin-left: 20px;
          border-left: 1px solid #00355c;
          padding-left: 20px;
        }

        &.-back {
          &.-div {
            max-width: 5%;
          }

          &.-icon {
            width: 20px;
            height: 20px;
            margin-left: 10px;
            color: #426c9d;
          }

          &.-btn {
            font-family: Roboto;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 16px;
            color: #00355c;
            border: none;
            background-color: transparent;
          }
        }
      }
    `,
  ],
})
export class InputDataComponent implements OnInit, OnDestroy {
  scenarioId = this.route.params.pipe(map((params) => params['scenarioId'] as string));
  scenarios = this.store.select(select_scenarios);
  scenario = combineLatest([this.scenarios, this.scenarioId]).pipe(
    map(([scenarios, id]) => scenarios.find((s) => s.id === id)),
  );
  scenarioName = this.scenario.pipe(map((s) => s?.name));
  scenarioInputDatabase = this.scenario.pipe(map((s) => s?.inputDatabase));
  selectedPlan = this.store.select(select_selectedPlan);
  sortedPlans = this.store.select(select_sortedPlan);

  data = this.store.select(select_inputData);
  total = this.store.select(select_inputDataTotal);
  columns = this.store.select(select_inputDataColumns);
  editedData = this.store.select(select_editedInputData);
  loading = this.store.select(select_loadingInputData);

  tabs = AVAILABLE_MASTER_INPUT_COLLECTIONS;
  activeTab = new BehaviorSubject(AVAILABLE_MASTER_INPUT_COLLECTIONS[0].id);
  activePage = new BehaviorSubject(0);
  pageSize = new BehaviorSubject(10);
  editId?: string;

  // PARAMS:
  loadParams = combineLatest([this.scenario, this.activeTab, this.activePage, this.pageSize]).pipe(
    map(([scenario, activeTab, activePage, pageSize]) => {
      if (!scenario || !activeTab) return;

      return <ILoadMasterIputDataParams>{
        database: scenario.inputDatabase,
        collection: activeTab,
        limit: pageSize,
        skip: activePage * pageSize,
      };
    }),
  );
  loadEditedParams = combineLatest([this.scenario, this.activeTab]).pipe(
    map(([scenario, activeTab]) => {
      if (!scenario || !activeTab) return;

      return <ILoadEditedMasterIputDataParams>{
        database: scenario.inputDatabase,
        collection: activeTab,
        scenarioId: scenario.id,
      };
    }),
  );
  loadTotalParams = combineLatest([this.scenario, this.activeTab]).pipe(
    map(([scenario, activeTab]) => {
      if (!scenario || !activeTab) return;

      return <IGetMasterIputDataTotalParams>{
        database: scenario.inputDatabase,
        collection: activeTab,
      };
    }),
  );

  loadDataSubscription?: Subscription;
  loadEditedDataSubscription?: Subscription;
  loadDataTotalSubscription?: Subscription;

  onSelectPlanChanged(plan: Plan) {
    this.store.dispatch(SELECT_PLAN({ plan }));
  }

  async redirectToDemandPlanning() {
    await this.router.navigate(['pages', 'explorer', 'demand-planning']);
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(
    row: any,
    colId: string,
    collection: string,
    database: string | undefined,
    scenarioId: string | undefined,
    input: HTMLInputElement,
  ) {
    this.editId = undefined;
    if (!database || !scenarioId) return;
    if (input.value === input.defaultValue) return;

    let newVal: string | number = input.value;
    if (typeof row[colId] === 'number') newVal = +newVal;

    const editedRow = { ...row, [colId]: newVal };

    this.store.dispatch(
      UPSERT_INPUT_DATA({ params: { collection, database, scenarioId, row: editedRow } }),
    );
    // Reset value
    input.value = input.defaultValue;
  }

  tabChanged(e: NzTabChangeEvent) {
    console.log('🔮 tabChanged', e);
    this.activeTab.next(this.tabs[e.index || 0].id);
  }

  isCellEdited(editedData: readonly any[], row: any, col: string) {
    const editedRow = editedData.find((r) => r._id === row._id);
    if (!editedRow) return false;
    return editedRow[col] !== row[col];
  }
  getCellValue(editedData: readonly any[], row: any, col: string) {
    const editedRow = editedData.find((r) => r._id === row._id);
    return editedRow?.[col] || row[col];
  }

  constructor(
    private readonly store: Store,
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    public readonly inputDataService: InputDataService,
  ) {}

  ngOnDestroy(): void {
    this.loadDataSubscription?.unsubscribe();
    this.loadDataTotalSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.loadDataSubscription = this.loadParams
      .pipe(filter(notNullOrUndefined), debounceTime(200))
      .subscribe((params) => this.store.dispatch(LOAD_INPUT_DATA({ params })));
    this.loadEditedDataSubscription = this.loadEditedParams
      .pipe(filter(notNullOrUndefined), debounceTime(200))
      .subscribe((params) => this.store.dispatch(LOAD_EDITED_INPUT_DATA({ params })));

    this.loadDataTotalSubscription = this.loadTotalParams
      .pipe(filter(notNullOrUndefined), debounceTime(200))
      .subscribe((params) => this.store.dispatch(LOAD_INPUT_DATA_TOTAL({ params })));
  }
}
