import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './cx.js';
import { Surface } from './Surface.js';
/** web-ui's `.kh-card` (android-ui's AppCard): static, a link (`href`) or a button (`onPress`). */
export function Card({ tone, children, ...press }) {
    return (_jsx(Surface, { ...press, className: cx('kh-card', tone && 'kh-card--tone', tone), children: children }));
}
