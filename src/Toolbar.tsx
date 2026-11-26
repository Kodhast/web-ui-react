import { createElement, type ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';

export interface ToolbarTab {
	/** Tells the tabs apart; `selected` names one of them. */
	id: string;
	/** The name; shown beside the icon only on the selected tab. */
	label: string;
	/** An `<svg>`. */
	icon: ReactNode;
	/** Where the tab leads. The app's router handles the link; the toolbar does no routing. */
	href: string;
	/** A count on the tab while it is not selected (`kh-toolbar__badge`), e.g. unsent weeks. */
	badge?: ReactNode;
}

export interface ToolbarAction {
	/** The name, e.g. "Starta timern". */
	label: string;
	/** An `<svg>`. */
	icon: ReactNode;
	onPress: () => void;
}

export interface ToolbarProps {
	tabs: ToolbarTab[];
	/** The `id` of the tab for the page shown (`aria-current="page"`). */
	selected: string;
	/** The main button beside the tabs (`kh-toolbar__action`), e.g. the timer's start and stop. */
	action?: ToolbarAction;
	/** At the bottom of the screen (`kh-toolbar--fixed`); the content then needs `--kh-toolbar-clearance` under it. */
	fixed?: boolean;
	/** The name of the tabs' `<nav>`. */
	'aria-label'?: string;
}

/**
 * web-ui's `<kh-toolbar>` (android-ui's AppFloatingToolbar), rendered here so that it needs no kh.js: the tabs
 * are links, and the app says which one is the current page.
 */
export function Toolbar({
	tabs,
	selected,
	action,
	fixed = false,
	'aria-label': label
}: ToolbarProps) {
	return createElement(
		'kh-toolbar',
		{ className: fixed ? 'kh-toolbar--fixed' : undefined },
		<nav className="kh-toolbar__tabs" aria-label={label}>
			{tabs.map((tab) => {
				const current = tab.id === selected;
				return (
					<AriaLink
						key={tab.id}
						href={tab.href}
						className="kh-toolbar__tab"
						aria-label={tab.label}
						aria-current={current ? 'page' : undefined}
					>
						{tab.icon}
						<span className="kh-toolbar__label">{tab.label}</span>
						{tab.badge !== undefined && !current && (
							<span className="kh-toolbar__badge">{tab.badge}</span>
						)}
					</AriaLink>
				);
			})}
		</nav>,
		action && (
			<AriaButton className="kh-toolbar__action" aria-label={action.label} onPress={action.onPress}>
				{action.icon}
			</AriaButton>
		)
	);
}
