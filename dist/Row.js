import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { Surface } from './Surface.js';
/** web-ui's `.kh-row` (android-ui's ItemRow): static, a link (`href`) or a button (`onPress`). */
export function Row({ title, subtitle, leading, trailing, navigates = false, tinted = false, done = false, inactive = false, accentClass, ...press }) {
    const className = cx('kh-row', tinted && 'kh-row--tinted', done && 'kh-row--done', inactive && 'kh-row--inactive', accentClass && 'kh-row--accent', accentClass);
    return (_jsxs(Surface, { ...press, className: className, children: [leading !== undefined && _jsx("span", { className: "kh-row__leading", children: leading }), _jsxs("span", { className: "kh-row__text", children: [_jsx("span", { className: "kh-row__title", children: title }), subtitle !== undefined && _jsx("span", { className: "kh-row__subtitle", children: subtitle })] }), trailing !== undefined && _jsx("span", { className: "kh-row__trailing", children: trailing }), navigates && _jsx(Chevron, {})] }));
}
/** web-ui's `.kh-chevron`: the arrow at the end of a row or notice that opens something. */
export function Chevron() {
    return _jsx("span", { className: "kh-chevron", "aria-hidden": "true" });
}
