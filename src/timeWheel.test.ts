import { describe, expect, it } from 'vitest';
import {
	clampStep,
	flingNumbers,
	lapsFor,
	middleOf,
	minuteValues,
	nearestPosition,
	parseTime,
	snapTime,
	wheelIndexes,
	wrap
} from './timeWheel';

describe('timeWheel', () => {
	it('reads "HH:MM" and "H:MM", and nothing outside the day', () => {
		expect(parseTime('07:05')).toEqual({ hour: 7, minute: 5 });
		expect(parseTime(' 7:05 ')).toEqual({ hour: 7, minute: 5 });
		expect(parseTime('24:00')).toBeNull();
		expect(parseTime('07:60')).toBeNull();
		expect(parseTime('0705')).toBeNull();
	});

	it('keeps the step between 1 and 30 minutes', () => {
		expect(clampStep(0)).toBe(1);
		expect(clampStep(5)).toBe(5);
		expect(clampStep(45)).toBe(30);
	});

	it('lists the minute wheel for a step', () => {
		expect(minuteValues(15)).toEqual([0, 15, 30, 45]);
		expect(minuteValues(1)).toHaveLength(60);
		expect(minuteValues(7)).toEqual([0, 7, 14, 21, 28, 35, 42, 49, 56]);
	});

	it('rounds the minute to the nearest step, carrying into the next hour', () => {
		expect(wheelIndexes('07:38', 15)).toEqual({ hour: 7, minute: 3 }); // 07:45
		expect(wheelIndexes('07:37', 5)).toEqual({ hour: 7, minute: 7 }); // 07:35
		expect(wheelIndexes('23:58', 5)).toEqual({ hour: 0, minute: 0 }); // 00:00, not 23:00
		expect(wheelIndexes('09:53', 15)).toEqual({ hour: 10, minute: 0 }); // 10:00
		expect(wheelIndexes('nonsens', 1)).toEqual({ hour: 0, minute: 0 });
		expect(snapTime('07:38', 15)).toBe('07:45');
		expect(snapTime('09:37', 1)).toBe('09:37');
	});

	it('goes round', () => {
		expect(wrap(-1, 24)).toBe(23);
		expect(wrap(24, 24)).toBe(0);
		expect(lapsFor(24) % 2).toBe(1);
		expect(lapsFor(24) * 24).toBeGreaterThanOrEqual(200);
		expect(middleOf(0, 24)).toBe(Math.floor(lapsFor(24) / 2) * 24);
	});

	it('glides on after a fling, at most 30 numbers, and not after a pause or a slow drag', () => {
		const up = [
			{ y: 200, t: 0 },
			{ y: 120, t: 40 }
		];
		expect(flingNumbers(up, 45, 40)).toBe(16); // 2 px/ms × 320 ms = 640 px = 16 numbers, later ones
		expect(
			flingNumbers(
				[
					{ y: 0, t: 0 },
					{ y: 80, t: 40 }
				],
				45,
				40
			)
		).toBe(-16);
		expect(
			flingNumbers(
				[
					{ y: 0, t: 0 },
					{ y: -4000, t: 10 }
				],
				15,
				40
			)
		).toBe(30);
		expect(flingNumbers(up, 200, 40)).toBe(0); // let go after a pause
		expect(
			flingNumbers(
				[
					{ y: 0, t: 0 },
					{ y: 10, t: 40 }
				],
				45,
				40
			)
		).toBe(0); // 0.25 px/ms
		expect(flingNumbers([], 0, 40)).toBe(0);
	});

	it('finds the nearest position the short way round', () => {
		const at = middleOf(23, 24);
		expect(nearestPosition(at, 0, 24)).toBe(at + 1); // 23 → 00 is one step down
		expect(nearestPosition(at, 22, 24)).toBe(at - 1);
		expect(nearestPosition(middleOf(0, 24), 23, 24)).toBe(middleOf(0, 24) - 1);
	});
});
