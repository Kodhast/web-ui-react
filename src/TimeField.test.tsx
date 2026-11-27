import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TimeField, type TimeFieldProps } from './TimeField';
import { expectOnlyWebUi } from './noStyle.test-helper';

function Form(props: Partial<TimeFieldProps> & { start?: string }) {
	const [value, setValue] = useState(props.start ?? '08:12');
	return (
		<TimeField
			label="Start"
			{...props}
			value={value}
			onChange={(next) => {
				props.onChange?.(next);
				setValue(next);
			}}
		/>
	);
}

const field = () => screen.getByRole('textbox', { name: 'Start' });

describe('TimeField', () => {
	it('shows the time in a field that cannot be typed in', async () => {
		const user = userEvent.setup();
		const { container } = render(<Form description="När du började" />);
		expect(field()).toHaveValue('08:12');
		expect(field()).toHaveAttribute('readonly');
		expect(field()).toHaveAttribute('aria-haspopup', 'dialog');
		expect(screen.getByText('När du började')).toHaveClass('kh-field__support');
		await user.type(field(), '9');
		expect(field()).toHaveValue('08:12');
		expectOnlyWebUi(container);
	});

	it('opens the wheels with a press, picks with OK and starts on the field’s time', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Form onChange={onChange} />);
		await user.click(field());
		const dialog = screen.getByRole('dialog', { name: 'Start' });
		expect(dialog).toHaveClass('kh-dialog');
		const hour = screen.getByRole('spinbutton', { name: 'Timme' });
		expect(hour).toHaveAttribute('aria-valuetext', '08');
		expect(hour).toHaveFocus();
		await user.keyboard('{ArrowDown}');
		await user.click(screen.getByRole('button', { name: 'OK' }));
		expect(onChange).toHaveBeenCalledWith('09:12');
		expect(field()).toHaveValue('09:12');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('leaves the time with Avbryt', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Form onChange={onChange} />);
		await user.click(screen.getByRole('button', { name: 'Välj tid' }));
		await user.keyboard('{ArrowDown}');
		await user.click(screen.getByRole('button', { name: 'Avbryt' }));
		expect(onChange).not.toHaveBeenCalled();
		expect(field()).toHaveValue('08:12');
	});

	it('opens with Enter from the keyboard and takes a title of its own', async () => {
		const user = userEvent.setup();
		render(<Form pickerTitle="När började du?" />);
		field().focus();
		await user.keyboard('{Enter}');
		expect(screen.getByRole('dialog', { name: 'När började du?' })).toBeInTheDocument();
	});

	it('shows a time between the steps as it is, and picks on a step', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Form start="09:37" step={5} onChange={onChange} />);
		expect(field()).toHaveValue('09:37');
		await user.click(field());
		expect(screen.getByRole('spinbutton', { name: 'Minut' })).toHaveAttribute(
			'aria-valuetext',
			'35'
		);
		await user.click(screen.getByRole('button', { name: 'OK' }));
		expect(onChange).toHaveBeenCalledWith('09:35');
	});

	it('starts the wheels on pickerStart while the field is empty', async () => {
		const user = userEvent.setup();
		render(<Form start="" pickerStart="16:00" />);
		expect(field()).toHaveValue('');
		await user.click(field());
		expect(screen.getByRole('spinbutton', { name: 'Timme' })).toHaveAttribute(
			'aria-valuetext',
			'16'
		);
	});

	it('shows the error instead of the help text', () => {
		render(<Form description="Hjälp" errorMessage="Slutet ligger före starten" />);
		expect(field()).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByText('Slutet ligger före starten')).toHaveClass('kh-field__support--error');
		expect(screen.queryByText('Hjälp')).not.toBeInTheDocument();
	});

	it('does not open while disabled', async () => {
		const user = userEvent.setup();
		render(<Form isDisabled />);
		await user.click(field());
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Välj tid' })).toBeDisabled();
	});
});
