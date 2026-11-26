import { jsx as _jsx } from "react/jsx-runtime";
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { cx } from './cx.js';
/** web-ui's `.kh-icon-btn` (android-ui's AppIconButton): 48 in touch target and shape, a 24 icon. */
export function IconButton({ tonal = false, tone, href, children, ref, ...props }) {
    const className = cx('kh-icon-btn', tonal && 'kh-icon-btn--tonal', tone);
    if (href !== undefined) {
        return (_jsx(AriaLink, { href: href, className: className, id: props.id, "aria-label": props['aria-label'], "aria-expanded": props['aria-expanded'], "aria-controls": props['aria-controls'], "aria-haspopup": props['aria-haspopup'], isDisabled: props.isDisabled, children: children }));
    }
    return (_jsx(AriaButton, { ...props, ref: ref, className: className, children: children }));
}
