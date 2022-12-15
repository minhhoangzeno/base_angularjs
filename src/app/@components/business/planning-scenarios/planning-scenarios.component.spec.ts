import { TestBed } from '@angular/core/testing';
import { PlanningScenariosComponent } from './planning-scenarios.component';
import { ComponentsModule } from '../../components.module';
import { PlanningScenarioItemComponent } from './planning-scenario-item.component';
import { ThemeModule } from '../../../@theme/theme.module';
import { By } from '@angular/platform-browser';

describe('ScenariosComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningScenariosComponent, PlanningScenarioItemComponent],
      imports: [ComponentsModule, ThemeModule.forRoot()],
    });
  });

  it('is empty if there are no scenarios', async () => {
    const fixture = TestBed.createComponent(PlanningScenariosComponent);
    fixture.detectChanges();

    await expect(fixture.debugElement.queryAll(By.css('planning-scenario-item')).length).toBe(0);
  });

  it('displays a few scenario-item components if there are scenarios', async () => {
    const fixture = TestBed.createComponent(PlanningScenariosComponent);
    const component = fixture.componentInstance;
    component.scenarios = TEST_SCENARIOS;

    fixture.detectChanges();

    await expect(fixture.debugElement.queryAll(By.css('planning-scenario-item')).length).toBe(2);
  });

  it('bubbles child events to parent component', () => {
    const fixture = TestBed.createComponent(PlanningScenariosComponent);
    const component = fixture.componentInstance;
    spyOn(component.hide, 'emit');
    spyOn(component.edit, 'emit');

    component.scenarios = TEST_SCENARIOS;

    fixture.detectChanges();

    // Get ScenarioItemComponent nodes.
    const items = fixture.debugElement.queryAll(By.directive(PlanningScenarioItemComponent));

    // Child emits remove event.
    const firstChild = items[0].componentInstance as PlanningScenarioItemComponent;
    firstChild.hide.emit(firstChild.scenario);

    fixture.detectChanges();

    // Component emits remove event too.
    expect(component.hide.emit).toHaveBeenCalledWith(firstChild.scenario);

    // Child emits edit event.
    const secondChild = items[1].componentInstance as PlanningScenarioItemComponent;
    secondChild.edit.emit(secondChild.scenario);

    fixture.detectChanges();

    // Component emits editevent too.
    expect(component.edit.emit).toHaveBeenCalledWith(secondChild.scenario);
  });

  it('passes primary to whichever child component is primary', async () => {
    const fixture = TestBed.createComponent(PlanningScenariosComponent);
    const component = fixture.componentInstance;
    component.scenarios = TEST_SCENARIOS;
    component.primary = TEST_SCENARIOS[1];

    fixture.detectChanges();

    // Get ScenarioItemComponent nodes.
    const children = fixture.debugElement
      .queryAll(By.directive(PlanningScenarioItemComponent))
      .map((el) => el.componentInstance as PlanningScenarioItemComponent);

    // Do the check to children isPrimary.
    await expect(children[0].isPrimary).toBe(false);
    await expect(children[1].isPrimary).toBe(true);
  });
});

const TEST_SCENARIOS = [
  {
    id: 'abcdefg',
    name: 'testingscenario#1',
    planRef: 'june plan',
    color: 'red',
  },
  {
    id: 'hyjklmn',
    name: 'testingscenario#2',
    planRef: 'june plan',
    color: 'blue',
  },
];
