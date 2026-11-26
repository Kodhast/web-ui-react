import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';
import { expectOnlyWebUi } from './noStyle.test-helper';

const Svg = ({ id }: { id: string }) => <svg data-testid={id} aria-hidden="true" />;

describe('Chip', () => {
	it('is a button with the label between the icons, and no pressed state', () => {
		render(
			<Chip icon={<Svg id="fore" />} trailing={<Svg id="efter" />}>
				Utveckling
			</Chip>
		);
		const button = screen.getByRole('button', { name: 'Utveckling' });
		expect(button).toHaveAttribute('class', 'kh-chip');
		expect(button).not.toHaveAttribute('aria-pressed');
		const [before, label, after] = button.children;
		expect(before).toBe(screen.getByTestId('fore'));
		expect(label).toHaveAttribute('class', 'kh-chip__label');
		expect(label).toHaveTextContent('Utveckling');
		expect(after).toBe(screen.getByTestId('efter'));
	});

	it('is pressed with a click and the keyboard, and takes a fuller name', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Chip onPress={onPress} aria-label="Byt tidkod, nu Utveckling">
				Utveckling
			</Chip>
		);
		const button = screen.getByRole('button', { name: 'Byt tidkod, nu Utveckling' });
		await user.click(button);
		button.focus();
		await user.keyboard('{Enter}');
		expect(onPress).toHaveBeenCalledTimes(2);
	});

	it('is not pressed when disabled', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Chip onPress={onPress} isDisabled>
				Utveckling
			</Chip>
		);
		const button = screen.getByRole('button', { name: 'Utveckling' });
		expect(button).toBeDisabled();
		await user.click(button);
		expect(onPress).not.toHaveBeenCalled();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(<Chip icon={<svg />}>A</Chip>);
		expectOnlyWebUi(container);
	});
});
