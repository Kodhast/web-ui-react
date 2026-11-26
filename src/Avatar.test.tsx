import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, initials } from './Avatar';
import { expectOnlyWebUi } from './noStyle.test-helper';

const anna = { photoUrl: 'https://exempel.se/a.png' };

describe('Avatar', () => {
	it('shows the initials of the first and last word, else a person', () => {
		expect(initials('Anna Maria Berg')).toBe('AB');
		expect(initials('mats@exempel.se')).toBe('M');
		expect(initials('  ')).toBeNull();
		const { container, rerender } = render(<Avatar name="Anna Berg" />);
		expect(container.querySelector('.kh-avatar__circle')).toHaveTextContent('AB');
		rerender(<Avatar />);
		expect(container.querySelector('.kh-avatar__circle > svg')).not.toBeNull();
		expect(container.querySelector('.kh-avatar')).toHaveAttribute('aria-hidden', 'true');
	});

	it('lays the picture over the initials, and drops a picture that does not load', () => {
		const { container } = render(<Avatar name="Anna Berg" photoUrl={anna.photoUrl} />);
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
		expect(img).toHaveAttribute('alt', '');
		expect(container.querySelector('.kh-avatar__circle')).toHaveTextContent('AB');
		fireEvent.error(img!);
		expect(container.querySelector('img')).toBeNull();
		expect(container.querySelector('.kh-avatar__circle')).toHaveTextContent('AB');
	});

	it('is a button with onPress, with the dot when online', async () => {
		const onPress = vi.fn();
		const { container } = render(
			<Avatar name="Anna" online onPress={onPress} aria-label="Konto" />
		);
		const button = screen.getByRole('button', { name: 'Konto' });
		expect(button).toHaveClass('kh-avatar', 'kh-avatar--online');
		await userEvent.click(button);
		expect(onPress).toHaveBeenCalledOnce();
		expectOnlyWebUi(container);
	});
});
