import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Input, Label, Text, TextField as AriaTextField } from 'react-aria-components';
import { Button } from './Button.js';
import { IconButton } from './IconButton.js';
import { Modal } from './Modal.js';
import { TimePicker } from './TimePicker.js';
import { clampStep, snapTime } from './timeWheel.js';
/** Material Symbols' schedule, as android-ui's ic_clock. */
const Clock = () => (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" }) }));
/**
 * android-ui's TimeField: web-ui's `.kh-field` that shows the time ("07:00") and opens the wheels (`TimePicker`) in a
 * `kh-dialog` with Avbryt and OK. The field cannot be typed in, so no keyboard comes up on the phone: a press anywhere
 * on it, the clock or Enter, Space or arrow down opens the dialog.
 */
export function TimeField({ label, value, onChange, step = 1, description, errorMessage, isDisabled = false, pickerTitle, pickerStart = '08:00', pickLabel = 'Välj tid' }) {
    const [isOpen, setOpen] = useState(false);
    const hasError = errorMessage !== undefined && errorMessage !== null && errorMessage !== false;
    const open = () => {
        if (!isDisabled)
            setOpen(true);
    };
    const onKeyDown = (event) => {
        if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowDown')
            return;
        event.preventDefault();
        open();
    };
    return (_jsxs(_Fragment, { children: [_jsxs(AriaTextField, { value: value, isReadOnly: true, isDisabled: isDisabled, isInvalid: hasError, className: "kh-field-group", children: [_jsxs("label", { className: "kh-field", children: [_jsx(Input, { className: "kh-field__input", placeholder: " ", "aria-haspopup": "dialog", onClick: open, onKeyDown: onKeyDown }), _jsx(Label, { elementType: "span", className: "kh-field__label", children: label }), _jsx(IconButton, { "aria-label": pickLabel, onPress: open, isDisabled: isDisabled, children: _jsx(Clock, {}) })] }), hasError ? (_jsx(Text, { slot: "errorMessage", elementType: "p", className: "kh-field__support kh-field__support--error", children: errorMessage })) : (description !== undefined && (_jsx(Text, { slot: "description", elementType: "p", className: "kh-field__support", children: description })))] }), _jsx(Modal, { className: "kh-dialog", role: "dialog", isDismissable: true, isOpen: isOpen, onOpenChange: setOpen, children: ({ titleProps }) => (_jsx(PickerContent, { title: pickerTitle ?? label, titleProps: titleProps, value: value.trim() === '' ? pickerStart : value, step: step, onCancel: () => setOpen(false), onPick: (time) => {
                        onChange(time);
                        setOpen(false);
                    } })) })] }));
}
/** The dialog's content: the wheels start on the field's time each time the dialog opens. */
function PickerContent({ title, titleProps, value, step, onCancel, onPick }) {
    const [draft, setDraft] = useState(value);
    return (_jsxs(_Fragment, { children: [_jsx("h2", { ...titleProps, className: "kh-dialog__title", children: title }), _jsx(TimePicker, { value: draft, onChange: setDraft, step: step }), _jsxs("div", { className: "kh-dialog__actions", children: [_jsx(Button, { variant: "text", onPress: onCancel, children: "Avbryt" }), _jsx(Button, { variant: "text", onPress: () => onPick(snapTime(draft, clampStep(step))), children: "OK" })] })] }));
}
