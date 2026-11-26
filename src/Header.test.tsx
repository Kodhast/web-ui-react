import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';
import { expectOnlyWebUi } from './noStyle.test-helper';

const Logo = (props: { className?: string }) => (
	<svg {...props} aria-hidden="true">
		<path d="M0 0h1" />
	</svg>
);

describe('Header', () => {
	it("renders web-ui's kh-header with its parts", () => {
		const { container } = render(
			<Header
				icon={<Logo />}
				name="Tidrapporten"
				title="Idag"
				subtitle="Vecka 48"
				trailing={<button type="button">Konto</button>}
				dots
			/>
		);
		const header = container.querySelector('kh-header');
		expect(header).not.toBeNull();
		expect(header?.querySelector(':scope > svg')).toHaveAttribute('class', 'kh-header__icon');
		expect(header?.querySelector(':scope > .kh-header__name')).toHaveTextContent('Tidrapporten');
		expect(header?.querySelector(':scope > .kh-header__trailing')).toContainElement(
			screen.getByRole('button', { name: 'Konto' })
		);
		expect(screen.getByRole('heading', { level: 1, name: 'Idag' })).toHaveClass('kh-header__title');
		expect(header?.querySelector('.kh-header__title > kh-dots')).not.toHaveAttribute('bouncing');
		expect(header?.querySelectorAll('kh-dots > i')).toHaveLength(2);
		expect(header?.querySelector(':scope > p.kh-header__subtitle')).toHaveTextContent('Vecka 48');
	});

	it("keeps the icon's own class", () => {
		const { container } = render(<Header icon={<Logo className="egen" />} title="Idag" />);
		expect(container.querySelector('svg')).toHaveAttribute('class', 'kh-header__icon egen');
	});

	it('leaves out the parts that are not given, and bounces the dots', () => {
		const { container, rerender } = render(<Header title="Veckan" />);
		const header = container.querySelector('kh-header');
		expect(header?.children).toHaveLength(1);
		expect(header?.querySelector('kh-dots')).toBeNull();
		rerender(<Header title="Veckan" bouncing />);
		expect(header?.querySelector('kh-dots')).toHaveAttribute('bouncing');
	});

	it('leaves the collapse to the CSS: no data-raised and no style', () => {
		const { container } = render(
			<Header icon={<Logo />} name="Tidrapporten" title="Idag" subtitle="Vecka 48" bouncing />
		);
		expect(container.querySelector('kh-header')).not.toHaveAttribute('data-raised');
		expectOnlyWebUi(container);
	});
});
