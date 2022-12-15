import { DateAggregationOption } from './timeseries.constants';
import { roundTimestampToDateAggregation } from './timeseries.utils';

describe('roundTimestampToDateAggregation', () => {
  it('can do a baseline test', async () => {
    const x = new Date(BASE_DATE.getTime());
    x.setHours(0, 0, 0);
    await expect(x.getTime()).toBe(BASE_TIMESTAMP);
  });

  it('can round to day', async () => {
    await expect(roundTimestampToDateAggregation(TEST_MICROS_1, DateAggregationOption.DAY)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_2, DateAggregationOption.DAY)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_3, DateAggregationOption.DAY)).toBe(
      BASE_TIMESTAMP + DAY_MILLIS * 4,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_4, DateAggregationOption.DAY)).toBe(
      BASE_TIMESTAMP + DAY_MILLIS * 41,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_5, DateAggregationOption.DAY)).toBe(
      BASE_TIMESTAMP + DAY_MILLIS * 416,
    );
  });

  it('can round to week', async () => {
    await expect(roundTimestampToDateAggregation(TEST_MICROS_1, DateAggregationOption.WEEK)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_2, DateAggregationOption.WEEK)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_3, DateAggregationOption.WEEK)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_4, DateAggregationOption.WEEK)).toBe(
      BASE_TIMESTAMP + DAY_MILLIS * 7 * 5,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_5, DateAggregationOption.WEEK)).toBe(
      BASE_TIMESTAMP + DAY_MILLIS * 7 * 59,
    );
  });

  it('can round to month', async () => {
    await expect(roundTimestampToDateAggregation(TEST_MICROS_1, DateAggregationOption.MONTH)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_2, DateAggregationOption.MONTH)).toBe(
      BASE_TIMESTAMP,
    );
    await expect(roundTimestampToDateAggregation(TEST_MICROS_3, DateAggregationOption.MONTH)).toBe(
      BASE_TIMESTAMP,
    );

    let date: Date;

    date = new Date(BASE_TIMESTAMP);
    date.setMonth(date.getMonth() + 1);
    await expect(roundTimestampToDateAggregation(TEST_MICROS_4, DateAggregationOption.MONTH)).toBe(
      date.getTime(),
    );

    date = new Date(BASE_TIMESTAMP);
    date.setMonth(date.getMonth() + 13);
    await expect(roundTimestampToDateAggregation(TEST_MICROS_5, DateAggregationOption.MONTH)).toBe(
      date.getTime(),
    );
  });
});

const BASE_DATE = new Date('2020-11-01');
BASE_DATE.setHours(0, 0, 0); // Needed since BASE_DATE starts with hour set to X (based on tz)

const BASE_TIMESTAMP = BASE_DATE.getTime();
const HOUR_MILLIS = 3600000;
const DAY_MILLIS = HOUR_MILLIS * 24;

const TEST_MICROS_1 = BASE_TIMESTAMP + HOUR_MILLIS * 1;
const TEST_MICROS_2 = BASE_TIMESTAMP + HOUR_MILLIS * 10;
const TEST_MICROS_3 = BASE_TIMESTAMP + HOUR_MILLIS * 100;
const TEST_MICROS_4 = BASE_TIMESTAMP + HOUR_MILLIS * 1000;
const TEST_MICROS_5 = BASE_TIMESTAMP + HOUR_MILLIS * 10000;
