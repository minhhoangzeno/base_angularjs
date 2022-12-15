import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';

import { Plan } from '../../../@core/interfaces/business/plan';
import { PlanManagementComponent } from '../../../pages/plan-management/plan-management.component';
import {
  PLANNING_EXPLORER_PAGE,
  DEMAND_PLANNING_PAGE,
  SUPPLY_EXPLORER_PAGE,
  EVENT_MANAGEMENT_PAGE,
  BUSINESS_EXPLORER_PAGE,
} from '../planning-segment/widget-management.component';
import { refId } from '@/app/@core/interfaces/common/mongo';

const PAGE_TILES = {
  [BUSINESS_EXPLORER_PAGE]: 'Business Explorer',
  [PLANNING_EXPLORER_PAGE]: 'Planning Explorer',
  [DEMAND_PLANNING_PAGE]: 'Demand Planning',
  [SUPPLY_EXPLORER_PAGE]: 'Supply Explorer',
  [EVENT_MANAGEMENT_PAGE]: 'Event Management',
};

@Component({
  selector: 'cel-planning-import',
  templateUrl: './planning-import.component.html',
  styleUrls: ['./planning-import.component.scss'],
})
export class PlanningImportComponent {
  /** Selected plan di in the dropdown. */
  @Input() selected?: Plan;
  /** List of plan options in the dropdown. */
  @Input() plans: readonly Plan[] = [];

  /** Emits whenever the user selects a plan. */
  @Output() selectedChange = new EventEmitter<Plan>();

  constructor(private readonly dialogService: NbDialogService, private readonly router: Router) {}

  openNewPlanWindow() {
    this.dialogService.open(PlanManagementComponent, {
      hasBackdrop: true,
      closeOnEsc: true,
      closeOnBackdropClick: false,
    });
  }

  selectedPlan(plan: Plan) {
    this.selectedChange.emit(plan);
  }

  // Edit: moved this logic to store
  /** Sorts the list of plan from latest plan start date to earliest, with "Actual" at the end. */
  // get sortedPlans() {
  //   return sortPlansByStartDate([...this.plans]);
  // }

  getPageTitle(): string {
    const title = PAGE_TILES[this.router.url as keyof typeof PAGE_TILES];
    return title || '';
  }

  comparePlanWith(v1: Plan, v2: Plan): boolean {
    return refId(v1) === refId(v2);
  }
}
