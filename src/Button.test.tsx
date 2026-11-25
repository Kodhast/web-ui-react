import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClass, type ButtonVariant } from './Button';

const Icon = () => (
	<svg aria-hidden="true">
		<path d="M0 0h1" />
	</svg>
);

describe('Button', () => {
	it('presses with the mouse, Enter and Space', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(<Button onPress={onPress}>Spara</Button>);
		const button = screen.getByRole('button', { name: 'Spara' });

		await user.click(button);
		button.focus();
		await user.keyboard('{Enter}');
		await user.keyboard(' ');

		expect(onPress).toHaveBeenCalledTimes(3);
	});

	it('is a plain button that does not submit a form by default', () => {
		render(<Button>Spara</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('ignores presses when disabled and is natively disabled', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Button isDisabled onPress={onPress}>
				Spara
			</Button>
		);
		const button = screen.getByRole('button');

		await user.click(button);

		expect(onPress).not.toHaveBeenCalled();
		expect(button).toBeDisabled();
		expect(button).not.toHaveAttribute('aria-busy');
	});

	it('works with dots in place of the icon, keeps focus and ignores presses while pending', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Button variant="primary" isPending onPress={onPress} icon={<Icon />}>
				Sparar
			</Button>
		);
		const button = screen.getByRole('button', { name: 'Sparar' });

		await user.click(button);
		button.focus();
		await user.keyboard('{Enter}');

		expect(onPress).not.toHaveBeenCalled();
		expect(button).toHaveAttribute('aria-busy', 'true');
		// Busy, not off: still focusable, so focus does not jump away while it works.
		expect(button).not.toBeDisabled();
		expect(button).toHaveFocus();
		const dots = button.querySelector('kh-dots');
		expect(dots).toHaveAttribute('bouncing');
		expect(dots?.querySelectorAll('i')).toHaveLength(2);
		expect(button.querySelector('svg')).toBeNull();
		expect(button.firstElementChild?.tagName).toBe('KH-DOTS');
	});

	it('keeps a lone text label while pending', () => {
		render(<Button isPending>Hämtar</Button>);
		expect(screen.getByRole('button')).toHaveTextContent('Hämtar');
	});

	it('shows the icon and no dots when not pending', () => {
		render(<Button icon={<Icon />}>Lägg till</Button>);
		const button = screen.getByRole('button');
		expect(button.querySelector('svg')).not.toBeNull();
		expect(button.querySelector('kh-dots')).toBeNull();
	});

	it.each<[ButtonVariant, string]>([
		['tonal', 'kh-btn'],
		['primary', 'kh-btn kh-btn--primary'],
		['outlined', 'kh-btn kh-btn--outlined'],
		['text', 'kh-btn kh-btn--text'],
		['destructive', 'kh-btn kh-btn--destructive'],
		['destructiveText', 'kh-btn kh-btn--destructive-text']
	])('variant %s sets %s', (variant, expected) => {
		render(<Button variant={variant}>Knapp</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('class', expected);
	});

	it('is tonal without modifiers by default, and adds compact and block', () => {
		render(
			<>
				<Button>A</Button>
				<Button compact block variant="primary">
					B
				</Button>
			</>
		);
		expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('class', 'kh-btn');
		expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute(
			'class',
			'kh-btn kh-btn--primary kh-btn--compact kh-btn--block'
		);
	});

	it('has no inline style and no class outside web-ui in any state', () => {
		const { container } = render(
			<>
				<Button>A</Button>
				<Button isDisabled>B</Button>
				<Button isPending>C</Button>
				<Button variant="destructiveText" compact block>
					D
				</Button>
			</>
		);
		for (const element of container.querySelectorAll('*')) {
			expect(element).not.toHaveAttribute('style');
			for (const name of element.classList) expect(name).toMatch(/^kh-/);
		}
	});
});

describe('buttonClass', () => {
	it('gives the same classes for a link that must look like a button', () => {
		expect(buttonClass()).toBe('kh-btn');
		expect(buttonClass({ variant: 'text', compact: true })).toBe(
			'kh-btn kh-btn--text kh-btn--compact'
		);
	});
});
