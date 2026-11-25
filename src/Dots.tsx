import { createElement, type ReactElement } from 'react';

/**
 * Kodhast's two dots (BrandDots) as web-ui's `<kh-dots>`. The two `<i>` are rendered here, so the
 * dots look right without kh.js; kh.js, when an app loads it, finds them and adds nothing.
 */
export function Dots({ bouncing = false }: { bouncing?: boolean }): ReactElement {
	return createElement(
		'kh-dots',
		{ bouncing: bouncing ? '' : undefined, 'aria-hidden': 'true' },
		createElement('i'),
		createElement('i')
	);
}
