import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { cx } from './cx.js';
/** web-ui's `.kh-chips` with `.kh-chip` (android-ui's ChipRow of AppFilterChip): several can be chosen. */
export function FilterChips({ options, selected, defaultSelected, onChange, isDisabled, ...labels }) {
    return (_jsx(ToggleButtonGroup, { ...labels, className: "kh-chips", selectionMode: "multiple", selectedKeys: selected, defaultSelectedKeys: defaultSelected, onSelectionChange: (keys) => onChange?.([...keys].map(String)), isDisabled: isDisabled, children: options.map((option) => (_jsxs(ToggleButton, { id: option.value, isDisabled: option.isDisabled, className: cx('kh-chip', option.emphasized && 'kh-chip--emphasized', option.pending !== undefined && 'kh-chip--pending'), children: [option.icon, _jsx("span", { className: "kh-chip__label", children: option.label }), option.count !== undefined && _jsx("span", { className: "kh-chip__value", children: option.count }), option.pending !== undefined && (_jsx("span", { className: "kh-chip__pending", children: option.pending }))] }, option.value))) }));
}
