import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedChoice } from './SegmentedChoice';
import { expectOnlyWebUi } from './noStyle.test-helper';

const options = [
	{ value: 'ljust', label: 'Ljust' },
	{ value: 'morkt', label: 'Mörkt' },
	{ value: 'system', label: 'System' }
];

function Controlled({ onChange }: { onChange?: (value: string) => void }) {
	const [value, setValue] = useState('system');
	return (
		<SegmentedChoice
			aria-label="Tema"
			options={options}
			value={value}
			onChange={(next) => {
				setValue(next);
				onChange?.(next);
			}}
		/>
	);
}

const checked = () =>
	screen.getAllByRole('radio').filter((radio) => radio.getAttribute('aria-checked') === 'true');

describe('SegmentedChoice', () => {
	it('is a radio group of the options with kh-segmented and aria-checked', () => {
		const { container } = render(
			<SegmentedChoice aria-label="Tema" options={options} value="morkt" />
		);
		const group = screen.getByRole('radiogroup', { name: 'Tema' });
		expect(group).toHaveAttribute('class', 'kh-segmented');
		expect([...group.children]).toEqual(screen.getAllByRole('radio'));
		expect(checked().map((radio) => radio.textContent)).toEqual(['Mörkt']);
		expectOnlyWebUi(container);
	});

	it('gives the value out when a segment is pressed', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		await user.click(screen.getByRole('radio', { name: 'Ljust' }));
		expect(onChange).toHaveBeenCalledExactlyOnceWith('ljust');
		expect(checked().map((radio) => radio.textContent)).toEqual(['Ljust']);
	});

	it('keeps the old choice when the parent does not take the new one', async () => {
		const user = userEvent.setup();
		render(
			<SegmentedChoice aria-label="Tema" options={options} value="system" onChange={() => {}} />
		);
		await user.click(screen.getByRole('radio', { name: 'Ljust' }));
		expect(checked().map((radio) => radio.textContent)).toEqual(['System']);
	});

	it('does not leave the choice when the chosen segment is pressed again', async () => {
		const user = userEvent.setup();
		render(<Controlled />);
		await user.click(screen.getByRole('radio', { name: 'System' }));
		expect(checked().map((radio) => radio.textContent)).toEqual(['System']);
	});

	it('works uncontrolled with defaultValue', async () => {
		const user = userEvent.setup();
		render(<SegmentedChoice aria-label="Tema" options={options} defaultValue="ljust" />);
		expect(checked().map((radio) => radio.textContent)).toEqual(['Ljust']);
		await user.click(screen.getByRole('radio', { name: 'Mörkt' }));
		expect(checked().map((radio) => radio.textContent)).toEqual(['Mörkt']);
	});

	it('moves the choice with the arrow keys, as the focus moves', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		screen.getByRole('radio', { name: 'System' }).focus();
		await user.keyboard('{ArrowLeft}');
		expect(screen.getByRole('radio', { name: 'Mörkt' })).toHaveFocus();
		expect(onChange).toHaveBeenLastCalledWith('morkt');
		await user.keyboard('{ArrowLeft}');
		expect(onChange).toHaveBeenLastCalledWith('ljust');
		await user.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenLastCalledWith('morkt');
		expect(checked().map((radio) => radio.textContent)).toEqual(['Mörkt']);
	});

	it('does not choose anything by tabbing into the group', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<>
				<button>Före</button>
				<Controlled onChange={onChange} />
			</>
		);
		await user.tab();
		await user.tab();
		expect(screen.getAllByRole('radio').some((radio) => radio === document.activeElement)).toBe(
			true
		);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not choose a disabled segment', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<SegmentedChoice
				aria-label="Tema"
				options={[options[0]!, { ...options[1]!, isDisabled: true }]}
				value="ljust"
				onChange={onChange}
			/>
		);
		const disabled = screen.getByRole('radio', { name: 'Mörkt' });
		expect(disabled).toBeDisabled();
		await user.click(disabled);
		expect(onChange).not.toHaveBeenCalled();
	});
});
