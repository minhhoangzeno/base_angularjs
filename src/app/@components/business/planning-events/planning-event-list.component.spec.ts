import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PlanningEventListComponent } from './planning-event-list.component';
import { ThemeModule } from '../../../@theme/theme.module';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '../../components.module';
import { EventType } from '../../../@core/interfaces/business/event';
import { NbMenuModule } from '@nebular/theme';
import { CommentService } from '../../../@core/entity/comment.service';
import { PLANNING_EXPLORER_PAGE } from '../planning-segment/widget-management.component';

describe('EventListTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningEventListComponent],
      imports: [
        ThemeModule.forRoot(),
        NbMenuModule.forRoot(),
        ComponentsModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      // This line prevents loading of services in the child component planning-comments.
      // TODO: Clean me. This should not be an issue.
      providers: [{ provide: CommentService, useClass: class _ {} }],
    });
  });

  it('is empty if there are no event', async () => {
    const fixture = TestBed.createComponent(PlanningEventListComponent);
    fixture.detectChanges();

    await expect(fixture.debugElement.queryAll(By.css('event-name')).length).toBe(0);
  });

  it('is empty if there are no event version', async () => {
    const fixture = TestBed.createComponent(PlanningEventListComponent);
    fixture.detectChanges();

    await expect(fixture.debugElement.queryAll(By.css('event-version-name')).length).toBe(0);
  });

  it('create event-name css class', async () => {
    const fixture = TestBed.createComponent(PlanningEventListComponent);

    const component = fixture.componentInstance;

    component.events = TEST_EVENTS;
    component.scenarios = TEST_SCENARIOS;

    component.editMode = false;
    component.searchEvent = '';
    component.highlighted = TEST_SCENARIOS[0];
    component.eventEditMode = false;
    component.routerURL = PLANNING_EXPLORER_PAGE;

    component.ngOnChanges({
      highlighted: new SimpleChange(null, component.scenarios[1], true),
    });

    fixture.detectChanges();
    await expect(fixture.debugElement.queryAll(By.css('.event-name')).length).toBe(3);
  });

  it('create event-version-name css class', async () => {
    const fixture = TestBed.createComponent(PlanningEventListComponent);

    const component = fixture.componentInstance;

    component.events = TEST_EVENTS;
    component.scenarios = TEST_SCENARIOS;

    component.editMode = false;
    component.searchEvent = '';
    component.highlighted = TEST_SCENARIOS[0];
    component.eventEditMode = false;
    component.routerURL = PLANNING_EXPLORER_PAGE;

    component.ngOnChanges({
      highlighted: new SimpleChange(null, component.scenarios[1], true),
    });

    fixture.detectChanges();
    await expect(fixture.debugElement.queryAll(By.css('.event-version-name')).length).toBe(6);
  });
});

const TEST_EVENTS = [
  {
    id: 'event_0001',
    name: 'Promotion Campaign A',
    planRef: 'AAA',
    type: EventType.PROMOTION_CAMPAIGN,
    versions: [
      {
        id: 'event_version_0001_1001',
        name: 'Version 1 - Campaign A',
        eventId: 'event_0001',
        startDate: '2020-01-01',
        endDate: '2020-03-30',
        segmentImpacts: [],
      },
      {
        id: 'event_version_0001_1002',
        name: 'Version 2 - Campaign A',
        eventId: 'event_0001',
        startDate: '2020-01-01',
        endDate: '2020-03-30',
        segmentImpacts: [],
      },
    ],
  },
  {
    id: 'event_0002',
    name: 'Promotion Campaign B',
    planRef: 'AAA',
    type: EventType.PROMOTION_CAMPAIGN,
    versions: [
      {
        id: 'event_version_0002_2001',
        name: 'Version 1 - Campaign B',
        eventId: 'event_0002',
        startDate: '2020-04-01',
        endDate: '2020-05-30',
        segmentImpacts: [],
      },
    ],
  },
  {
    id: 'event_0003',
    name: 'Distributor Sales Support',
    planRef: 'AAA',
    type: EventType.GENERAL_PRICING,
    versions: [
      {
        id: 'event_version_0003_3001',
        name: 'Version 1 - Distributor Sales Support',
        eventId: 'event_0003',
        startDate: '2020-06-01',
        endDate: '2020-07-30',
        segmentImpacts: [],
      },
      {
        id: 'event_version_0003_3002',
        name: 'Version 2 - Distributor Sales Support (updated)',
        eventId: 'event_0003',
        startDate: '2020-06-01',
        endDate: '2020-07-30',
        segmentImpacts: [],
      },
      {
        id: 'event_version_0003_3003',
        name: 'Version 3 - Distributor Sales Support (final)',
        eventId: 'event_0003',
        startDate: '2020-06-01',
        endDate: '2020-07-30',
        segmentImpacts: [],
      },
    ],
  },
];

const TEST_SCENARIOS = [
  {
    id: 'abcdefg',
    name: 'testingscenario#1',
    planRef: 'june plan',
    color: 'red',
    events: [
      {
        id: 'event_version_0003_3001',
        name: 'Version 1 - Distributor Sales Support',
        eventId: 'event_0003',
        startDate: '2020-06-01',
        endDate: '2020-07-30',
        segmentImpacts: [],
      },
      {
        id: 'event_version_0002_2001',
        name: 'Version 1 - Campaign B',
        eventId: 'event_0002',
        startDate: '2020-04-01',
        endDate: '2020-05-30',
        segmentImpacts: [],
      },
    ],
  },
  {
    id: 'hyjklmn',
    name: 'testingscenario#2',
    planRef: 'june plan',
    color: 'blue',
    events: [
      {
        id: 'event_version_0003_3002',
        name: 'Version 2 - Distributor Sales Support (updated)',
        eventId: 'event_0003',
        startDate: '2020-06-01',
        endDate: '2020-07-30',
        segmentImpacts: [],
      },
      {
        id: 'event_version_0001_1002',
        name: 'Version 2 - Campaign A',
        eventId: 'event_0001',
        startDate: '2020-01-01',
        endDate: '2020-03-30',
        segmentImpacts: [],
      },
    ],
  },
];
