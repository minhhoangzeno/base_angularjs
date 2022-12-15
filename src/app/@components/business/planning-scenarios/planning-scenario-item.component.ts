import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NbPopoverDirective, NbIconLibraries, NbDialogService } from '@nebular/theme';

import {
  Scenario,
  ScenarioFlag,
  ScenarioWithTaskStatus,
} from '@/app/@core/interfaces/business/scenario';
import { DownloadScenarioComponent } from './download-scenario.component';
import { environment } from '@/environments/environment';

const HIGHLIGHTED_COLOR_TRANSPARENT_IN_HEX = '1A';
@Component({
  selector: 'cel-planning-scenario-item',
  styleUrls: ['./planning-scenario-item.component.scss'],
  templateUrl: './planning-scenario-item.component.html',
})
export class PlanningScenarioItemComponent {
  constructor(
    private readonly iconsLibrary: NbIconLibraries,
    private readonly dialogService: NbDialogService,
  ) {
    this.iconsLibrary.registerSvgPack('simcel-scenario-icons', {
      'non-primary':
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#C8C8C8"/></svg>',
      edit:
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M10.5 4.15172V10.5C10.5 11.3284 9.82837 12 9 12H1.5C0.671625 12 0 11.3284 0 10.5V3C0 2.17162 ' +
        '0.671625 1.5 1.5 1.5H7.84791L6.34863 3H1.5V10.5H9V5.65209L10.5 4.15172ZM9.34863 1.06055L8.81836 1.59082L10.4092 ' +
        '3.18202L10.9395 2.65174L9.34863 1.06055ZM10.4092 0L9.87891 0.530273L11.4697 2.12147L12 1.59082L10.4092 0ZM3.51562 ' +
        '6.89503L5.10645 8.48585L9.87891 3.71264L8.28809 2.12145L3.51562 6.89503ZM3 9H4.5L3 7.5V9Z" fill="#0C80EB"/></svg>',
      remove:
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M5.99893 0C2.68579 0 0 2.68664 0 6.00021C0 9.31336 2.68579 12 5.99893 12C9.31378 12 12 9.31293 12 ' +
        '6.00021C12 2.68664 9.31378 0 5.99893 0ZM8.57872 7.62482L7.6231 8.57915C7.6231 8.57915 6.11135 6.95712 5.9985 ' +
        '6.95712C5.88736 6.95712 4.37518 8.57915 4.37518 8.57915L3.41913 7.62482C3.41913 7.62482 5.04287 6.13495 5.04287 ' +
        '6.00236C5.04287 5.86762 3.41913 4.37733 3.41913 4.37733L4.37518 3.42085C4.37518 3.42085 5.8998 5.04373 5.9985 ' +
        '5.04373C6.09805 5.04373 7.6231 3.42085 7.6231 3.42085L8.57872 4.37733C8.57872 4.37733 6.95455 5.88908 6.95455 ' +
        '6.00236C6.95455 6.11007 8.57872 7.62482 8.57872 7.62482Z" fill="#D24A43"/></svg>',
      primary:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="15" height="15" rx="1.5" fill="white"/>' +
        '<path d="M13.4605 5.19154L7.00964 11.6484L3.64844 8.2812L4.19154 7.73809L7.00964 10.5502L12.9174 4.64844L13.4605 ' +
        '5.19154Z" fill="#C8C8C8"/><rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#C8C8C8"/></svg>',
    });
  }

  @ViewChild(NbPopoverDirective) popover?: NbPopoverDirective;

  /** Scenario to display. */
  @Input() scenario?: ScenarioWithTaskStatus;
  @Input() scenarios?: ScenarioWithTaskStatus[] = [];

  /** Set to true if current scenario is the primary scenario. */
  @Input() isPrimary = false;
  @Input() isHighlighted = false;
  /** Disable any edit buttons if readonly is true. */
  @Input() readonly = false;

  /** Fires if the user want the scenario to be a primary scenario. */
  @Output() setPrimary = new EventEmitter<Scenario>();
  /** Fires if the user want the scenario to be the highlighted scenario. */
  @Output() setHighlighted = new EventEmitter<Scenario>();
  /** Fires if user clicks on the scenario edit button. */
  @Output() edit = new EventEmitter<Scenario>();
  @Output() delete = new EventEmitter<Scenario>();
  /** Fires if user clicks on the scenario remove button. */
  @Output() hide = new EventEmitter<Scenario>();
  @Output() clone = new EventEmitter<Scenario>();

  readonly SCENARIO_NAME_LIMIT_CHARACTER = 20;

  onSetPrimary() {
    this.setPrimary.emit(this.scenario);
  }

  onHighlighScenario() {
    this.setHighlighted.emit(this.scenario);
  }

  onEdit() {
    this.edit.emit(this.scenario);

    // TODO: Commented for now since I'm not sure if something would break :D
    // Let's avoid injecting states on reusable components -- it's dangerous and harder to test.
    // this.state.editedScenarioObs.next(this.scenario);

    this.popover?.hide();
  }

  onHide() {
    this.hide.emit(this.scenario);
    this.popover?.hide();
  }

  onDelete() {
    this.delete.emit(this.scenario);
    this.popover?.hide();
  }

  onDownload() {
    this.dialogService.open(DownloadScenarioComponent, {
      context: {
        scenario: this.scenario,
      },
    });
  }

  onClone() {
    this.clone.emit(this.scenario);
    this.popover?.hide();
  }

  onOpenUI() {
    // Open SIMCEL-UI
    window.open(environment.simulateUiUrl, '_blank');
  }

  highlightedColorTransparent(color?: string): string {
    if (!color) return '';
    return color + HIGHLIGHTED_COLOR_TRANSPARENT_IN_HEX;
  }

  isScenarioNameOutOfLimit(scenarioName?: string): boolean {
    if (!scenarioName) return false;
    return scenarioName.length > this.SCENARIO_NAME_LIMIT_CHARACTER;
  }

  generateShorterScenarioName(scenarioName?: string): string {
    if (!scenarioName) return '';
    return scenarioName.match(/.{1,20}/g)?.[0] + '...';
  }

  // For now, only Forecast Base scenario is not deletable
  isScenarioDeletable(scenario?: Scenario): boolean {
    return !scenario?.flags?.includes(ScenarioFlag.FORECAST_BASE);
  }

  // For now, only Forecast Base scenario is not editable
  isScenarioEditable(scenario?: Scenario): boolean {
    return !scenario?.flags?.includes(ScenarioFlag.FORECAST_BASE);
  }

  // For now, only Forecast Base scenario is not hideable
  isScenarioHideable(scenario?: Scenario): boolean {
    return !scenario?.flags?.includes(ScenarioFlag.FORECAST_BASE);
  }

}
