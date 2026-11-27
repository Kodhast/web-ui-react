/** "07:05" from hour and minute. */
export declare const formatTime: (hour: number, minute: number) => string;
/** Hour and minute from "HH:MM" (or "H:MM"); null for anything else or a time outside the day. */
export declare function parseTime(text: string): {
    hour: number;
    minute: number;
} | null;
/** The minute wheel's step: a whole number of minutes from 1 to 30. */
export declare const clampStep: (step: number) => number;
/** The numbers on the minute wheel for a step: 0, step, 2·step … under 60. */
export declare const minuteValues: (step: number) => number[];
/**
 * Which number each wheel stands on for a time: the hour, and the minute rounded to the nearest step (as kh.js).
 * 23:58 with the step 5 is 00:00, not 23:00.
 */
export declare function wheelIndexes(text: string, step: number): {
    hour: number;
    minute: number;
};
/** An index on a wheel of `count` numbers that goes round. */
export declare const wrap: (index: number, count: number) => number;
/**
 * Laps of numbers on a wheel: at least 200 numbers, so that a flick with the finger does not reach the end, and an odd
 * number, so that there is a middle lap the wheel jumps back to when it has stopped (as kh.js).
 */
export declare const lapsFor: (count: number) => number;
/** The position (row) of `index` in the middle lap. */
export declare const middleOf: (index: number, count: number) => number;
/** The position nearest `from` that shows `index`, going the short way round. */
export declare function nearestPosition(from: number, index: number, count: number): number;
/** The time the wheels show for `text`: its minute rounded to the nearest step. */
export declare function snapTime(text: string, step: number): string;
/** How far (px) the mouse moves before a press becomes a drag (as kh.js). */
export declare const DRAG_SLOP = 4;
/** A fling: the mouse moved faster than FLING_SPEED px/ms in the last FLING_WINDOW ms before it let go. */
export declare const FLING_WINDOW = 100;
export interface PointerSample {
    y: number;
    t: number;
}
/**
 * The numbers a wheel glides on after the mouse let go at `releasedAt`, from the last samples of the drag: positive
 * when the mouse moved up (later numbers), 0 when it was not moving.
 */
export declare function flingNumbers(samples: readonly PointerSample[], releasedAt: number, pitch: number): number;
