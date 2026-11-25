import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useSwitch } from 'react-aria/useSwitch';
import { useToggleState } from 'react-stately/useToggleState';
import { cx } from './cx.js';
/** React Aria's switch behaviour on web-ui's own `<input class="kh-switch">`, which a hidden input could not carry. */
function useKhSwitch(props, hasText) {
    const ref = useRef(null);
    const state = useToggleState(props);
    // `children` only tells React Aria that the text comes from a wrapping label, so it does not ask for aria-label.
    const { inputProps } = useSwitch({ ...props, children: hasText || undefined }, state, ref);
    return { ref, inputProps };
}
/** web-ui's `.kh-switch` (android-ui's SwitchControl): Material 3's switch alone. For a row, use `SwitchRow`. */
export function Switch(props) {
    const { ref, inputProps } = useKhSwitch(props, false);
    return _jsx("input", { ...inputProps, ref: ref, className: "kh-switch" });
}
/** web-ui's `.kh-switch-row` (android-ui's SwitchRow): the whole row is the label, so a press anywhere toggles. */
export function SwitchRow({ title, subtitle, inactive = false, ...props }) {
    const { ref, inputProps } = useKhSwitch(props, true);
    return (_jsxs("label", { className: cx('kh-row', 'kh-switch-row', inactive && 'kh-switch-row--inactive'), children: [_jsxs("span", { className: "kh-row__text", children: [_jsx("span", { className: "kh-row__title", children: title }), subtitle !== undefined && _jsx("span", { className: "kh-row__subtitle", children: subtitle })] }), _jsx("input", { ...inputProps, ref: ref, className: "kh-switch" })] }));
}
