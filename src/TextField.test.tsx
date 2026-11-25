import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('TextField', () => {
	it('has the markup of web-ui: group, field, input, label and suffix', () => {
		const { container } = render(<TextField label="Doshöjning" suffix="mg" defaultValue="25" />);
		const group = container.firstElementChild!;
		expect(group).toHaveAttribute('class', 'kh-field-group');
		const field = group.querySelector('label.kh-field')!;
		expect([...field.children].map((child) => child.className)).toEqual([
			'kh-field__input',
			'kh-field__label',
			'kh-field__suffix'
		]);
		const input = screen.getByRole('textbox', { name: 'Doshöjning' });
		expect(input).toHaveAttribute('placeholder', ' ');
		expect(input).not.toHaveAttribute('aria-invalid');
		expect(group.querySelector('.kh-field__support')).toBeNull();
	});

	it('takes a value in and gives it out', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<TextField label="Namn" defaultValue="Sol" onChange={onChange} />);
		const input = screen.getByRole('textbox', { name: 'Namn' });
		expect(input).toHaveValue('Sol');
		await user.type(input, 'kräm');
		expect(input).toHaveValue('Solkräm');
		expect(onChange).toHaveBeenLastCalledWith('Solkräm');
	});

	it('is controlled by value', async () => {
		const user = userEvent.setup();
		render(<TextField label="Namn" value="Fast" onChange={() => {}} />);
		const input = screen.getByRole('textbox', { name: 'Namn' });
		await user.type(input, 'x');
		expect(input).toHaveValue('Fast');
	});

	it('links the help text with aria-describedby', () => {
		render(<TextField label="Namn" description="Som det står på förpackningen" />);
		const input = screen.getByRole('textbox', { name: 'Namn' });
		expect(input).toHaveAccessibleDescription('Som det står på förpackningen');
		expect(screen.getByText('Som det står på förpackningen')).toHaveAttribute(
			'class',
			'kh-field__support'
		);
	});

	it('marks the field invalid and shows the error instead of the help text', () => {
		render(<TextField label="Styrka" description="Hjälp" errorMessage="Ange en styrka" />);
		const input = screen.getByRole('textbox', { name: 'Styrka' });
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAccessibleDescription('Ange en styrka');
		expect(screen.getByText('Ange en styrka')).toHaveAttribute(
			'class',
			'kh-field__support kh-field__support--error'
		);
		expect(screen.queryByText('Hjälp')).toBeNull();
	});

	it('is a textarea when multiline', () => {
		render(<TextField label="Anteckning" multiline defaultValue="Smörj in" />);
		const area = screen.getByRole('textbox', { name: 'Anteckning' });
		expect(area.tagName).toBe('TEXTAREA');
		expect(area).toHaveAttribute('class', 'kh-field__input');
		expect(area).toHaveValue('Smörj in');
	});

	it('disables the input', () => {
		render(<TextField label="Namn" isDisabled />);
		expect(screen.getByRole('textbox', { name: 'Namn' })).toBeDisabled();
	});

	it('has an icon button last in the field that presses without focusing the input', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		const { container } = render(
			<TextField
				label="När är visningen?"
				action={{ icon: <svg aria-hidden="true" />, label: 'Välj dag och tid', onPress }}
			/>
		);
		const button = screen.getByRole('button', { name: 'Välj dag och tid' });
		expect(button).toHaveAttribute('class', 'kh-icon-btn');
		expect(container.querySelector('.kh-field')?.lastElementChild).toBe(button);
		await user.click(button);
		expect(onPress).toHaveBeenCalledOnce();
	});

	it('focuses the input when the field around it is clicked', async () => {
		const user = userEvent.setup();
		const { container } = render(<TextField label="Namn" suffix="mg" />);
		await user.click(container.querySelector('.kh-field__suffix')!);
		expect(screen.getByRole('textbox', { name: 'Namn' })).toHaveFocus();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(
			<>
				<TextField label="A" suffix="mg" description="a" />
				<TextField label="B" errorMessage="b" multiline />
				<TextField
					label="C"
					isDisabled
					action={{ icon: <svg aria-hidden="true" />, label: 'x', onPress: () => {} }}
				/>
			</>
		);
		expectOnlyWebUi(container);
	});
});
