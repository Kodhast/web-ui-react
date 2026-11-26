import {
	cloneElement,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactElement,
	type ReactNode
} from 'react';
import {
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	Separator as AriaSeparator
} from 'react-aria-components';
import { cx } from './cx.js';

/** The props `Menu` gives its trigger: a native button that opens the popover and says so. */
export interface MenuTriggerProps {
	popoverTarget: string;
	'aria-haspopup': 'menu';
	'aria-expanded': boolean;
	'aria-controls': string;
}

export interface MenuProps {
	/**
	 * The button that opens the menu: an element that renders a native `<button>` and passes these props on
	 * (`MenuTriggerProps`), e.g. `Avatar` or a `<button className="kh-icon-btn" aria-label="…">`.
	 */
	trigger: ReactElement<Partial<MenuTriggerProps>>;
	/** The menu's items: `MenuItem` and `MenuSeparator`. */
	children: ReactNode;
	/** The menu's name, e.g. "Konto". */
	'aria-label': string;
	/** Above the items and not one of them, e.g. the account's row. */
	header?: ReactNode;
	/** Opens above the button (`kh-menu--above`), e.g. for the toolbar's main button. */
	above?: boolean;
	/** The popover's id; one is made up otherwise. */
	id?: string;
}

/**
 * web-ui's `.kh-menu` (android-ui's AppMenuPopup): a native popover (`<div popover>`) opened by its trigger with
 * `popovertarget`, so that Chrome anchors it under the button, lined up with its end (web-ui's `position-area`),
 * and closes it on Escape, a press outside and Android's back. React Aria's `Menu` owns the roles, the arrows
 * and the focus inside; its `Popover` is not used, since it sets `style` (decision 0003).
 */
export function Menu({ trigger, children, header, above = false, id, ...props }: MenuProps) {
	const made = useId();
	const menuId = id ?? `kh-menu-${made.replace(/[^\w-]/g, '')}`;
	const popover = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const element = popover.current;
		if (!element) return;
		const onToggle = (event: Event) => {
			const isOpen = (event as ToggleEvent).newState === 'open';
			setOpen(isOpen);
			// The first item takes the focus, so that the arrows move from there (as a menu button in WAI-ARIA).
			if (isOpen) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();
		};
		element.addEventListener('toggle', onToggle);
		return () => element.removeEventListener('toggle', onToggle);
	}, []);

	return (
		<>
			{cloneElement(trigger, {
				popoverTarget: menuId,
				'aria-haspopup': 'menu',
				'aria-expanded': open,
				'aria-controls': menuId
			})}
			<div
				ref={popover}
				id={menuId}
				className={cx('kh-menu', above && 'kh-menu--above')}
				popover="auto"
			>
				{header}
				<AriaMenu
					ref={list}
					className=""
					aria-label={props['aria-label']}
					onClose={() => popover.current?.hidePopover()}
				>
					{children}
				</AriaMenu>
			</div>
		</>
	);
}

export interface MenuItemProps {
	/** The text; a string also names the item for typeahead. */
	children: ReactNode;
	/** An `<svg>` before the text. */
	icon?: ReactNode;
	/** Called when chosen; the menu has closed. */
	onAction?: () => void;
	/** Makes the item a link (`<a>`); the menu closes when it is followed. */
	href?: string;
	/** In the error colour (`kh-menu__item--destructive`). */
	destructive?: boolean;
	/** The text for typeahead when `children` is not a string. */
	textValue?: string;
	isDisabled?: boolean;
}

/** One of the menu's items (`kh-menu__item`). */
export function MenuItem({
	children,
	icon,
	onAction,
	href,
	destructive = false,
	textValue,
	isDisabled
}: MenuItemProps) {
	return (
		<AriaMenuItem
			className={cx('kh-menu__item', destructive && 'kh-menu__item--destructive')}
			textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
			onAction={onAction}
			href={href}
			isDisabled={isDisabled}
		>
			{icon}
			{children}
		</AriaMenuItem>
	);
}

/** A line between the menu's items (`kh-divider`). */
export function MenuSeparator() {
	return <AriaSeparator className="kh-divider" />;
}
