import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
/**
 * web-ui's `<kh-toolbar>` (android-ui's AppFloatingToolbar), rendered here so that it needs no kh.js: the tabs
 * are links, and the app says which one is the current page.
 */
export function Toolbar({ tabs, selected, action, fixed = false, 'aria-label': label }) {
    return createElement('kh-toolbar', { className: fixed ? 'kh-toolbar--fixed' : undefined }, _jsx("nav", { className: "kh-toolbar__tabs", "aria-label": label, children: tabs.map((tab) => {
            const current = tab.id === selected;
            return (_jsxs(AriaLink, { href: tab.href, className: "kh-toolbar__tab", "aria-label": tab.label, "aria-current": current ? 'page' : undefined, children: [tab.icon, _jsx("span", { className: "kh-toolbar__label", children: tab.label }), tab.badge !== undefined && !current && (_jsx("span", { className: "kh-toolbar__badge", children: tab.badge }))] }, tab.id));
        }) }), action && (_jsx(AriaButton, { className: "kh-toolbar__action", "aria-label": action.label, onPress: action.onPress, children: action.icon })));
}
