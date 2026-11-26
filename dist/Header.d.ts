import { type ReactElement, type ReactNode } from 'react';
export interface HeaderProps {
    /** The heading (`<h1>`), large at rest and beside the icon when collapsed. */
    title: ReactNode;
    /** The app's icon, an `<svg>` or `<img>`; it gets the class `kh-header__icon`. */
    icon?: ReactElement<{
        className?: string;
    }>;
    /** The app's name beside the icon. */
    name?: ReactNode;
    /** The app's version after the name (`kh-header__version`): small and dimmed, left out when it does not fit. */
    version?: ReactNode;
    /** Under the title, e.g. a greeting or a count. */
    subtitle?: ReactNode;
    /** At the end of the top row: the account's avatar, a status or a button. */
    trailing?: ReactNode;
    /** Kodhast's dots before the title (`<kh-dots>`). */
    dots?: boolean;
    /** The dots bounce: something is being synced (implies `dots`). */
    bouncing?: boolean;
}
/**
 * web-ui's `<kh-header>` (android-ui's AppHeader). Without kh.js the element is not defined, and web-ui's CSS
 * (2.1.0) collapses and raises it from the scroll of the nearest scroller; nothing here reads the scroll.
 */
export declare function Header({ title, icon, name, version, subtitle, trailing, dots, bouncing }: HeaderProps): import("react").DOMElement<import("react").DOMAttributes<Element>, Element>;
