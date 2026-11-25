import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pill, Pills } from './Pill';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('Pill', () => {
	it('is a span with the tone and square classes', () => {
		const { container } = render(
			<Pills>
				<Pill>3 kvar</Pill>
				<Pill tone="ton-varning" square>
					Ej skickad
				</Pill>
			</Pills>
		);
		expect(container.firstElementChild).toHaveAttribute('class', 'kh-pills');
		const [plain, toned] = container.querySelectorAll('span');
		expect(plain).toHaveAttribute('class', 'kh-pill');
		expect(toned).toHaveAttribute('class', 'kh-pill kh-pill--square ton-varning');
	});

	it('is a button with onPress', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(<Pill onPress={onPress}>Vecka</Pill>);
		const button = screen.getByRole('button', { name: 'Vecka' });
		expect(button).toHaveAttribute('class', 'kh-pill');
		await user.click(button);
		button.focus();
		await user.keyboard(' ');
		expect(onPress).toHaveBeenCalledTimes(2);
	});

	it('sets no style and no class outside web-ui and the tone', () => {
		const { container } = render(
			<Pills>
				<Pill tone="ton-gron">A</Pill>
				<Pill onPress={() => {}}>B</Pill>
			</Pills>
		);
		expectOnlyWebUi(container, ['ton-gron']);
	});
});
