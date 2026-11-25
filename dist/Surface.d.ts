import type { ReactNode } from 'react';
/**
 * What a card, row, pill or notice does when pressed: a link (`href`), a button (`onPress`) or nothing.
 * web-ui styles `a.kh-*` and `button.kh-*` as clickable, so the element itself carries that.
 */
export interface PressableProps {
    /** Makes it a link. Wins over `onPress`. */
    href?: string;
    /** Makes it a button. */
    onPress?: () => void;
    /** The name when the content alone does not give one (an icon only). */
    'aria-label'?: string;
}
/** Renders `className` and `children` as a link, a button or the static element `as`. */
export declare function Surface({ href, onPress, className, as: Static, children, 'aria-label': ariaLabel }: PressableProps & {
    className: string;
    as?: 'div' | 'span';
    children: ReactNode;
}): import("react").JSX.Element;
