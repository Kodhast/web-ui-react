import type { ReactNode, Ref } from 'react';
import {
	Input,
	Label,
	Text,
	TextArea,
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components';
import { IconButton } from './IconButton.js';

export interface TextFieldProps extends Omit<
	AriaTextFieldProps,
	'className' | 'style' | 'children' | 'render' | 'isInvalid' | 'validate' | 'validationBehavior'
> {
	/** The label: inside the field while it is empty, on the border when it has text or focus. */
	label: ReactNode;
	/** A unit after the text (`kh-field__suffix`), e.g. `mg`. */
	suffix?: ReactNode;
	/** Help text under the field (`kh-field__support`). Replaced by `errorMessage` while there is one. */
	description?: ReactNode;
	/** Makes the field invalid (`aria-invalid`) and shows this text under it in the error colour. */
	errorMessage?: ReactNode;
	/** A `<textarea>` that grows with its text instead of an `<input>`. */
	multiline?: boolean;
	/** An icon button last in the field, for an icon that does something (web-ui's `kh-icon-btn`). */
	action?: { icon: ReactNode; label: string; onPress: () => void };
	ref?: Ref<HTMLDivElement>;
}

/** web-ui's `.kh-field` (android-ui's AppTextField) with React Aria's text field behaviour. */
export function TextField({
	label,
	suffix,
	description,
	errorMessage,
	multiline = false,
	action,
	...props
}: TextFieldProps) {
	const hasError = errorMessage !== undefined && errorMessage !== null && errorMessage !== false;
	return (
		<AriaTextField {...props} isInvalid={hasError} className="kh-field-group">
			<label className="kh-field">
				{/* placeholder=" " is what web-ui's CSS reads to tell an empty field from one with text. */}
				{multiline ? (
					<TextArea className="kh-field__input" placeholder=" " rows={1} />
				) : (
					<Input className="kh-field__input" placeholder=" " />
				)}
				{/* A span, not a label: the wrapping label is the click target, aria-labelledby names the input. */}
				<Label elementType="span" className="kh-field__label">
					{label}
				</Label>
				{suffix !== undefined && <span className="kh-field__suffix">{suffix}</span>}
				{action && (
					<IconButton aria-label={action.label} onPress={action.onPress}>
						{action.icon}
					</IconButton>
				)}
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
	);
}
