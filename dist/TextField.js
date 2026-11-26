import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input, Label, Text, TextArea, TextField as AriaTextField } from 'react-aria-components';
import { IconButton } from './IconButton.js';
/** web-ui's `.kh-field` (android-ui's AppTextField) with React Aria's text field behaviour. */
export function TextField({ label, suffix, description, errorMessage, multiline = false, action, ...props }) {
    const hasError = errorMessage !== undefined && errorMessage !== null && errorMessage !== false;
    return (_jsxs(AriaTextField, { ...props, isInvalid: hasError, className: "kh-field-group", children: [_jsxs("label", { className: "kh-field", children: [multiline ? (_jsx(TextArea, { className: "kh-field__input", placeholder: " ", rows: 1 })) : (_jsx(Input, { className: "kh-field__input", placeholder: " " })), _jsx(Label, { elementType: "span", className: "kh-field__label", children: label }), suffix !== undefined && _jsx("span", { className: "kh-field__suffix", children: suffix }), action && (_jsx(IconButton, { "aria-label": action.label, onPress: action.onPress, children: action.icon }))] }), hasError ? (_jsx(Text, { slot: "errorMessage", elementType: "p", className: "kh-field__support kh-field__support--error", children: errorMessage })) : (description !== undefined && (_jsx(Text, { slot: "description", elementType: "p", className: "kh-field__support", children: description })))] }));
}
