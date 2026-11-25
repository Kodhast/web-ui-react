import { jsx as _jsx } from "react/jsx-runtime";
import { Button as AriaButton } from 'react-aria-components';
import { cx } from './cx.js';
/** web-ui's `.kh-pill` (android-ui's InfoPill). */
export function Pill({ tone, square = false, onPress, children }) {
    const className = cx('kh-pill', square && 'kh-pill--square', tone);
    if (onPress) {
        return (_jsx(AriaButton, { onPress: onPress, className: className, children: children }));
    }
    return _jsx("span", { className: className, children: children });
}
/** web-ui's `.kh-pills`: pills in a wrapping row. */
export function Pills({ children }) {
    return _jsx("div", { className: "kh-pills", children: children });
}
