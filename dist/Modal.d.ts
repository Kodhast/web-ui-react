import { type DOMAttributes, type ReactNode } from 'react';
/** Open and closed, owned by the app: the overlay is shown while `isOpen` and asks to close with `onOpenChange(false)`. */
export interface OverlayStateProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
interface ModalProps extends OverlayStateProps {
    className: 'kh-dialog' | 'kh-sheet';
    role: 'dialog' | 'alertdialog';
    /** Escape, Android's back and a press on the backdrop close it. */
    isDismissable: boolean;
    /** The content, given the props for the title (its id names the dialog) and, in an alertdialog, the text. */
    children: (props: {
        titleProps: DOMAttributes<HTMLElement>;
        contentProps: DOMAttributes<HTMLElement>;
    }) => ReactNode;
}
/**
 * web-ui's `<dialog>` opened with `showModal()` (ADR 0002): the browser draws the backdrop (`::backdrop`, with the
 * blur) and makes the page behind inert; React Aria moves focus in, keeps it there and gives it back. Rendered only
 * while open, so closing is unmounting and the open state has one owner, the app.
 */
export declare function Modal(props: ModalProps): import("react").JSX.Element | null;
export {};
