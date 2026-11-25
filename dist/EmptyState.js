import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
/** web-ui's `.kh-empty` (android-ui's EmptyState): what a view shows when it has nothing yet. */
export function EmptyState({ title, text, icon, actions, note, variant }) {
    return (_jsxs("div", { className: cx('kh-empty', variant && `kh-empty--${variant}`), children: [_jsxs("div", { className: "kh-empty__message", children: [icon !== undefined && _jsx("div", { className: "kh-empty__tile", children: icon }), _jsxs("div", { className: "kh-empty__texts", children: [_jsx("h3", { className: "kh-empty__title", children: title }), text !== undefined && _jsx("p", { className: "kh-empty__text", children: text })] })] }), actions !== undefined && _jsx("div", { className: "kh-empty__actions", children: actions }), note !== undefined && _jsx("p", { className: "kh-empty__note", children: note })] }));
}
