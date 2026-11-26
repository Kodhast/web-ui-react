import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as AriaButton } from 'react-aria-components';
/**
 * One `.kh-chip` that is a plain button, not a choice: it does something when pressed, e.g. opens
 * a list. Looks like an unchosen chip in web-ui; `FilterChips` is for chips that are chosen.
 */
export function Chip({ children, icon, trailing, onPress, isDisabled, ...labels }) {
    return (_jsxs(AriaButton, { ...labels, className: "kh-chip", onPress: onPress, isDisabled: isDisabled, children: [icon, _jsx("span", { className: "kh-chip__label", children: children }), trailing] }));
}
