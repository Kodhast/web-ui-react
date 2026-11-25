import type { ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { cx } from './cx.js';

export interface PillProps {
	/** The app's tone class (e.g. `ton-gron`). */
	tone?: string;
	/** The square pill (`kh-pill--square`). */
	square?: boolean;
	/** Makes it a button (48 in touch target, as web-ui's `button.kh-pill`). */
	onPress?: () => void;
	/** The text, with an `<svg>` before or after it if wanted. */
	children: ReactNode;
}

/** web-ui's `.kh-pill` (android-ui's InfoPill). */
export function Pill({ tone, square = false, onPress, children }: PillProps) {
	const className = cx('kh-pill', square && 'kh-pill--square', tone);
	if (onPress) {
		return (
			<AriaButton onPress={onPress} className={className}>
				{children}
			</AriaButton>
		);
	}
	return <span className={className}>{children}</span>;
}

/** web-ui's `.kh-pills`: pills in a wrapping row. */
export function Pills({ children }: { children: ReactNode }) {
	return <div className="kh-pills">{children}</div>;
}
