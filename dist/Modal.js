import { jsx as _jsx } from "react/jsx-runtime";
import { useLayoutEffect, useRef } from 'react';
import { FocusScope } from 'react-aria/FocusScope';
import { mergeProps } from 'react-aria/mergeProps';
import { useDialog } from 'react-aria/useDialog';
import { useOverlay } from 'react-aria/useOverlay';
/**
 * web-ui's `<dialog>` opened with `showModal()` (ADR 0002): the browser draws the backdrop (`::backdrop`, with the
 * blur) and makes the page behind inert; React Aria moves focus in, keeps it there and gives it back. Rendered only
 * while open, so closing is unmounting and the open state has one owner, the app.
 */
export function Modal(props) {
    return props.isOpen ? _jsx(OpenModal, { ...props }) : null;
}
function OpenModal({ className, role, isDismissable, onOpenChange, children }) {
    const ref = useRef(null);
    const close = () => onOpenChange(false);
    const { overlayProps } = useOverlay({ isOpen: true, onClose: close, isKeyboardDismissDisabled: !isDismissable }, ref);
    const { dialogProps, titleProps, contentProps } = useDialog({ role }, ref);
    const pressStartedOnBackdrop = useRef(false);
    // Before FocusScope's autoFocus (an effect), so that the first field is focusable when it is focused.
    useLayoutEffect(() => {
        ref.current?.showModal();
    }, []);
    // React Aria handles Escape (useOverlay); the browser's own close request would close a destructive question.
    const escapeProps = {
        onKeyDown: (event) => {
            if (event.key === 'Escape')
                event.preventDefault();
        }
    };
    return (_jsx("dialog", { ...mergeProps(overlayProps, dialogProps, escapeProps), ref: ref, className: className, 
        // Other close requests (Android's back): the app decides, as for Escape.
        onCancel: (event) => {
            event.preventDefault();
            if (isDismissable)
                close();
        }, 
        // The browser closed it anyway (a repeated back without a tap in between cannot be cancelled): follow it.
        onClose: close, onPointerDown: (event) => {
            pressStartedOnBackdrop.current = isOnBackdrop(event);
        }, onClick: (event) => {
            if (isDismissable && pressStartedOnBackdrop.current && isOnBackdrop(event))
                close();
            pressStartedOnBackdrop.current = false;
        }, children: _jsx(FocusScope, { contain: true, restoreFocus: true, autoFocus: true, children: children({ titleProps, contentProps }) }) }));
}
/** A press on `::backdrop` lands on the `<dialog>` itself, outside its box; one on its padding lands inside it. */
function isOnBackdrop(event) {
    if (event.target !== event.currentTarget)
        return false;
    const box = event.currentTarget.getBoundingClientRect();
    return (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom);
}
