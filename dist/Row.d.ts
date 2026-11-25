import type { ReactNode } from 'react';
import { type PressableProps } from './Surface.js';
export interface RowProps extends PressableProps {
    title: ReactNode;
    subtitle?: ReactNode;
    /** Before the text: an icon or an avatar. */
    leading?: ReactNode;
    /** After the text: a value, a pill or buttons. */
    trailing?: ReactNode;
    /** The chevron at the end, for a row that opens something (`ItemRow(navigates)`). */
    navigates?: boolean;
    /** On the row tint (`kh-row--tinted`). */
    tinted?: boolean;
    /** Done: struck through and dimmed (`kh-row--done`). */
    done?: boolean;
    /** Paused or not counted: dimmed (`kh-row--inactive`). */
    inactive?: boolean;
    /**
     * The stripe at the start (`kh-row--accent`): the app's class that sets `--kh-accent`, e.g.
     * `.accent-fel { --kh-accent: var(--kh-error); }`. web-ui sets it with `style`; web-ui-react sets no style.
     */
    accentClass?: string;
}
/** web-ui's `.kh-row` (android-ui's ItemRow): static, a link (`href`) or a button (`onPress`). */
export declare function Row({ title, subtitle, leading, trailing, navigates, tinted, done, inactive, accentClass, ...press }: RowProps): import("react").JSX.Element;
/** web-ui's `.kh-chevron`: the arrow at the end of a row or notice that opens something. */
export declare function Chevron(): import("react").JSX.Element;
