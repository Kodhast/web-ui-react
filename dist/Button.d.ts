import type { ReactNode, Ref } from 'react';
import { type ButtonProps as AriaButtonProps } from 'react-aria-components';
/** web-ui's button variants (AppButton). `tonal` is the default; `primary` is the view's one main action. */
export type ButtonVariant = 'tonal' | 'primary' | 'outlined' | 'text' | 'destructive' | 'destructiveText';
export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children' | 'isPending' | 'render'> {
    variant?: ButtonVariant;
    /** The lower button for a header row (`kh-btn--compact`); the touch target stays 48. */
    compact?: boolean;
    /** Full width (`kh-btn--block`). */
    block?: boolean;
    /**
     * Working: the dots replace the icon, presses are ignored, and colours and focus stay (`aria-busy`).
     * `isDisabled` wins: a disabled button is never shown as working.
     */
    isPending?: boolean;
    /** An `<svg>` before the label, as in web-ui; the dots take its place while pending. */
    icon?: ReactNode;
    /** The label. */
    children: ReactNode;
    ref?: Ref<HTMLButtonElement>;
}
/** The class list for a button; exported for tests and for links that must look like buttons. */
export declare function buttonClass({ variant, compact, block }?: Pick<ButtonProps, 'variant' | 'compact' | 'block'>): string;
/** web-ui's `.kh-btn` (android-ui's AppButton) with React Aria's press, focus and keyboard handling. */
export declare function Button({ variant, compact, block, isPending: pending, icon, children, ...props }: ButtonProps): import("react").JSX.Element;
