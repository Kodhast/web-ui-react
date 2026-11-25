import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch, SwitchRow } from './Switch';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('Switch', () => {
	it("is web-ui's input with role switch", () => {
		render(<Switch aria-label="Påminnelser" />);
		const control = screen.getByRole('switch', { name: 'Påminnelser' });
		expect(control.tagName).toBe('INPUT');
		expect(control).toHaveAttribute('class', 'kh-switch');
		expect(control).not.toBeChecked();
	});

	it('toggles with space and reports the value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Switch aria-label="Påminnelser" onChange={onChange} />);
		const control = screen.getByRole('switch', { name: 'Påminnelser' });
		await user.tab();
		expect(control).toHaveFocus();
		await user.keyboard(' ');
		expect(control).toBeChecked();
		expect(onChange).toHaveBeenLastCalledWith(true);
		await user.keyboard(' ');
		expect(control).not.toBeChecked();
		expect(onChange).toHaveBeenLastCalledWith(false);
	});

	it('is controlled by isSelected', async () => {
		const user = userEvent.setup();
		render(<Switch aria-label="Fast" isSelected onChange={() => {}} />);
		const control = screen.getByRole('switch', { name: 'Fast' });
		await user.click(control);
		expect(control).toBeChecked();
	});

	it('does not toggle when disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Switch aria-label="Låst" isDisabled onChange={onChange} />);
		const control = screen.getByRole('switch', { name: 'Låst' });
		expect(control).toBeDisabled();
		await user.click(control);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('SwitchRow', () => {
	it('has the markup of web-ui: a label row with the text and the switch last', () => {
		const { container } = render(
			<SwitchRow title="Påminnelser" subtitle="Varje dag 08:00" defaultSelected />
		);
		const row = container.firstElementChild!;
		expect(row.tagName).toBe('LABEL');
		expect(row).toHaveAttribute('class', 'kh-row kh-switch-row');
		expect([...row.children].map((child) => child.className)).toEqual([
			'kh-row__text',
			'kh-switch'
		]);
		expect(row.querySelector('.kh-row__title')).toHaveTextContent('Påminnelser');
		expect(row.querySelector('.kh-row__subtitle')).toHaveTextContent('Varje dag 08:00');
		expect(screen.getByRole('switch', { name: /Påminnelser/ })).toBeChecked();
	});

	it('leaves out the subtitle when not given', () => {
		const { container } = render(<SwitchRow title="Kvällsdos" />);
		expect(container.querySelector('.kh-row__subtitle')).toBeNull();
	});

	it('toggles when the text is pressed, as the whole row is the label', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SwitchRow title="Kvällsdos" onChange={onChange} />);
		await user.click(screen.getByText('Kvällsdos'));
		expect(screen.getByRole('switch')).toBeChecked();
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('toggles with space on the switch', async () => {
		const user = userEvent.setup();
		render(<SwitchRow title="Kvällsdos" />);
		await user.tab();
		await user.keyboard(' ');
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('dims the text with inactive but leaves the switch usable', async () => {
		const user = userEvent.setup();
		const { container } = render(<SwitchRow title="Mående" subtitle="Av" inactive />);
		expect(container.firstElementChild).toHaveAttribute(
			'class',
			'kh-row kh-switch-row kh-switch-row--inactive'
		);
		await user.click(screen.getByText('Mående'));
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('does not toggle when disabled', async () => {
		const user = userEvent.setup();
		render(<SwitchRow title="Låst" isDisabled />);
		await user.click(screen.getByText('Låst'));
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(
			<>
				<Switch aria-label="A" />
				<SwitchRow title="B" subtitle="b" />
				<SwitchRow title="C" inactive isDisabled />
			</>
		);
		expectOnlyWebUi(container);
	});
});
