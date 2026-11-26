import type { ReactNode } from 'react';
export interface PeriodPickerProps {
    /** The period shown, e.g. "Tisdag 24 november" or "Vecka 47 · 16–22 nov"; cut short on one line. */
    label: ReactNode;
    /** One period back. */
    onPrevious?: () => void;
    /** One period forward. */
    onNext?: () => void;
    /** The back arrow's name; "Föregående" by default (e.g. "Föregående vecka"). */
    previousLabel?: string;
    /** The forward arrow's name; "Nästa" by default. */
    nextLabel?: string;
    isPreviousDisabled?: boolean;
    isNextDisabled?: boolean;
    /** The label is a button; what it opens (e.g. a date picker) is the app's. */
    onLabelPress?: () => void;
    /** The group's name. */
    'aria-label'?: string;
}
/**
 * web-ui's `kh-period` (only on the web, no android-ui part): arrows and a label with a calendar icon that step
 * a day or a week at a time. The app owns the date and the text; the picker has no state of its own.
 */
export declare function PeriodPicker({ label, onPrevious, onNext, previousLabel, nextLabel, isPreviousDisabled, isNextDisabled, onLabelPress, 'aria-label': ariaLabel }: PeriodPickerProps): import("react").JSX.Element;
