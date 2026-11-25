import type { ReactNode, Ref } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Dots } from './Dots.js';

/** web-ui's button variants (AppButton). `tonal` is the default; `primary` is the view's one main action. */
export type ButtonVariant =
	'tonal' | 'primary' | 'outlined' | 'text' | 'destructive' | 'destructiveText';

export interface ButtonProps extends Omit<
	AriaButtonProps,
	'className' | 'style' | 'children' | 'isPending' | 'render'
> {
	variant?: ButtonVariant;
	/** The lower button for a header row (`kh-btn--compact`); the touch target stays 48. */
	compact?: boolean;
	/** Full width (`kh-btn--block`). */
	block?: boolean;
	/**
	 * Working: the dots replace the icon, presses are ignored, and colours and focus stay (`aria-busy`).
	 * `isDisabled` wins: a disabled button is never shown as working.
	 */
	isPending?: boolean;
	/** An `<svg>` before the label, as in web-ui; the dots take its place while pending. */
	icon?: ReactNode;
	/** The label. */
	children: ReactNode;
	ref?: Ref<HTMLButtonElement>;
}

const variantClass: Record<ButtonVariant, string | null> = {
	tonal: null,
	primary: 'kh-btn--primary',
	outlined: 'kh-btn--outlined',
	text: 'kh-btn--text',
	destructive: 'kh-btn--destructive',
	destructiveText: 'kh-btn--destructive-text'
};

/** The class list for a button; exported for tests and for links that must look like buttons. */
export function buttonClass({
	variant = 'tonal',
	compact = false,
	block = false
}: Pick<ButtonProps, 'variant' | 'compact' | 'block'> = {}): string {
	return ['kh-btn', variantClass[variant], compact && 'kh-btn--compact', block && 'kh-btn--block']
		.filter(Boolean)
		.join(' ');
}

/** web-ui's `.kh-btn` (android-ui's AppButton) with React Aria's press, focus and keyboard handling. */
export function Button({
	variant,
	compact,
	block,
	isPending: pending = false,
	icon,
	children,
	...props
}: ButtonProps) {
	const isPending = pending && !props.isDisabled;
	return (
		<AriaButton
			{...props}
			isPending={isPending}
			// React Aria marks a pending button aria-disabled; web-ui tells busy from off by aria-busy.
			render={(domProps) => <button {...domProps} aria-busy={isPending || undefined} />}
			className={buttonClass({ variant, compact, block })}
		>
			{isPending ? <Dots bouncing /> : icon}
			{children}
		</AriaButton>
	);
}
