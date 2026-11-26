import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import { Menu as AriaMenu, MenuItem as AriaMenuItem, Separator as AriaSeparator } from 'react-aria-components';
import { cx } from './cx.js';
/**
 * web-ui's `.kh-menu` (android-ui's AppMenuPopup): a native popover (`<div popover>`) opened by its trigger with
 * `popovertarget`, so that Chrome anchors it under the button, lined up with its end (web-ui's `position-area`),
 * and closes it on Escape, a press outside and Android's back. React Aria's `Menu` owns the roles, the arrows
 * and the focus inside; its `Popover` is not used, since it sets `style` (decision 0003).
 */
export function Menu({ trigger, children, header, above = false, id, ...props }) {
    const made = useId();
    const menuId = id ?? `kh-menu-${made.replace(/[^\w-]/g, '')}`;
    const popover = useRef(null);
    const list = useRef(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const element = popover.current;
        if (!element)
            return;
        const onToggle = (event) => {
            const isOpen = event.newState === 'open';
            setOpen(isOpen);
            // The first item takes the focus, so that the arrows move from there (as a menu button in WAI-ARIA).
            if (isOpen)
                list.current?.querySelector('[role^="menuitem"]')?.focus();
        };
        element.addEventListener('toggle', onToggle);
        return () => element.removeEventListener('toggle', onToggle);
    }, []);
    return (_jsxs(_Fragment, { children: [cloneElement(trigger, {
                popoverTarget: menuId,
                'aria-haspopup': 'menu',
                'aria-expanded': open,
                'aria-controls': menuId
            }), _jsxs("div", { ref: popover, id: menuId, className: cx('kh-menu', above && 'kh-menu--above'), popover: "auto", children: [header, _jsx(AriaMenu, { ref: list, className: "", "aria-label": props['aria-label'], onClose: () => popover.current?.hidePopover(), children: children })] })] }));
}
/** One of the menu's items (`kh-menu__item`). */
export function MenuItem({ children, icon, onAction, href, destructive = false, textValue, isDisabled }) {
    return (_jsxs(AriaMenuItem, { className: cx('kh-menu__item', destructive && 'kh-menu__item--destructive'), textValue: textValue ?? (typeof children === 'string' ? children : undefined), onAction: onAction, href: href, isDisabled: isDisabled, children: [icon, children] }));
}
/** A line between the menu's items (`kh-divider`). */
export function MenuSeparator() {
    return _jsx(AriaSeparator, { className: "kh-divider" });
}
