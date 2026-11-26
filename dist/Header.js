import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, createElement } from 'react';
import { cx } from './cx.js';
import { Dots } from './Dots.js';
/**
 * web-ui's `<kh-header>` (android-ui's AppHeader). Without kh.js the element is not defined, and web-ui's CSS
 * (2.1.0) collapses and raises it from the scroll of the nearest scroller; nothing here reads the scroll.
 */
export function Header({ title, icon, name, subtitle, trailing, dots = false, bouncing = false }) {
    return createElement('kh-header', null, icon && cloneElement(icon, { className: cx('kh-header__icon', icon.props.className) }), name !== undefined && _jsx("span", { className: "kh-header__name", children: name }), trailing !== undefined && _jsx("div", { className: "kh-header__trailing", children: trailing }), _jsxs("h1", { className: "kh-header__title", children: [(dots || bouncing) && _jsx(Dots, { bouncing: bouncing }), _jsx("span", { children: title })] }), subtitle !== undefined && _jsx("p", { className: "kh-header__subtitle", children: subtitle }));
}
