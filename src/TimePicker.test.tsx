import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';
import { expectOnlyWebUi } from './noStyle.test-helper';

function Controlled({
	start,
	step,
	accept = () => true
}: {
	start: string;
	step?: number;
	accept?: (v: string) => boolean;
}) {
	const [value, setValue] = useState(start);
	return (
		<>
			<TimePicker value={value} step={step} onChange={(next) => accept(next) && setValue(next)} />
			<output>{value}</output>
		</>
	);
}

const hour = () => screen.getByRole('spinbutton', { name: 'Timme' });
const minute = () => screen.getByRole('spinbutton', { name: 'Minut' });

describe('TimePicker', () => {
	it('shows the time on two wheels with web-ui classes only', () => {
		const { container } = render(<TimePicker value="07:30" onChange={() => {}} />);
		expect(hour()).toHaveAttribute('aria-valuetext', '07');
		expect(minute()).toHaveAttribute('aria-valuetext', '30');
		expect(hour()).toHaveAttribute('aria-valuemax', '23');
		expect(minute()).toHaveAttribute('aria-valuemax', '59');
		expect(container.firstElementChild).toHaveClass('kh-time-picker');
		expectOnlyWebUi(container);
	});

	it('moves with the arrow keys and goes round', async () => {
		const user = userEvent.setup();
		render(<Controlled start="23:00" />);
		hour().focus();
		await user.keyboard('{ArrowDown}');
		expect(screen.getByRole('status')).toHaveTextContent('00:00');
		minute().focus();
		await user.keyboard('{ArrowUp}');
		expect(screen.getByRole('status')).toHaveTextContent('00:59');
		expect(minute()).toHaveAttribute('aria-valuetext', '59');
	});

	it('steps the minute wheel and rounds a time between the steps to the nearest', async () => {
		const user = userEvent.setup();
		render(<Controlled start="07:38" step={15} />);
		expect(minute()).toHaveAttribute('aria-valuetext', '45');
		expect(minute()).toHaveAttribute('aria-valuemax', '45');
		minute().focus();
		await user.keyboard('{ArrowDown}');
		// The wheels are separate, as kh.js: the minute goes round without moving the hour.
		expect(screen.getByRole('status')).toHaveTextContent('07:00');
	});

	it('takes a press on a number', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<TimePicker value="07:30" onChange={onChange} />);
		const items = hour().querySelectorAll('.kh-time-picker__item');
		const eight = [...items].find((item, i) => i > 24 && item.textContent === '08');
		await user.click(eight as Element);
		expect(onChange).toHaveBeenCalledWith('08:30');
	});

	it('stays on the app’s value when the app keeps the old time', async () => {
		const user = userEvent.setup();
		render(<Controlled start="07:30" accept={() => false} />);
		hour().focus();
		await user.keyboard('{ArrowDown}');
		expect(hour()).toHaveAttribute('aria-valuetext', '07');
		expect(screen.getByRole('status')).toHaveTextContent('07:30');
	});

	describe('when the wheel scrolls', () => {
		// jsdom has no layout: give the numbers a height and let scrollTo move the wheel.
		const PITCH = 40;
		const scrollTo = Element.prototype.scrollTo;
		afterEach(() => {
			vi.restoreAllMocks();
			Element.prototype.scrollTo = scrollTo;
		});
		const withLayout = () => {
			vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(PITCH);
			Element.prototype.scrollTo = function (this: Element, options?: ScrollToOptions | number) {
				if (typeof options === 'object') this.scrollTop = options.top ?? this.scrollTop;
			};
		};
		const stopOn = (wheel: HTMLElement, position: number) => {
			wheel.scrollTop = position * PITCH;
			fireEvent(wheel, new Event('scrollend'));
		};

		it('reports where the user stopped it', () => {
			withLayout();
			const onChange = vi.fn();
			render(<TimePicker value="07:30" onChange={onChange} />);
			fireEvent.wheel(hour());
			stopOn(hour(), 24 * 3 + 9);
			expect(onChange).toHaveBeenCalledWith('09:30');
		});

		it('does not report where its own scroll to the value stopped', () => {
			withLayout();
			const onChange = vi.fn();
			render(<TimePicker value="07:30" onChange={onChange} />);
			// Quick arrow presses cut the wheel's scroll short, between two numbers.
			stopOn(hour(), 24 * 3 + 9);
			expect(onChange).not.toHaveBeenCalled();
			expect((hour().scrollTop / PITCH) % 24).toBe(7);
		});
	});
});
