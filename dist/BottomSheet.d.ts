import type { ReactNode } from 'react';
import { type OverlayStateProps } from './Modal.js';
export interface BottomSheetProps extends OverlayStateProps {
    /** Names the sheet (`kh-sheet__title`). */
    title: ReactNode;
    /** A line under the title (`kh-sheet__subtitle`). */
    subtitle?: ReactNode;
    /** The buttons, fixed at the bottom of the sheet while its content scrolls (`kh-sheet__footer`). */
    footer?: ReactNode;
    children?: ReactNode;
}
/**
 * web-ui's `.kh-sheet` (android-ui's AppBottomSheet): a modal `<dialog>` at the bottom with the grip and the blurred
 * backdrop. Escape, Android's back and a press on the backdrop close it.
 */
export declare function BottomSheet({ title, subtitle, footer, children, isOpen, onOpenChange }: BottomSheetProps): import("react").JSX.Element;
