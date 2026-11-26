import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as AriaButton } from 'react-aria-components';
/**
 * web-ui's `kh-period` (only on the web, no android-ui part): arrows and a label with a calendar icon that step
 * a day or a week at a time. The app owns the date and the text; the picker has no state of its own.
 */
export function PeriodPicker({ label, onPrevious, onNext, previousLabel = 'Föregående', nextLabel = 'Nästa', isPreviousDisabled, isNextDisabled, onLabelPress, 'aria-label': ariaLabel }) {
    return (_jsxs("div", { className: "kh-period", role: "group", "aria-label": ariaLabel, children: [_jsx(AriaButton, { className: "kh-icon-btn kh-period__prev", "aria-label": previousLabel, onPress: onPrevious, isDisabled: isPreviousDisabled, children: _jsx(Icon, { d: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" }) }), _jsxs(AriaButton, { className: "kh-period__label", onPress: onLabelPress, children: [_jsx(Icon, { d: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" }), _jsx("span", { children: label })] }), _jsx(AriaButton, { className: "kh-icon-btn kh-period__next", "aria-label": nextLabel, onPress: onNext, isDisabled: isNextDisabled, children: _jsx(Icon, { d: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }) })] }));
}
/** The icons in web-ui's gallery (chevron left and right, calendar); web-ui's CSS fills them. */
function Icon({ d }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: d }) }));
}
