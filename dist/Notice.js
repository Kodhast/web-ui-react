import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { Chevron } from './Row.js';
import { Surface } from './Surface.js';
/**
 * web-ui's `.kh-notice` (android-ui's NoticeBanner): a line at the top of a view that says something about the
 * whole view. As a link or button it gets the chevron.
 */
export function Notice({ title, detail, icon, tone, action, ...press }) {
    const pressable = press.href !== undefined || press.onPress !== undefined;
    return (_jsxs(Surface, { ...press, className: cx('kh-notice', tone), children: [icon, _jsxs("span", { className: "kh-notice__text", children: [_jsx("span", { className: "kh-notice__title", children: title }), detail !== undefined && _jsx("span", { className: "kh-notice__detail", children: detail }), !pressable && action] }), pressable && _jsx(Chevron, {})] }));
}
