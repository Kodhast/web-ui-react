import type { ReactNode } from 'react';
export interface PillProps {
    /** The app's tone class (e.g. `ton-gron`). */
    tone?: string;
    /** The square pill (`kh-pill--square`). */
    square?: boolean;
    /** Makes it a button (48 in touch target, as web-ui's `button.kh-pill`). */
    onPress?: () => void;
    /** The text, with an `<svg>` before or after it if wanted. */
    children: ReactNode;
}
/** web-ui's `.kh-pill` (android-ui's InfoPill). */
export declare function Pill({ tone, square, onPress, children }: PillProps): import("react").JSX.Element;
/** web-ui's `.kh-pills`: pills in a wrapping row. */
export declare function Pills({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
