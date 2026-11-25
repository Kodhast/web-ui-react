import { type ReactNode } from 'react';
export interface SegmentedOption {
    value: string;
    label: ReactNode;
    isDisabled?: boolean;
}
export interface SegmentedChoiceProps {
    options: SegmentedOption[];
    value?: string;
    /** The chosen value when uncontrolled. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    isDisabled?: boolean;
    /** The group's name; there is no visible label in web-ui's segmented choice. */
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
/**
 * web-ui's `.kh-segmented` (android-ui's AppSegmentedChoice): one choice at a time, always one chosen.
 * React Aria's toggle button group gives `role="radiogroup"` and `role="radio"` with `aria-checked`, which is
 * what web-ui's CSS reads. The arrow keys move the choice with the focus, as in a native radio group.
 */
export declare function SegmentedChoice({ options, value, defaultValue, onChange, isDisabled, ...labels }: SegmentedChoiceProps): import("react").JSX.Element;
