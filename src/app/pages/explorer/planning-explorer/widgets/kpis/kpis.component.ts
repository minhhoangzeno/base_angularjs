import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import {
  Breakdown,
  BreakdownKpis,
  BREAKDOWN_KPIS_GROUPING_INFO_LIST,
  BREAKDOWN_KPIS_INFO,
  BREAKDOWN_KPIS_INFO_LIST,
  calculateCbm,
  calculateMargin,
  calculateServiceLevel,
  calculateStorageAndDistribution,
  calculateStorageAndHandling,
  KpiMetadata,
  kpiOf,
} from '@/app/@core/interfaces/business/breakdown';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { Store } from '@ngrx/store';
import {
  select_displayingScenarios,
  select_displayingScenariosWithTaskStatus,
  select_highlightedScenario,
} from '@/store/scenario/scenario.selectors';
import {
  select_kpis,
  select_kpis_loading,
} from '@/store/pages/planning-explorer/planning-explorer.selector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NbDialogService } from '@nebular/theme';
import { KpisSettingComponent } from '../kpis-setting/kpis-setting.component';
import { KpisService } from '@/app/@core/services/kpis.service';

const HIGHLIGHTED_COLOR_TRANSPARENT_IN_HEX = '1A';

/** List of all KPIS fields. */
const ALL_GROUPING_FIELDS = BREAKDOWN_KPIS_INFO_LIST;
@Component({
  selector: 'cel-planning-kpis',
  styleUrls: ['./kpis.component.scss'],
  templateUrl: './kpis.component.html',
  // OnPush: only check for changes from Input()
  // Otherwise, call changeDetectoRef.markForCheck
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpisComponent implements OnInit {
  highlightedScenario = this.store.select(select_highlightedScenario);
  displayingScenarios = this.store.select(select_displayingScenarios);
  selectedScenarios = this.store.select(select_displayingScenariosWithTaskStatus);
  data = this.store.select(select_kpis);
  loading = this.store.select(select_kpis_loading);

  comparisionMode?: 'percentage' | 'value' = 'percentage';

  /** List of kpis to be displayed. */
  selectedKpis: any;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly dialogService: NbDialogService,
    private kpisService: KpisService
  ) { }

  /** Expose to template. */
  BREAKDOWN_KPIS_INFO_LIST = BREAKDOWN_KPIS_INFO_LIST;
  readonly BREAKDOWN_KPIS_INFO = BREAKDOWN_KPIS_INFO;

  readonly KPI_NAME_LIMIT_CHARACTER = 20;


  dropSelectedKpis(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedKpis, event.previousIndex, event.currentIndex);
    localStorage.setItem("selectedKpis", JSON.stringify(this.selectedKpis))
  }
  ngOnInit(): void {
    this.getSelectedKPIsStorange();

  }

  getSelectedKPIsStorange() {
    try {
      this.selectedKpis = localStorage.getItem('selectedKpis') ? JSON.parse(localStorage.getItem('selectedKpis') || '{}') : BREAKDOWN_KPIS_GROUPING_INFO_LIST
    } catch (error) {
      console.log(error)
    }
  }


  /** Show kpi added with actual data. */
  kpiWithActualOf(
    scenario: Scenario | undefined,
    kpiName: BreakdownKpis,
    breakdownsLookup?: Record<string, Breakdown>,
  ): number | null {
    // For actual scenario, we return the actual breakdown data
    // if (scenario?.flags?.includes(ScenarioFlag.ACTUAL)) {
    //   return kpiOf(this.actual?.breakdown, kpiName);
    // }

    // const merged = mergeBreakdowns(this.actual?.breakdown, planningScenario.breakdown);
    // return kpiOf(merged, kpiName);

    // Otherwise, return the scenario breakdown
    return kpiOf(breakdownsLookup?.[scenario?.id || ''], kpiName);
  }

  generateComparision(
    baseline: number | null,
    value: number | null,
    comparisionMode?: typeof this.comparisionMode,
  ) {
    if (baseline === null || value === null) return '';
    if (!baseline) return '';
    if (baseline === value) return '';
    let diffSign = '';
    if (value > baseline) {
      diffSign = '+';
    } else if (value < baseline) {
      diffSign = '-';
    }

    if (comparisionMode === 'percentage') {
      return diffSign + (Math.abs((value - baseline) / baseline) * 100).toFixed(1) + '%';
    } else if (comparisionMode === 'value') {
      return diffSign + transformInputToKpiFormat(Math.abs(value - baseline).toFixed(1));
    }
    return;
  }

  generateComparisionResultClass(baseline: number | null, value: number | null, kpiType: string) {
    if (baseline === null || value === null) return '';
    if (!baseline) return '';
    if (kpiType === 'profit') {
      if (value > baseline) {
        return 'positive-result';
      }

      return 'negative-result';
    }

    if (value > baseline) {
      return 'negative-result';
    }

    return 'positive-result';
  }

  getWidthPercentageFromNumberScenarios(colNum: number) {
    // total width is 70% cause we expluded the width of KPI Name
    return 78 / colNum + '%';
  }

  highlightedColorTransparent(color: string | undefined): string {
    if (!color) return '';
    return color + HIGHLIGHTED_COLOR_TRANSPARENT_IN_HEX;
  }

  isKpiNameOutOfLimit(kpiName = ''): boolean {
    return kpiName.length > this.KPI_NAME_LIMIT_CHARACTER;
  }

  generateShorterKpiName(kpiName: string): string {
    if (kpiName.concat('\n')) {
      kpiName = kpiName.replace(/\n/g, ' ');
    }
    return kpiName.match(/.{1,20}/g)?.[0] + '...';
  }

  async openKpisSetting() {
    try {
      const groupings = localStorage.getItem('selectedKpis') ? JSON.parse(localStorage.getItem('selectedKpis') || '{}') : BREAKDOWN_KPIS_GROUPING_INFO_LIST;
      const dialog = this.dialogService.open(KpisSettingComponent, {
        context: {
          fields: ALL_GROUPING_FIELDS.filter(({ shortName: id1 }) => !groupings.some(({ shortName: id2 }) => id2 === id1)),
          groupings: [...groupings]
        }
      })
      dialog.onClose.subscribe((result) => {
        if (result) {
          localStorage.setItem("selectedKpis", JSON.stringify(result));
          this.selectedKpis = result;
          this.changeDetectorRef.markForCheck();
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  generatorClassScenario(numberScenarios: Number) {
    return `scenario-responsive-${numberScenarios}`
  }
  checkStatusScenario(scenarioId) {
    let scenario;
    this.selectedScenarios.subscribe(result => {
      scenario = result.filter(item => item.id == scenarioId)[0];
    })
    if (scenario.tasksSummary.status == 'inProgress') {
      return false
    } else {
      return true
    }
  }
}
