import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Row } from './Row';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('Row', () => {
	it('has title and subtitle in kh-row__text', () => {
		const { container } = render(<Row title="08:05–09:00" subtitle="Uppdrag A · Möten" />);
		const row = container.firstElementChild;
		expect(row).toHaveAttribute('class', 'kh-row');
		expect(row?.querySelector('.kh-row__text .kh-row__title')).toHaveTextContent('08:05–09:00');
		expect(row?.querySelector('.kh-row__text .kh-row__subtitle')).toHaveTextContent(
			'Uppdrag A · Möten'
		);
	});

	it('leaves out the parts that are not given', () => {
		const { container } = render(<Row title="Bara rubrik" />);
		expect(container.querySelector('.kh-row__subtitle')).toBeNull();
		expect(container.querySelector('.kh-row__leading')).toBeNull();
		expect(container.querySelector('.kh-row__trailing')).toBeNull();
		expect(container.querySelector('.kh-chevron')).toBeNull();
	});

	it('puts leading and trailing in their slots, and the chevron last when it navigates', () => {
		const { container } = render(
			<Row
				title="Möten"
				leading={<svg aria-hidden="true" />}
				trailing="48 min"
				navigates
				href="/dag"
			/>
		);
		const row = container.firstElementChild!;
		const parts = [...row.children].map((child) => child.className);
		expect(parts).toEqual(['kh-row__leading', 'kh-row__text', 'kh-row__trailing', 'kh-chevron']);
		expect(row.querySelector('.kh-chevron')).toHaveAttribute('aria-hidden', 'true');
	});

	it('sets the state modifiers and the accent class', () => {
		const { container } = render(
			<Row title="Lucka" tinted done inactive accentClass="accent-fel" />
		);
		expect(container.firstElementChild).toHaveAttribute(
			'class',
			'kh-row kh-row--tinted kh-row--done kh-row--inactive kh-row--accent accent-fel'
		);
	});

	it('is a link with href and a button with onPress', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<>
				<Row title="Länk" href="/intervall/1" />
				<Row title="Knapp" onPress={onPress} />
			</>
		);
		expect(screen.getByRole('link', { name: 'Länk' })).toHaveAttribute('href', '/intervall/1');
		await user.click(screen.getByRole('button', { name: 'Knapp' }));
		expect(onPress).toHaveBeenCalledOnce();
	});

	it('sets no style and no class outside web-ui and the accent', () => {
		const { container } = render(
			<>
				<Row title="A" subtitle="a" leading="x" trailing="y" navigates href="#" />
				<Row title="B" tinted done inactive accentClass="accent-fel" onPress={() => {}} />
			</>
		);
		expectOnlyWebUi(container, ['accent-fel']);
	});
});
