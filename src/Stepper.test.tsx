import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';
import { expectOnlyWebUi } from './noStyle.test-helper';

const minus = () => screen.getByRole('button', { name: 'Minska doser per dag' });
const plus = () => screen.getByRole('button', { name: 'Öka doser per dag' });

describe('Stepper', () => {
	it('has the markup of web-ui: minus, value and plus in a kh-stepper', () => {
		const { container } = render(<Stepper label="doser per dag" defaultValue={2} />);
		const stepper = container.querySelector('kh-stepper')!;
		const visible = [...stepper.children].filter((child) => !child.hasAttribute('hidden'));
		expect(visible.map((child) => child.className)).toEqual([
			'kh-stepper__button kh-stepper__button--decrease',
			'kh-stepper__value',
			'kh-stepper__button kh-stepper__button--increase'
		]);
		expect(visible[1]!.tagName).toBe('OUTPUT');
		expect(visible[1]).toHaveTextContent('2');
	});

	it('names the buttons from the label', () => {
		render(<Stepper label="doser per dag" defaultValue={2} />);
		expect(minus()).toBeInTheDocument();
		expect(plus()).toBeInTheDocument();
	});

	it('steps up and down and gives the value out', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Stepper label="doser per dag" defaultValue={2} onChange={onChange} />);
		await user.click(plus());
		expect(onChange).toHaveBeenLastCalledWith(3);
		await user.click(minus());
		await user.click(minus());
		expect(onChange).toHaveBeenLastCalledWith(1);
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('1');
	});

	it('is controlled by value', async () => {
		const user = userEvent.setup();
		function Controlled() {
			const [value, setValue] = useState(4);
			return <Stepper label="doser per dag" value={value} onChange={setValue} />;
		}
		render(<Controlled />);
		await user.click(plus());
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('5');
	});

	it('steps by step', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Stepper label="doser per dag" defaultValue={10} step={5} onChange={onChange} />);
		await user.click(plus());
		expect(onChange).toHaveBeenLastCalledWith(15);
	});

	it('disables the button at each limit', async () => {
		const user = userEvent.setup();
		render(<Stepper label="doser per dag" defaultValue={1} min={0} max={2} />);
		expect(minus()).toBeEnabled();
		expect(plus()).toBeEnabled();
		await user.click(minus());
		expect(minus()).toBeDisabled();
		expect(plus()).toBeEnabled();
		await user.click(plus());
		await user.click(plus());
		expect(plus()).toBeDisabled();
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('2');
	});

	it('is reached by tab and pressed with space and enter', async () => {
		const user = userEvent.setup();
		render(<Stepper label="doser per dag" defaultValue={2} />);
		await user.tab();
		expect(minus()).toHaveFocus();
		await user.keyboard(' ');
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('1');
		await user.tab();
		expect(plus()).toHaveFocus();
		await user.keyboard('{Enter}');
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('2');
	});

	it('shows the value as formatOptions say', () => {
		render(
			<Stepper
				label="doser per dag"
				defaultValue={2.5}
				step={0.5}
				formatOptions={{ minimumFractionDigits: 1 }}
			/>
		);
		expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('2.5');
	});

	it('disables both buttons when disabled', () => {
		render(<Stepper label="doser per dag" defaultValue={2} isDisabled />);
		expect(minus()).toBeDisabled();
		expect(plus()).toBeDisabled();
	});

	it('shows the label beside it with showLabel, hidden from screen readers', () => {
		const { container } = render(<Stepper label="doser per dag" defaultValue={2} showLabel />);
		const field = container.firstElementChild!;
		expect(field).toHaveAttribute('class', 'kh-stepper-field');
		const label = field.querySelector('.kh-stepper-field__label')!;
		expect(label).toHaveTextContent('doser per dag');
		expect(label).toHaveAttribute('aria-hidden', 'true');
		expect(field.querySelector('kh-stepper')).not.toBeNull();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(
			<>
				<Stepper label="a" defaultValue={1} min={0} max={3} />
				<Stepper label="b" defaultValue={1} showLabel isDisabled />
			</>
		);
		expectOnlyWebUi(container);
	});
});
