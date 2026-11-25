import type { ReactNode } from 'react';
import { cx } from './cx.js';
import { Surface, type PressableProps } from './Surface.js';

export interface CardProps extends PressableProps {
	/**
	 * The app's tone class (e.g. `ton-gron`), which sets `--kh-tone-container` and `--kh-tone-content`.
	 * The card then takes the tone's colours (`kh-card--tone`).
	 */
	tone?: string;
	children: ReactNode;
}

/** web-ui's `.kh-card` (android-ui's AppCard): static, a link (`href`) or a button (`onPress`). */
export function Card({ tone, children, ...press }: CardProps) {
	return (
		<Surface {...press} className={cx('kh-card', tone && 'kh-card--tone', tone)}>
			{children}
		</Surface>
	);
}
