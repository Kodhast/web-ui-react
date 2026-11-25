import type { ReactNode } from 'react';
import { cx } from './cx.js';

export interface EmptyStateProps {
	title: ReactNode;
	text?: ReactNode;
	/** An `<svg>` in the tile. */
	icon?: ReactNode;
	/** Buttons under the message; the view's main action is a `Button variant="primary"`. */
	actions?: ReactNode;
	/** A small note at the bottom. */
	note?: ReactNode;
	/** `error` tints the tile, `compact` fits in a card, `fullscreen` fills the view. */
	variant?: 'error' | 'compact' | 'fullscreen';
}

/** web-ui's `.kh-empty` (android-ui's EmptyState): what a view shows when it has nothing yet. */
export function EmptyState({ title, text, icon, actions, note, variant }: EmptyStateProps) {
	return (
		<div className={cx('kh-empty', variant && `kh-empty--${variant}`)}>
			<div className="kh-empty__message">
				{icon !== undefined && <div className="kh-empty__tile">{icon}</div>}
				<div className="kh-empty__texts">
					<h3 className="kh-empty__title">{title}</h3>
					{text !== undefined && <p className="kh-empty__text">{text}</p>}
				</div>
			</div>
			{actions !== undefined && <div className="kh-empty__actions">{actions}</div>}
			{note !== undefined && <p className="kh-empty__note">{note}</p>}
		</div>
	);
}
