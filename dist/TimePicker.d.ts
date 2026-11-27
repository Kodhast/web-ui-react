export interface TimePickerProps {
    /** The time as "HH:MM", 24 hours. A minute between the steps is shown on the nearest step. */
    value: string;
    /** A new time as "HH:MM", when a wheel has stopped on a new number or an arrow key moved it. */
    onChange: (value: string) => void;
    /** The minute wheel's step in minutes, 1–30 (standard 1). */
    step?: number;
    /** The hour wheel's name (standard "Timme"). */
    hourLabel?: string;
    /** The minute wheel's name (standard "Minut"). */
    minuteLabel?: string;
}
/**
 * web-ui's `<kh-time-picker>` (android-ui's TimePickerPopup wheels): hour and minute as two wheels that go round. The
 * wheels are drawn here with web-ui's classes and follow `value`, which the app owns (ADR 0001): a wheel that stops
 * reports the number in the middle, and stands on the app's value again if the app keeps the old one. Put it in a
 * `ConfirmDialog`, or use `TimeField`, which opens it in its own dialog.
 */
export declare function TimePicker({ value, onChange, step, hourLabel, minuteLabel }: TimePickerProps): import("react").JSX.Element;
