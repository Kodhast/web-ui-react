import type { ReactNode } from 'react';
export interface ChipOption {
    value: string;
    label: ReactNode;
    /** An `<svg>` before the label; the check replaces it while the chip is chosen. */
    icon?: ReactNode;
    /** A count after the label (`kh-chip__value`). */
    count?: ReactNode;
    /** The active one among several chosen: filled in the primary colour (`kh-chip--emphasized`). */
    emphasized?: boolean;
    /** Not available yet (`kh-chip--pending`): dimmed with a dashed edge. The text says when, e.g. `från 15:40`. */
    pending?: ReactNode;
    isDisabled?: boolean;
}
export interface FilterChipsProps {
    options: ChipOption[];
    selected?: string[];
    defaultSelected?: string[];
    onChange?: (selected: string[]) => void;
    isDisabled?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
/** web-ui's `.kh-chips` with `.kh-chip` (android-ui's ChipRow of AppFilterChip): several can be chosen. */
export declare function FilterChips({ options, selected, defaultSelected, onChange, isDisabled, ...labels }: FilterChipsProps): import("react").JSX.Element;
