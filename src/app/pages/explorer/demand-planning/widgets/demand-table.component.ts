import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { equals } from 'rambda';

import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import {
  select_demands_loading,
  select_combinedDemandsChartData,
  select_demandGroupings,
  select_formatByDateAggregation,
} from '@/store/pages/demand-planning/demand-planning.selectors';
import {
  select_displayingScenarios,
  select_highlightedScenario,
} from '@/store/scenario/scenario.selectors';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { OrganizeDetailDialogComponent } from './forecast-table/organize-detail-dialog.component';
import { MATCHER_LABELS_LOOKUP } from '@/app/@core/constants/entity-matcher.constants';
import { TreeList } from '@/utils/treelist';
import { UPDATE_DEMAND_GROUPING } from '@/store/pages/demand-planning/demand-planning.actions';

/** List of all grouping fields. */
const ALL_GROUPING_FIELDS = Object.keys(MATCHER_LABELS_LOOKUP).sort();

@Component({
  selector: 'cel-demand-table',
  template: `
    <nz-table
      *ngrxLet="combinedDemandsChartData as data"
      [nzData]="data.tree"
      [nzLoading]="demandChartDataLoading | ngrxPush"
      [nzShowPagination]="false"
      nzSimple
      [nzScroll]="{
        x: 155 * data.columns.length + 'px',
        y: '400px'
      }"
    >
      <thead>
        <tr>
          <th nzLeft nzWidth="300px" class="configCell">
            <button
              nz-button
              nzType="text"
              nzShape="circle"
              nzSize="large"
              (click)="openOrganizeDetailDialog()"
              nz-popover
              nzPopoverContent="Organize Detail Results"
              nzPopoverPlacement="right"
            >
              <i nz-icon nzType="control"></i>
            </button>
          </th>
          <th *ngFor="let col of data.columns || []" class="cell colHeader">
            <ng-container *ngrxLet="formatByDateAggregation as formatFn">
              {{ formatFn(col) }}
            </ng-container>
          </th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let row of data.tree">
          <ng-container *ngFor="let item of mapOfExpandedData[row.key]">
            <tr *ngIf="(item.parent && item.parent.expand) || !item.parent">
              <td
                class="rowHeader"
                nzLeft
                [nzIndentSize]="item.level! * 16"
                [nzShowExpand]="!!item.children?.length"
                [(nzExpand)]="item.expand"
                (nzExpandChange)="collapse(mapOfExpandedData[row.key], item, $event)"
                [style]="{ color: getColor(item.key, displayingScenarios | ngrxPush) }"
              >
                {{ item.label }}
              </td>
              <td *ngFor="let _ of data.columns || []; let i = index" 
              class="cell"
              >
                {{ valueFormat(item.data[i]) }}
              </td>
            </tr>
          </ng-container>
        </ng-container>
      </tbody>
    </nz-table>
  `,
  styles: [
    `
      .cell {
        text-align: right;
      }
      .colHeader.colHeader.colHeader.colHeader,
      .rowHeader {
        font-weight: 600;
      }
      .configCell {
        padding-top: 0;
        padding-bottom: 0;
      }
    `,
  ],
})
export class DemandTableComponent implements OnInit, OnDestroy {
  demandChartDataLoading = this.store.select(select_demands_loading);
  combinedDemandsChartData = this.store.select(select_combinedDemandsChartData);
  displayingScenarios = this.store.select(select_displayingScenarios);
  demandGroupings = this.store.select(select_demandGroupings);
  formatByDateAggregation = this.store.select(select_formatByDateAggregation);

  mapOfExpandedData: Record<string, TreeList.ITreeNode[]> = {};
  subscription?: Subscription;

  collapse = TreeList.collapse;

  ngOnInit(): void {
    this.subscription = this.combinedDemandsChartData.subscribe((data) => {
      data.tree.forEach((item) => {
        this.mapOfExpandedData[item.key] = TreeList.convert(item);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  
  constructor(private readonly store: Store, private readonly dialogService: NbDialogService) { }

  async openOrganizeDetailDialog() {
    const groupings = await firstValueFrom(this.demandGroupings);
    const dialog = this.dialogService.open(OrganizeDetailDialogComponent, {
      context: {
        // Do not include fields that are already in `this.groupings`.
        fields: ALL_GROUPING_FIELDS.filter((field) => groupings.indexOf(field) < 0),
        groupings: [...groupings],
      },
    });
    dialog.onClose.subscribe((result) => {
      if (result && !equals(groupings, result)) {
        this.store.dispatch(UPDATE_DEMAND_GROUPING({ data: result }));
      }
    });
  }

  getColor(id: string, scenarios: Scenario[] | undefined) {
    return (
      (scenarios || [])
        .filter((s) => s.id === id)
        .map((s) => s.color)
        .pop() || ''
    );
  }
  valueFormat(n?: number | null, fallbackVal = '-') {
    if (n === undefined || n === null || isNaN(n)) return fallbackVal;
    return transformInputToKpiFormat(n);
  }
}
