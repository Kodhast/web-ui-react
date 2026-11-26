import type { ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';

export interface ChipProps {
	/** The text, in `kh-chip__label` so that a long one is cut with an ellipsis. */
	children: ReactNode;
	/** An `<svg>` before the text. */
	icon?: ReactNode;
	/** An `<svg>` after the text, e.g. an arrow that says the chip opens a choice. */
	trailing?: ReactNode;
	onPress?: () => void;
	isDisabled?: boolean;
	/** A fuller name than the text, e.g. "Byt tidkod, nu Utveckling". */
	'aria-label'?: string;
}

/**
 * One `.kh-chip` that is a plain button, not a choice: it does something when pressed, e.g. opens
 * a list. Looks like an unchosen chip in web-ui; `FilterChips` is for chips that are chosen.
 */
export function Chip({ children, icon, trailing, onPress, isDisabled, ...labels }: ChipProps) {
	return (
		<AriaButton {...labels} className="kh-chip" onPress={onPress} isDisabled={isDisabled}>
			{icon}
			<span className="kh-chip__label">{children}</span>
			{trailing}
		</AriaButton>
	);
}
