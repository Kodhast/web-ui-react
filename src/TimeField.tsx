import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Input, Label, Text, TextField as AriaTextField } from 'react-aria-components';
import { Button } from './Button.js';
import { IconButton } from './IconButton.js';
import { Modal } from './Modal.js';
import { TimePicker } from './TimePicker.js';
import { clampStep, snapTime } from './timeWheel.js';

export interface TimeFieldProps {
	/** The label on the field's border, e.g. "Start". */
	label: ReactNode;
	/** The time as "HH:MM". Shown as it is, also between the steps. */
	value: string;
	/** The chosen time as "HH:MM", when OK is pressed. */
	onChange: (value: string) => void;
	/** The minute wheel's step in minutes, 1–30 (standard 1). The chosen time lies on a step. */
	step?: number;
	/** Help text under the field. Replaced by `errorMessage` while there is one. */
	description?: ReactNode;
	/** Makes the field invalid and shows this text under it in the error colour. */
	errorMessage?: ReactNode;
	isDisabled?: boolean;
	/** The dialog's title (standard the label). */
	pickerTitle?: ReactNode;
	/** The icon button's name and what the field offers (standard "Välj tid"). */
	pickLabel?: string;
}

/** Material Symbols' schedule, as android-ui's ic_clock. */
const Clock = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
	</svg>
);

/**
 * android-ui's TimeField: web-ui's `.kh-field` that shows the time ("07:00") and opens the wheels (`TimePicker`) in a
 * `kh-dialog` with Avbryt and OK. The field cannot be typed in, so no keyboard comes up on the phone: a press anywhere
 * on it, the clock or Enter, Space or arrow down opens the dialog.
 */
export function TimeField({
	label,
	value,
	onChange,
	step = 1,
	description,
	errorMessage,
	isDisabled = false,
	pickerTitle,
	pickLabel = 'Välj tid'
}: TimeFieldProps) {
	const [isOpen, setOpen] = useState(false);
	const hasError = errorMessage !== undefined && errorMessage !== null && errorMessage !== false;
	const open = () => {
		if (!isDisabled) setOpen(true);
	};
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowDown') return;
		event.preventDefault();
		open();
	};
	return (
		<>
			<AriaTextField
				value={value}
				isReadOnly
				isDisabled={isDisabled}
				isInvalid={hasError}
				className="kh-field-group"
			>
				<label className="kh-field">
					<Input
						className="kh-field__input"
						placeholder=" "
						aria-haspopup="dialog"
						onClick={open}
						onKeyDown={onKeyDown}
					/>
					<Label elementType="span" className="kh-field__label">
						{label}
					</Label>
					<IconButton aria-label={pickLabel} onPress={open} isDisabled={isDisabled}>
						<Clock />
					</IconButton>
				</label>
				{hasError ? (
					<Text
						slot="errorMessage"
						elementType="p"
						className="kh-field__support kh-field__support--error"
					>
						{errorMessage}
					</Text>
				) : (
					description !== undefined && (
						<Text slot="description" elementType="p" className="kh-field__support">
							{description}
						</Text>
					)
				)}
			</AriaTextField>
			<Modal
				className="kh-dialog"
				role="dialog"
				isDismissable
				isOpen={isOpen}
				onOpenChange={setOpen}
			>
				{({ titleProps }) => (
					<PickerContent
						title={pickerTitle ?? label}
						titleProps={titleProps}
						value={value}
						step={step}
						onCancel={() => setOpen(false)}
						onPick={(time) => {
							onChange(time);
							setOpen(false);
						}}
					/>
				)}
			</Modal>
		</>
	);
}

interface PickerContentProps {
	title: ReactNode;
	titleProps: object;
	value: string;
	step: number;
	onCancel: () => void;
	onPick: (value: string) => void;
}

/** The dialog's content: the wheels start on the field's time each time the dialog opens. */
function PickerContent({ title, titleProps, value, step, onCancel, onPick }: PickerContentProps) {
	const [draft, setDraft] = useState(value);
	return (
		<>
			<h2 {...titleProps} className="kh-dialog__title">
				{title}
			</h2>
			<TimePicker value={draft} onChange={setDraft} step={step} />
			<div className="kh-dialog__actions">
				<Button variant="text" onPress={onCancel}>
					Avbryt
				</Button>
				<Button variant="text" onPress={() => onPick(snapTime(draft, clampStep(step)))}>
					OK
				</Button>
			</div>
		</>
	);
}
