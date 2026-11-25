import { type NumberFieldProps } from 'react-aria-components';
export interface StepperProps extends Pick<NumberFieldProps, 'value' | 'defaultValue' | 'onChange' | 'step' | 'formatOptions' | 'isDisabled'> {
    /** What is counted, e.g. `doser per dag`. Names the buttons: "Minska doser per dag" and "Öka doser per dag". */
    label: string;
    /** The lower limit; the minus button is disabled at it. */
    min?: number;
    /** The upper limit; the plus button is disabled at it. */
    max?: number;
    /** The label beside the stepper as well (web-ui's `kh-stepper-field`, `showLabel`). */
    showLabel?: boolean;
}
/**
 * web-ui's `<kh-stepper>` (android-ui's QuantityStepper) on React Aria's number field. The element is rendered
 * here, with web-ui's own markup, so it looks right without kh.js. The number field's input is hidden: the
 * visible value is the `<output>` web-ui uses, formatted by `formatOptions`.
 */
export declare function Stepper({ label, min, max, showLabel, ...props }: StepperProps): import("react").JSX.Element;
