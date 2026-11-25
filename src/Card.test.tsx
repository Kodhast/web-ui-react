import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('Card', () => {
	it('is a plain kh-card by default', () => {
		const { container } = render(<Card>Innehåll</Card>);
		const card = container.firstElementChild;
		expect(card?.tagName).toBe('DIV');
		expect(card).toHaveAttribute('class', 'kh-card');
	});

	it('takes the tone class with kh-card--tone', () => {
		const { container } = render(<Card tone="ton-gron">Klart</Card>);
		expect(container.firstElementChild).toHaveAttribute('class', 'kh-card kh-card--tone ton-gron');
	});

	it('is a link with href', () => {
		render(<Card href="/resa">Resa till Kreta</Card>);
		const link = screen.getByRole('link', { name: 'Resa till Kreta' });
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', '/resa');
		expect(link).toHaveAttribute('class', 'kh-card');
	});

	it('is a button with onPress, pressed by mouse and keyboard', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Card onPress={onPress} aria-label="Öppna">
				<svg aria-hidden="true" />
			</Card>
		);
		const button = screen.getByRole('button', { name: 'Öppna' });
		expect(button.tagName).toBe('BUTTON');
		await user.click(button);
		button.focus();
		await user.keyboard('{Enter}');
		expect(onPress).toHaveBeenCalledTimes(2);
	});

	it('sets no style and no class outside web-ui and the tone', () => {
		const { container } = render(
			<>
				<Card tone="ton-gron">A</Card>
				<Card href="#">B</Card>
				<Card onPress={() => {}}>C</Card>
			</>
		);
		expectOnlyWebUi(container, ['ton-gron']);
	});
});
