import type { Key, ReactNode } from 'react';
export interface ReorderItem {
    id: string;
    /** The row's title. */
    title: ReactNode;
    subtitle?: ReactNode;
    /** The row as plain text: type-ahead and the handle's name. */
    textValue: string;
}
export interface ReorderListProps {
    items: ReorderItem[];
    /** The ids in their new order, after a drop. */
    onReorder: (ids: string[]) => void;
    /** The handle's name; "Flytta <textValue>" by default. */
    handleLabel?: (item: ReorderItem) => string;
    /** The list's name. */
    'aria-label': string;
}
/**
 * Moves `moved` to before or after `target`, keeping their order among themselves. An id not in the list, or a
 * target that is itself moved, leaves the order as it is.
 */
export declare function reorder(ids: readonly string[], moved: Iterable<Key>, target: Key, position: 'before' | 'after'): string[];
/**
 * web-ui's `kh-reorder` (only on the web): a list of `kh-row` with a handle last in each row, reordered by
 * dragging (or with the keyboard from the handle). React Aria's GridList owns the dragging and sets
 * `data-dragging` and `data-drop-target`, which web-ui's CSS reads. The app owns the order.
 */
export declare function ReorderList({ items, onReorder, handleLabel, 'aria-label': ariaLabel }: ReorderListProps): import("react").JSX.Element;
