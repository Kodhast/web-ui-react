/** "07:05" from hour and minute. */
export const formatTime = (hour, minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
/** Hour and minute from "HH:MM" (or "H:MM"); null for anything else or a time outside the day. */
export function parseTime(text) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
    if (!match)
        return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    return hour < 24 && minute < 60 ? { hour, minute } : null;
}
/** The minute wheel's step: a whole number of minutes from 1 to 30. */
export const clampStep = (step) => Math.min(30, Math.max(1, Math.round(step) || 1));
/** The numbers on the minute wheel for a step: 0, step, 2·step … under 60. */
export const minuteValues = (step) => Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
/**
 * Which number each wheel stands on for a time: the hour, and the minute rounded to the nearest step (as kh.js).
 * 23:58 with the step 5 is 00:00, not 23:00.
 */
export function wheelIndexes(text, step) {
    const time = parseTime(text) ?? { hour: 0, minute: 0 };
    const count = minuteValues(step).length;
    const steps = Math.round(time.minute / step);
    if (steps >= count)
        return { hour: (time.hour + 1) % 24, minute: 0 };
    return { hour: time.hour, minute: steps };
}
/** An index on a wheel of `count` numbers that goes round. */
export const wrap = (index, count) => ((index % count) + count) % count;
/**
 * Laps of numbers on a wheel: at least 200 numbers, so that a flick with the finger does not reach the end, and an odd
 * number, so that there is a middle lap the wheel jumps back to when it has stopped (as kh.js).
 */
export const lapsFor = (count) => Math.max(5, 2 * Math.ceil(100 / count) + 1);
/** The position (row) of `index` in the middle lap. */
export const middleOf = (index, count) => Math.floor(lapsFor(count) / 2) * count + index;
/** The position nearest `from` that shows `index`, going the short way round. */
export function nearestPosition(from, index, count) {
    const delta = wrap(index - wrap(from, count), count);
    return from + (delta > count / 2 ? delta - count : delta);
}
/** The time the wheels show for `text`: its minute rounded to the nearest step. */
export function snapTime(text, step) {
    const at = wheelIndexes(text, step);
    return formatTime(at.hour, minuteValues(step)[at.minute] ?? 0);
}
