import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dots } from './Dots';

describe('Dots', () => {
	it('renders web-ui’s two dots, still by default and hidden from assistive tech', () => {
		const { container } = render(<Dots />);
		const dots = container.querySelector('kh-dots');
		expect(dots?.querySelectorAll(':scope > i')).toHaveLength(2);
		expect(dots).not.toHaveAttribute('bouncing');
		expect(dots).toHaveAttribute('aria-hidden', 'true');
	});

	it('bounces on request', () => {
		const { container } = render(<Dots bouncing />);
		expect(container.querySelector('kh-dots')).toHaveAttribute('bouncing', '');
	});
});
