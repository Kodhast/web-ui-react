import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from './Modal.js';
/**
 * web-ui's `.kh-sheet` (android-ui's AppBottomSheet): a modal `<dialog>` at the bottom with the grip and the blurred
 * backdrop. Escape, Android's back and a press on the backdrop close it.
 */
export function BottomSheet({ title, subtitle, footer, children, isOpen, onOpenChange }) {
    return (_jsx(Modal, { className: "kh-sheet", role: "dialog", isDismissable: true, isOpen: isOpen, onOpenChange: onOpenChange, children: ({ titleProps }) => (_jsxs(_Fragment, { children: [_jsx("h2", { ...titleProps, className: "kh-sheet__title", children: title }), subtitle !== undefined && _jsx("p", { className: "kh-sheet__subtitle", children: subtitle }), children, footer !== undefined && _jsx("div", { className: "kh-sheet__footer", children: footer })] })) }));
}
