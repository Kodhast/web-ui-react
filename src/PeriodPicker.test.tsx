import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PeriodPicker } from './PeriodPicker';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('PeriodPicker', () => {
	it("renders web-ui's kh-period: arrows, and the label with its icon and text", () => {
		const { container } = render(<PeriodPicker label="Vecka 47 · 16–22 nov" aria-label="Vecka" />);
		const group = screen.getByRole('group', { name: 'Vecka' });
		expect(group).toHaveClass('kh-period');
		const [previous, label, next] = screen.getAllByRole('button');
		expect(previous).toHaveAccessibleName('Föregående');
		expect(previous).toHaveClass('kh-icon-btn', 'kh-period__prev');
		expect(label).toHaveClass('kh-period__label');
		expect(label).toHaveAccessibleName('Vecka 47 · 16–22 nov');
		expect(label?.querySelector(':scope > svg')).toHaveAttribute('aria-hidden', 'true');
		expect(label?.querySelector(':scope > span')).toHaveTextContent('Vecka 47 · 16–22 nov');
		expect(next).toHaveAccessibleName('Nästa');
		expect(next).toHaveClass('kh-icon-btn', 'kh-period__next');
		expectOnlyWebUi(container);
	});

	it('steps back and forward, and presses the label', async () => {
		const user = userEvent.setup();
		const onPrevious = vi.fn();
		const onNext = vi.fn();
		const onLabelPress = vi.fn();
		render(
			<PeriodPicker
				label="Tisdag 24 november"
				previousLabel="Föregående dag"
				nextLabel="Nästa dag"
				onPrevious={onPrevious}
				onNext={onNext}
				onLabelPress={onLabelPress}
			/>
		);
		await user.click(screen.getByRole('button', { name: 'Föregående dag' }));
		await user.click(screen.getByRole('button', { name: 'Nästa dag' }));
		await user.click(screen.getByRole('button', { name: 'Nästa dag' }));
		await user.click(screen.getByRole('button', { name: 'Tisdag 24 november' }));
		expect(onPrevious).toHaveBeenCalledOnce();
		expect(onNext).toHaveBeenCalledTimes(2);
		expect(onLabelPress).toHaveBeenCalledOnce();
	});

	it('a disabled arrow does not step', async () => {
		const user = userEvent.setup();
		const onNext = vi.fn();
		render(<PeriodPicker label="Idag" onNext={onNext} isNextDisabled />);
		const next = screen.getByRole('button', { name: 'Nästa' });
		expect(next).toBeDisabled();
		await user.click(next);
		expect(onNext).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Föregående' })).toBeEnabled();
	});
});
