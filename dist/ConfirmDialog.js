import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from './Button.js';
import { Modal } from './Modal.js';
/**
 * web-ui's `.kh-dialog` (android-ui's ConfirmDialog): a question with Avbryt and the action, as a modal
 * `<dialog>` with the blurred backdrop. Focus goes to the first field (or Avbryt) and back to the button that opened it.
 */
export function ConfirmDialog({ title, text, children, confirmLabel, cancelLabel = 'Avbryt', destructive = false, onConfirm, isConfirmDisabled = false, isOpen, onOpenChange }) {
    return (_jsx(Modal, { className: "kh-dialog", role: "alertdialog", isDismissable: !destructive, isOpen: isOpen, onOpenChange: onOpenChange, children: ({ titleProps, contentProps }) => (_jsxs(_Fragment, { children: [_jsx("h2", { ...titleProps, className: "kh-dialog__title", children: title }), text !== undefined && (_jsx("p", { ...contentProps, className: "kh-dialog__text", children: text })), children, _jsxs("div", { className: "kh-dialog__actions", children: [_jsx(Button, { variant: "text", onPress: () => onOpenChange(false), children: cancelLabel }), _jsx(Button, { variant: destructive ? 'destructive' : 'primary', isDisabled: isConfirmDisabled, onPress: () => {
                                onConfirm();
                                onOpenChange(false);
                            }, children: confirmLabel })] })] })) }));
}
