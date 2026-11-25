import type { ReactNode } from 'react';
import { cx } from './cx.js';
import { Surface, type PressableProps } from './Surface.js';

export interface RowProps extends PressableProps {
	title: ReactNode;
	subtitle?: ReactNode;
	/** Before the text: an icon or an avatar. */
	leading?: ReactNode;
	/** After the text: a value, a pill or buttons. */
	trailing?: ReactNode;
	/** The chevron at the end, for a row that opens something (`ItemRow(navigates)`). */
	navigates?: boolean;
	/** On the row tint (`kh-row--tinted`). */
	tinted?: boolean;
	/** Done: struck through and dimmed (`kh-row--done`). */
	done?: boolean;
	/** Paused or not counted: dimmed (`kh-row--inactive`). */
	inactive?: boolean;
	/**
	 * The stripe at the start (`kh-row--accent`): the app's class that sets `--kh-accent`, e.g.
	 * `.accent-fel { --kh-accent: var(--kh-error); }`. web-ui sets it with `style`; web-ui-react sets no style.
	 */
	accentClass?: string;
}

/** web-ui's `.kh-row` (android-ui's ItemRow): static, a link (`href`) or a button (`onPress`). */
export function Row({
	title,
	subtitle,
	leading,
	trailing,
	navigates = false,
	tinted = false,
	done = false,
	inactive = false,
	accentClass,
	...press
}: RowProps) {
	const className = cx(
		'kh-row',
		tinted && 'kh-row--tinted',
		done && 'kh-row--done',
		inactive && 'kh-row--inactive',
		accentClass && 'kh-row--accent',
		accentClass
	);
	return (
		<Surface {...press} className={className}>
			{leading !== undefined && <span className="kh-row__leading">{leading}</span>}
			<span className="kh-row__text">
				<span className="kh-row__title">{title}</span>
				{subtitle !== undefined && <span className="kh-row__subtitle">{subtitle}</span>}
			</span>
			{trailing !== undefined && <span className="kh-row__trailing">{trailing}</span>}
			{navigates && <Chevron />}
		</Surface>
	);
}

/** web-ui's `.kh-chevron`: the arrow at the end of a row or notice that opens something. */
export function Chevron() {
	return <span className="kh-chevron" aria-hidden="true" />;
}
