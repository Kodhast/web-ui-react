import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dots } from './Dots.js';
import { IconButton } from './IconButton.js';
/**
 * web-ui's `<header class="kh-topbar">` (android-ui's small AppTopBar): a sub screen's row with the back arrow,
 * fixed at the top while the page scrolls. The blur under it when scrolled is web-ui's CSS, no script.
 */
export function TopBar({ title, onBack, backHref, backLabel = 'Tillbaka', plainBack = false, backTone, dots = false, bouncing = false, actions }) {
    const hasBack = backHref !== undefined || onBack !== undefined;
    return (_jsxs("header", { className: "kh-topbar", children: [hasBack && (_jsx(IconButton, { "aria-label": backLabel, tonal: !plainBack, tone: backTone, href: backHref, onPress: onBack, children: _jsx(BackArrow, {}) })), _jsxs("h1", { className: "kh-topbar__title", children: [(dots || bouncing) && _jsx(Dots, { bouncing: bouncing }), _jsx("span", { children: title })] }), actions !== undefined && _jsx("div", { className: "kh-topbar__actions", children: actions })] }));
}
/** The back arrow in web-ui's gallery (android-ui's ic_arrow_back). */
function BackArrow() {
    return (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M19 12H5M12 19l-7-7 7-7", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
