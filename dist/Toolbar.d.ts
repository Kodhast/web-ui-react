import { type ReactNode } from 'react';
export interface ToolbarTab {
    /** Tells the tabs apart; `selected` names one of them. */
    id: string;
    /** The name; shown beside the icon only on the selected tab. */
    label: string;
    /** An `<svg>`. */
    icon: ReactNode;
    /** Where the tab leads. The app's router handles the link; the toolbar does no routing. */
    href: string;
    /** A count on the tab while it is not selected (`kh-toolbar__badge`), e.g. unsent weeks. */
    badge?: ReactNode;
}
export interface ToolbarAction {
    /** The name, e.g. "Starta timern". */
    label: string;
    /** An `<svg>`. */
    icon: ReactNode;
    onPress: () => void;
}
export interface ToolbarProps {
    tabs: ToolbarTab[];
    /** The `id` of the tab for the page shown (`aria-current="page"`). */
    selected: string;
    /** The main button beside the tabs (`kh-toolbar__action`), e.g. the timer's start and stop. */
    action?: ToolbarAction;
    /** At the bottom of the screen (`kh-toolbar--fixed`); the content then needs `--kh-toolbar-clearance` under it. */
    fixed?: boolean;
    /** The name of the tabs' `<nav>`. */
    'aria-label'?: string;
}
/**
 * web-ui's `<kh-toolbar>` (android-ui's AppFloatingToolbar), rendered here so that it needs no kh.js: the tabs
 * are links, and the app says which one is the current page.
 */
export declare function Toolbar({ tabs, selected, action, fixed, 'aria-label': label }: ToolbarProps): import("react").ReactElement<{
    className: string | undefined;
}, string | import("react").JSXElementConstructor<any>>;
