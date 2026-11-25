import type { ReactNode } from 'react';
import { cx } from './cx.js';
import { Chevron } from './Row.js';
import { Surface, type PressableProps } from './Surface.js';

export interface NoticeProps extends PressableProps {
	title: ReactNode;
	detail?: ReactNode;
	/** An `<svg>` at the start. */
	icon?: ReactNode;
	/** The app's tone class (e.g. `ton-varning`). */
	tone?: string;
	/** A button under the detail, as in web-ui's gallery. Not with `href` or `onPress`: a button in a link is invalid. */
	action?: ReactNode;
}

/**
 * web-ui's `.kh-notice` (android-ui's NoticeBanner): a line at the top of a view that says something about the
 * whole view. As a link or button it gets the chevron.
 */
export function Notice({ title, detail, icon, tone, action, ...press }: NoticeProps) {
	const pressable = press.href !== undefined || press.onPress !== undefined;
	return (
		<Surface {...press} className={cx('kh-notice', tone)}>
			{icon}
			<span className="kh-notice__text">
				<span className="kh-notice__title">{title}</span>
				{detail !== undefined && <span className="kh-notice__detail">{detail}</span>}
				{!pressable && action}
			</span>
			{pressable && <Chevron />}
		</Surface>
	);
}
