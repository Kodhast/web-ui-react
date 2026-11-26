import type { ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';

export interface PeriodPickerProps {
	/** The period shown, e.g. "Tisdag 24 november" or "Vecka 47 · 16–22 nov"; cut short on one line. */
	label: ReactNode;
	/** One period back. */
	onPrevious?: () => void;
	/** One period forward. */
	onNext?: () => void;
	/** The back arrow's name; "Föregående" by default (e.g. "Föregående vecka"). */
	previousLabel?: string;
	/** The forward arrow's name; "Nästa" by default. */
	nextLabel?: string;
	isPreviousDisabled?: boolean;
	isNextDisabled?: boolean;
	/** The label is a button; what it opens (e.g. a date picker) is the app's. */
	onLabelPress?: () => void;
	/** The group's name. */
	'aria-label'?: string;
}

/**
 * web-ui's `kh-period` (only on the web, no android-ui part): arrows and a label with a calendar icon that step
 * a day or a week at a time. The app owns the date and the text; the picker has no state of its own.
 */
export function PeriodPicker({
	label,
	onPrevious,
	onNext,
	previousLabel = 'Föregående',
	nextLabel = 'Nästa',
	isPreviousDisabled,
	isNextDisabled,
	onLabelPress,
	'aria-label': ariaLabel
}: PeriodPickerProps) {
	return (
		<div className="kh-period" role="group" aria-label={ariaLabel}>
			<AriaButton
				className="kh-icon-btn kh-period__prev"
				aria-label={previousLabel}
				onPress={onPrevious}
				isDisabled={isPreviousDisabled}
			>
				<Icon d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
			</AriaButton>
			<AriaButton className="kh-period__label" onPress={onLabelPress}>
				<Icon d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
				<span>{label}</span>
			</AriaButton>
			<AriaButton
				className="kh-icon-btn kh-period__next"
				aria-label={nextLabel}
				onPress={onNext}
				isDisabled={isNextDisabled}
			>
				<Icon d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
			</AriaButton>
		</div>
	);
}

/** The icons in web-ui's gallery (chevron left and right, calendar); web-ui's CSS fills them. */
function Icon({ d }: { d: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d={d} />
		</svg>
	);
}
