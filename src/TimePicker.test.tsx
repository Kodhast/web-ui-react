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

		// A mouse event at `y` and time `t` ms (jsdom's own clock would make every drag a fling).
		const mouse = (wheel: HTMLElement, type: string, y: number, t: number) => {
			const event = new MouseEvent(type, {
				bubbles: true,
				cancelable: true,
				button: 0,
				clientY: y
			});
			Object.defineProperties(event, {
				pointerType: { value: 'mouse' },
				pointerId: { value: 1 },
				timeStamp: { value: t }
			});
			fireEvent(wheel, event);
		};

		it('follows a mouse drag with the snap off, and reports where it stopped', () => {
			withLayout();
			const onChange = vi.fn();
			render(<TimePicker value="07:30" onChange={onChange} />);
			const start = minute().scrollTop;
			mouse(minute(), 'pointerdown', 200, 0);
			mouse(minute(), 'pointermove', 202, 10);
			expect(minute()).not.toHaveClass('kh-time-picker__wheel--dragging');
			mouse(minute(), 'pointermove', 200 - 3 * PITCH, 400);
			expect(minute()).toHaveClass('kh-time-picker__wheel--dragging');
			expect(minute().scrollTop).toBe(start + 3 * PITCH);
			// Let go after a pause: no fling, the wheel stays on the number.
			mouse(minute(), 'pointerup', 200 - 3 * PITCH, 800);
			expect(minute()).not.toHaveClass('kh-time-picker__wheel--dragging');
			expect(onChange).toHaveBeenCalledWith('07:33');
			expectOnlyWebUi(minute().parentElement!.parentElement!);
		});

		it('glides on after a fling, and keeps the snap off until it stops', () => {
			withLayout();
			const onChange = vi.fn();
			render(<TimePicker value="07:30" onChange={onChange} />);
			const start = minute().scrollTop;
			mouse(minute(), 'pointerdown', 200, 0);
			mouse(minute(), 'pointermove', 200 - PITCH, 20);
			mouse(minute(), 'pointermove', 200 - 2 * PITCH, 40);
			mouse(minute(), 'pointerup', 200 - 2 * PITCH, 45);
			// 2 numbers in 40 ms: 2 px/ms × 320 ms = 16 numbers more.
			expect(minute().scrollTop).toBe(start + 18 * PITCH);
			expect(minute()).toHaveClass('kh-time-picker__wheel--dragging');
			fireEvent(minute(), new Event('scrollend'));
			expect(minute()).not.toHaveClass('kh-time-picker__wheel--dragging');
			expect(onChange).toHaveBeenCalledWith('07:48');
		});

		it('takes a mouse press without a drag as a press on the number under it', () => {
			withLayout();
			const onChange = vi.fn();
			render(<TimePicker value="07:30" onChange={onChange} />);
			// The wheel shows three numbers with its top at 0: the one below the middle (08) is at 2.5 pitches.
			vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(3 * PITCH);
			mouse(hour(), 'pointerdown', PITCH * 2.5, 0);
			mouse(hour(), 'pointerup', PITCH * 2.5 + 1, 80);
			expect(onChange).toHaveBeenCalledWith('08:30');
		});
	});
});
