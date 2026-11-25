import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FilterChips } from './FilterChips';
import { expectOnlyWebUi } from './noStyle.test-helper';

const options = [
	{ value: 'tablett', label: 'Tablett' },
	{ value: 'kapsel', label: 'Kapsel' },
	{ value: 'plaster', label: 'Plåster', icon: <svg aria-hidden="true" /> },
	{ value: 'kram', label: 'Kräm', isDisabled: true }
];

function Controlled({ onChange }: { onChange?: (selected: string[]) => void }) {
	const [selected, setSelected] = useState(['tablett']);
	return (
		<FilterChips
			aria-label="Form"
			options={options}
			selected={selected}
			onChange={(next) => {
				setSelected(next);
				onChange?.(next);
			}}
		/>
	);
}

describe('FilterChips', () => {
	it('is kh-chips of kh-chip buttons with aria-pressed', () => {
		render(<FilterChips aria-label="Form" options={options} selected={['tablett']} />);
		const group = screen.getByRole('toolbar', { name: 'Form' });
		expect(group).toHaveAttribute('class', 'kh-chips');
		const chips = screen.getAllByRole('button');
		expect(chips.map((chip) => chip.getAttribute('class'))).toEqual(Array(4).fill('kh-chip'));
		expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual([
			'true',
			'false',
			'false',
			'false'
		]);
		expect(chips[0]!.querySelector('.kh-chip__label')).toHaveTextContent('Tablett');
		expect(chips[2]!.firstElementChild?.tagName).toBe('svg');
		expect(chips[3]).toBeDisabled();
	});

	it('chooses several and gives the list out', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		await user.click(screen.getByRole('button', { name: 'Kapsel' }));
		expect(onChange).toHaveBeenLastCalledWith(['tablett', 'kapsel']);
		await user.click(screen.getByRole('button', { name: 'Tablett' }));
		expect(onChange).toHaveBeenLastCalledWith(['kapsel']);
		expect(screen.getByRole('button', { name: 'Kapsel' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('toggles with space and enter', async () => {
		const user = userEvent.setup();
		render(<Controlled />);
		screen.getByRole('button', { name: 'Kapsel' }).focus();
		await user.keyboard(' ');
		expect(screen.getByRole('button', { name: 'Kapsel' })).toHaveAttribute('aria-pressed', 'true');
		await user.keyboard('{Enter}');
		expect(screen.getByRole('button', { name: 'Kapsel' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('works uncontrolled with defaultSelected', async () => {
		const user = userEvent.setup();
		render(<FilterChips aria-label="Form" options={options} defaultSelected={['kapsel']} />);
		expect(screen.getByRole('button', { name: 'Kapsel' })).toHaveAttribute('aria-pressed', 'true');
		await user.click(screen.getByRole('button', { name: 'Tablett' }));
		expect(screen.getByRole('button', { name: 'Tablett' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('does not choose a disabled chip', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		await user.click(screen.getByRole('button', { name: 'Kräm' }));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('has the count, the emphasized and the pending parts of web-ui', () => {
		render(
			<FilterChips
				aria-label="Läge"
				selected={['huvudvark']}
				options={[
					{ value: 'huvudvark', label: 'Huvudvärk', count: 4, emphasized: true },
					{
						value: 'ipren',
						label: 'Ipren 400 mg',
						icon: <svg aria-hidden="true" />,
						pending: 'från 15:40'
					}
				]}
			/>
		);
		const [emphasized, pending] = screen.getAllByRole('button');
		expect(emphasized).toHaveAttribute('class', 'kh-chip kh-chip--emphasized');
		expect(emphasized!.querySelector('.kh-chip__value')).toHaveTextContent('4');
		expect(pending).toHaveAttribute('class', 'kh-chip kh-chip--pending');
		expect(pending!.querySelector('.kh-chip__pending')).toHaveTextContent('från 15:40');
		expect(pending!.querySelector('.kh-chip__value')).toBeNull();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(
			<FilterChips
				aria-label="A"
				options={[
					...options,
					{ value: 'p', label: 'P', pending: 'snart', emphasized: true, count: 1 }
				]}
				selected={['p']}
			/>
		);
		expectOnlyWebUi(container);
	});
});
