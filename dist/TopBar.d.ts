import type { ReactNode } from 'react';
export interface TopBarProps {
    /** The heading (`<h1>`). */
    title: ReactNode;
    /** The back arrow as a button. */
    onBack?: () => void;
    /** The back arrow as a link. Wins over `onBack`. */
    backHref?: string;
    /** The back arrow's name; "Tillbaka" by default. */
    backLabel?: string;
    /** The back arrow plain instead of tonal (android-ui's `TopBarBackStyle`; tonal by default). */
    plainBack?: boolean;
    /** The app's tone class for the back arrow (see `IconButton`). */
    backTone?: string;
    /** Kodhast's dots before the title (`<kh-dots>`). */
    dots?: boolean;
    /** The dots bounce: something is being fetched or synced (implies `dots`). */
    bouncing?: boolean;
    /** At the end (`kh-topbar__actions`): the app's status first, then the actions. */
    actions?: ReactNode;
}
/**
 * web-ui's `<header class="kh-topbar">` (android-ui's small AppTopBar): a sub screen's row with the back arrow,
 * fixed at the top while the page scrolls. The blur under it when scrolled is web-ui's CSS, no script.
 */
export declare function TopBar({ title, onBack, backHref, backLabel, plainBack, backTone, dots, bouncing, actions }: TopBarProps): import("react").JSX.Element;
