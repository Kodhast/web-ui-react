import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menu, MenuItem, MenuSeparator } from './Menu';
import { expectOnlyWebUi } from './noStyle.test-helper';

/** The toggle event comes a microtask after the popover opens, as in the browser. */
const settle = () => act(() => Promise.resolve());

describe('Menu', () => {
	function Example({ onA = () => {} }: { onA?: () => void }) {
		return (
			<Menu aria-label="Meny" trigger={<button type="button">Öppna</button>}>
				<MenuItem onAction={onA}>Första</MenuItem>
				<MenuSeparator />
				<MenuItem destructive>Andra</MenuItem>
			</Menu>
		);
	}

	it('opens from its button, focuses the first item and moves with the arrows', async () => {
		const { container } = render(<Example />);
		const button = screen.getByRole('button', { name: 'Öppna' });
		const popover = container.querySelector('.kh-menu')!;
		expect(button).toHaveAttribute('popovertarget', popover.id);
		expect(button).toHaveAttribute('aria-haspopup', 'menu');
		expect(button).toHaveAttribute('aria-expanded', 'false');
		expect(popover).toHaveAttribute('popover', 'auto');
		await userEvent.click(button);
		await settle();
		expect(button).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('menuitem', { name: 'Första' })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('menuitem', { name: 'Andra' })).toHaveFocus();
		expect(screen.getByRole('menuitem', { name: 'Andra' })).toHaveClass(
			'kh-menu__item',
			'kh-menu__item--destructive'
		);
		expect(screen.getByRole('separator')).toHaveClass('kh-divider');
		expectOnlyWebUi(container);
	});

	it('closes when an item is chosen, and calls it', async () => {
		const onA = vi.fn();
		const { container } = render(<Example onA={onA} />);
		await userEvent.click(screen.getByRole('button', { name: 'Öppna' }));
		await settle();
		await userEvent.keyboard('{Enter}');
		await settle();
		expect(onA).toHaveBeenCalledOnce();
		expect(container.querySelector('.kh-menu')).not.toHaveAttribute('data-popover-open');
		expect(screen.getByRole('button', { name: 'Öppna' })).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens above with kh-menu--above', () => {
		const { container } = render(
			<Menu aria-label="Meny" above trigger={<button type="button">Öppna</button>}>
				<MenuItem>Ett</MenuItem>
			</Menu>
		);
		expect(container.querySelector('.kh-menu')).toHaveClass('kh-menu', 'kh-menu--above');
	});
});
