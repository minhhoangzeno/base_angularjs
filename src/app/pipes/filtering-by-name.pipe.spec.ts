import { FilteringByNamePipe } from './filtering-by-name.pipe';
import { Event, EventType } from '../@core/interfaces/business/event';

describe('FilteringByNamePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FilteringByNamePipe();

  it('check if events return 3 when search for ""', async () => {
    await expect(pipe.transform(TEST_EVENTS, '').length).toBe(3);
  });

  it('check if events return 2 when search for "Pro"', async () => {
    await expect(pipe.transform(TEST_EVENTS, 'Pro').length).toBe(2);
  });

  it('check if events return 1 when search for "Promotion Campaign A"', async () => {
    await expect(pipe.transform(TEST_EVENTS, 'Promotion Campaign A').length).toBe(1);
  });

  // ... more tests ...
});

const TEST_EVENTS: Event[] = [
  {
    id: 'event_0001',
    name: 'Promotion Campaign A',
    type: EventType.PROMOTION_CAMPAIGN,
    versions: [
      {
        id: 'event_version_0001_1001',
        name: 'Version 1 - Campaign A',
        eventId: 'event_0001',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
      {
        id: 'event_version_0001_1002',
        name: 'Version 2 - Campaign A',
        eventId: 'event_0001',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
    ],
  },
  {
    id: 'event_0002',
    name: 'Promotion Campaign B',
    type: EventType.PROMOTION_CAMPAIGN,
    versions: [
      {
        id: 'event_version_0002_2001',
        name: 'Version 1 - Campaign B',
        eventId: 'event_0002',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
    ],
  },
  {
    id: 'event_0003',
    name: 'Distributor Sales Support',
    type: EventType.GENERAL_PRICING,
    versions: [
      {
        id: 'event_version_0003_3001',
        name: 'Version 1 - Distributor Sales Support',
        eventId: 'event_0003',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
      {
        id: 'event_version_0003_3002',
        name: 'Version 2 - Distributor Sales Support (updated)',
        eventId: 'event_0003',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
      {
        id: 'event_version_0003_3003',
        name: 'Version 3 - Distributor Sales Support (final)',
        eventId: 'event_0003',
        segmentImpacts: [],
        startDate: '2020-01-01',
        endDate: '2020-03-30',
      },
    ],
  },
];
