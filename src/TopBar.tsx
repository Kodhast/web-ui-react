import type { ReactNode } from 'react';
import { Dots } from './Dots.js';
import { IconButton } from './IconButton.js';

export interface TopBarProps {
	/** The heading (`<h1>`). */
	title: ReactNode;
	/** The back arrow as a button. */
	onBack?: () => void;
	/** The back arrow as a link. Wins over `onBack`. */
	backHref?: string;
	/** The back arrow's name; "Tillbaka" by default. */
	backLabel?: string;
	/** The back arrow plain instead of tonal (android-ui's `TopBarBackStyle`; tonal by default). */
	plainBack?: boolean;
	/** The app's tone class for the back arrow (see `IconButton`). */
	backTone?: string;
	/** Kodhast's dots before the title (`<kh-dots>`). */
	dots?: boolean;
	/** The dots bounce: something is being fetched or synced (implies `dots`). */
	bouncing?: boolean;
	/** At the end (`kh-topbar__actions`): the app's status first, then the actions. */
	actions?: ReactNode;
}

/**
 * web-ui's `<header class="kh-topbar">` (android-ui's small AppTopBar): a sub screen's row with the back arrow,
 * fixed at the top while the page scrolls. The blur under it when scrolled is web-ui's CSS, no script.
 */
export function TopBar({
	title,
	onBack,
	backHref,
	backLabel = 'Tillbaka',
	plainBack = false,
	backTone,
	dots = false,
	bouncing = false,
	actions
}: TopBarProps) {
	const hasBack = backHref !== undefined || onBack !== undefined;
	return (
		<header className="kh-topbar">
			{hasBack && (
				<IconButton
					aria-label={backLabel}
					tonal={!plainBack}
					tone={backTone}
					href={backHref}
					onPress={onBack}
				>
					<BackArrow />
				</IconButton>
			)}
			<h1 className="kh-topbar__title">
				{(dots || bouncing) && <Dots bouncing={bouncing} />}
				<span>{title}</span>
			</h1>
			{actions !== undefined && <div className="kh-topbar__actions">{actions}</div>}
		</header>
	);
}

/** The back arrow in web-ui's gallery (android-ui's ic_arrow_back). */
function BackArrow() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M19 12H5M12 19l-7-7 7-7"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
