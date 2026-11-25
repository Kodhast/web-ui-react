import { jsx as _jsx } from "react/jsx-runtime";
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
/** Renders `className` and `children` as a link, a button or the static element `as`. */
export function Surface({ href, onPress, className, as: Static = 'div', children, 'aria-label': ariaLabel }) {
    if (href !== undefined) {
        return (_jsx(AriaLink, { href: href, className: className, "aria-label": ariaLabel, children: children }));
    }
    if (onPress) {
        return (_jsx(AriaButton, { onPress: onPress, className: className, "aria-label": ariaLabel, children: children }));
    }
    return (_jsx(Static, { className: className, "aria-label": ariaLabel, children: children }));
}
