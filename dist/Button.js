import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as AriaButton } from 'react-aria-components';
import { Dots } from './Dots.js';
const variantClass = {
    tonal: null,
    primary: 'kh-btn--primary',
    outlined: 'kh-btn--outlined',
    text: 'kh-btn--text',
    destructive: 'kh-btn--destructive',
    destructiveText: 'kh-btn--destructive-text'
};
/** The class list for a button; exported for tests and for links that must look like buttons. */
export function buttonClass({ variant = 'tonal', compact = false, block = false } = {}) {
    return ['kh-btn', variantClass[variant], compact && 'kh-btn--compact', block && 'kh-btn--block']
        .filter(Boolean)
        .join(' ');
}
/** web-ui's `.kh-btn` (android-ui's AppButton) with React Aria's press, focus and keyboard handling. */
export function Button({ variant, compact, block, isPending: pending = false, icon, children, ...props }) {
    const isPending = pending && !props.isDisabled;
    return (_jsxs(AriaButton, { ...props, isPending: isPending, 
        // React Aria marks a pending button aria-disabled; web-ui tells busy from off by aria-busy.
        render: (domProps) => _jsx("button", { ...domProps, "aria-busy": isPending || undefined }), className: buttonClass({ variant, compact, block }), children: [isPending ? _jsx(Dots, { bouncing: true }) : icon, children] }));
}
