import type { ReactNode, Ref } from 'react';
import {
	Button as AriaButton,
	Link as AriaLink,
	type ButtonProps as AriaButtonProps
} from 'react-aria-components';
import { cx } from './cx.js';

export interface IconButtonProps extends Pick<
	AriaButtonProps,
	'onPress' | 'isDisabled' | 'type' | 'id' | 'aria-expanded' | 'aria-controls' | 'aria-haspopup'
> {
	/** The name. Required: the button shows only an icon. */
	'aria-label': string;
	/** The icon, an `<svg>`. */
	children: ReactNode;
	/** On a plate in secondary-container (`kh-icon-btn--tonal`); plain by default, as android-ui. */
	tonal?: boolean;
	/**
	 * The app's tone class (e.g. `ton-gron`), which sets `--kh-tone-container` and `--kh-tone-content`: the icon
	 * takes the tone's colour, and a tonal button its plate too.
	 */
	tone?: string;
	/** Makes it a link (`<a class="kh-icon-btn">`), e.g. a back arrow to a known page. */
	href?: string;
	/** The button; a link (`href`) takes no ref. */
	ref?: Ref<HTMLButtonElement>;
}

/** web-ui's `.kh-icon-btn` (android-ui's AppIconButton): 48 in touch target and shape, a 24 icon. */
export function IconButton({
	tonal = false,
	tone,
	href,
	children,
	ref,
	...props
}: IconButtonProps) {
	const className = cx('kh-icon-btn', tonal && 'kh-icon-btn--tonal', tone);
	if (href !== undefined) {
		return (
			<AriaLink
				href={href}
				className={className}
				id={props.id}
				aria-label={props['aria-label']}
				aria-expanded={props['aria-expanded']}
				aria-controls={props['aria-controls']}
				aria-haspopup={props['aria-haspopup']}
				isDisabled={props.isDisabled}
			>
				{children}
			</AriaLink>
		);
	}
	return (
		<AriaButton {...props} ref={ref} className={className}>
			{children}
		</AriaButton>
	);
}
