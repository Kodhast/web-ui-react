import type { ReactNode, Ref } from 'react';
import { type TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
export interface TextFieldProps extends Omit<AriaTextFieldProps, 'className' | 'style' | 'children' | 'render' | 'isInvalid' | 'validate' | 'validationBehavior'> {
    /** The label: inside the field while it is empty, on the border when it has text or focus. */
    label: ReactNode;
    /** A unit after the text (`kh-field__suffix`), e.g. `mg`. */
    suffix?: ReactNode;
    /** Help text under the field (`kh-field__support`). Replaced by `errorMessage` while there is one. */
    description?: ReactNode;
    /** Makes the field invalid (`aria-invalid`) and shows this text under it in the error colour. */
    errorMessage?: ReactNode;
    /** A `<textarea>` that grows with its text instead of an `<input>`. */
    multiline?: boolean;
    /** An icon button last in the field, for an icon that does something (web-ui's `kh-icon-btn`). */
    action?: {
        icon: ReactNode;
        label: string;
        onPress: () => void;
    };
    ref?: Ref<HTMLDivElement>;
}
/** web-ui's `.kh-field` (android-ui's AppTextField) with React Aria's text field behaviour. */
export declare function TextField({ label, suffix, description, errorMessage, multiline, action, ...props }: TextFieldProps): import("react").JSX.Element;
