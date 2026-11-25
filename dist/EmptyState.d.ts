import type { ReactNode } from 'react';
export interface EmptyStateProps {
    title: ReactNode;
    text?: ReactNode;
    /** An `<svg>` in the tile. */
    icon?: ReactNode;
    /** Buttons under the message; the view's main action is a `Button variant="primary"`. */
    actions?: ReactNode;
    /** A small note at the bottom. */
    note?: ReactNode;
    /** `error` tints the tile, `compact` fits in a card, `fullscreen` fills the view. */
    variant?: 'error' | 'compact' | 'fullscreen';
}
/** web-ui's `.kh-empty` (android-ui's EmptyState): what a view shows when it has nothing yet. */
export declare function EmptyState({ title, text, icon, actions, note, variant }: EmptyStateProps): import("react").JSX.Element;
