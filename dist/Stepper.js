import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement } from 'react';
import { Button as AriaButton, Input, NumberField } from 'react-aria-components';
/**
 * web-ui's `<kh-stepper>` (android-ui's QuantityStepper) on React Aria's number field. The element is rendered
 * here, with web-ui's own markup, so it looks right without kh.js. The number field's input is hidden: the
 * visible value is the `<output>` web-ui uses, formatted by `formatOptions`.
 */
export function Stepper({ label, min, max, showLabel = false, ...props }) {
    const stepper = (_jsx(NumberField, { ...props, minValue: min, maxValue: max, "aria-label": label, className: "", children: ({ state }) => createElement('kh-stepper', null, _jsx(AriaButton, { slot: "decrement", className: "kh-stepper__button kh-stepper__button--decrease", "aria-label": `Minska ${label}`, "aria-labelledby": "", excludeFromTabOrder: false }), _jsx(Input, { hidden: true, className: "" }), _jsx("output", { className: "kh-stepper__value", children: state.inputValue }), _jsx(AriaButton, { slot: "increment", className: "kh-stepper__button kh-stepper__button--increase", "aria-label": `Öka ${label}`, "aria-labelledby": "", excludeFromTabOrder: false })) }));
    if (!showLabel)
        return stepper;
    return (_jsxs("div", { className: "kh-stepper-field", children: [stepper, _jsx("span", { className: "kh-stepper-field__label", "aria-hidden": "true", children: label })] }));
}
