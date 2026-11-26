import { cloneElement, createElement, type ReactElement, type ReactNode } from 'react';
import { cx } from './cx.js';
import { Dots } from './Dots.js';

export interface HeaderProps {
	/** The heading (`<h1>`), large at rest and beside the icon when collapsed. */
	title: ReactNode;
	/** The app's icon, an `<svg>` or `<img>`; it gets the class `kh-header__icon`. */
	icon?: ReactElement<{ className?: string }>;
	/** The app's name beside the icon. */
	name?: ReactNode;
	/** The app's version after the name (`kh-header__version`): small and dimmed, left out when it does not fit. */
	version?: ReactNode;
	/** Under the title, e.g. a greeting or a count. */
	subtitle?: ReactNode;
	/** At the end of the top row: the account's avatar, a status or a button. */
	trailing?: ReactNode;
	/** Kodhast's dots before the title (`<kh-dots>`). */
	dots?: boolean;
	/** The dots bounce: something is being synced (implies `dots`). */
	bouncing?: boolean;
}

/**
 * web-ui's `<kh-header>` (android-ui's AppHeader). Without kh.js the element is not defined, and web-ui's CSS
 * (2.1.0) collapses and raises it from the scroll of the nearest scroller; nothing here reads the scroll.
 */
export function Header({
	title,
	icon,
	name,
	version,
	subtitle,
	trailing,
	dots = false,
	bouncing = false
}: HeaderProps) {
	return createElement(
		'kh-header',
		null,
		icon && cloneElement(icon, { className: cx('kh-header__icon', icon.props.className) }),
		name !== undefined && <span className="kh-header__name">{name}</span>,
		version !== undefined && <span className="kh-header__version">{version}</span>,
		trailing !== undefined && <div className="kh-header__trailing">{trailing}</div>,
		<h1 className="kh-header__title">
			{(dots || bouncing) && <Dots bouncing={bouncing} />}
			<span>{title}</span>
		</h1>,
		subtitle !== undefined && <p className="kh-header__subtitle">{subtitle}</p>
	);
}
