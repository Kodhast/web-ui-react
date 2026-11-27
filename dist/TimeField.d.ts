import { type ReactNode } from 'react';
export interface TimeFieldProps {
    /** The label on the field's border, e.g. "Start". */
    label: ReactNode;
    /** The time as "HH:MM". Shown as it is, also between the steps. */
    value: string;
    /** The chosen time as "HH:MM", when OK is pressed. */
    onChange: (value: string) => void;
    /** The minute wheel's step in minutes, 1–30 (standard 1). The chosen time lies on a step. */
    step?: number;
    /** Help text under the field. Replaced by `errorMessage` while there is one. */
    description?: ReactNode;
    /** Makes the field invalid and shows this text under it in the error colour. */
    errorMessage?: ReactNode;
    isDisabled?: boolean;
    /** The dialog's title (standard the label). */
    pickerTitle?: ReactNode;
    /** Where the wheels start while `value` is empty (standard "08:00"). */
    pickerStart?: string;
    /** The icon button's name and what the field offers (standard "Välj tid"). */
    pickLabel?: string;
}
/**
 * android-ui's TimeField: web-ui's `.kh-field` that shows the time ("07:00") and opens the wheels (`TimePicker`) in a
 * `kh-dialog` with Avbryt and OK. The field cannot be typed in, so no keyboard comes up on the phone: a press anywhere
 * on it, the clock or Enter, Space or arrow down opens the dialog.
 */
export declare function TimeField({ label, value, onChange, step, description, errorMessage, isDisabled, pickerTitle, pickerStart, pickLabel }: TimeFieldProps): import("react").JSX.Element;
