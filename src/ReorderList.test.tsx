import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReorderList, reorder } from './ReorderList';
import { expectOnlyWebUi } from './noStyle.test-helper';

const ids = ['a', 'b', 'c', 'd'];

describe('reorder', () => {
	it('moves a row before or after another', () => {
		expect(reorder(ids, ['d'], 'b', 'before')).toEqual(['a', 'd', 'b', 'c']);
		expect(reorder(ids, ['a'], 'c', 'after')).toEqual(['b', 'c', 'a', 'd']);
		expect(reorder(ids, ['a'], 'd', 'after')).toEqual(['b', 'c', 'd', 'a']);
		expect(reorder(ids, ['d'], 'a', 'before')).toEqual(['d', 'a', 'b', 'c']);
	});

	it('moves several rows together, in their own order', () => {
		expect(reorder(ids, new Set(['c', 'a']), 'd', 'after')).toEqual(['b', 'd', 'a', 'c']);
	});

	it('leaves the order when the target is moved or unknown', () => {
		expect(reorder(ids, ['b'], 'b', 'after')).toEqual(ids);
		expect(reorder(ids, ['b'], 'x', 'before')).toEqual(ids);
	});
});

const items = [
	{ id: '1001', title: '1001 Utveckling', textValue: '1001 Utveckling' },
	{ id: '1002', title: '1002 Möten', subtitle: 'Interna möten', textValue: '1002 Möten' }
];

describe('ReorderList', () => {
	it("renders web-ui's kh-reorder: rows with a handle last", () => {
		const { container } = render(
			<ReorderList items={items} onReorder={vi.fn()} aria-label="Kund A:s koder" />
		);
		const list = screen.getByRole('grid', { name: 'Kund A:s koder' });
		expect(list).toHaveClass('kh-reorder');
		const rows = within(list).getAllByRole('row');
		expect(rows).toHaveLength(2);
		expect(rows[0]).toHaveClass('kh-row');
		expect(rows[0]?.querySelector('.kh-row__title')).toHaveTextContent('1001 Utveckling');
		expect(rows[1]?.querySelector('.kh-row__subtitle')).toHaveTextContent('Interna möten');
		const handle = screen.getByRole('button', { name: 'Flytta 1001 Utveckling' });
		expect(handle).toHaveClass('kh-icon-btn', 'kh-reorder__handle');
		expect(handle.parentElement).toHaveClass('kh-row__trailing');
		// React Aria sets two styles that change no look, and nothing of ours: the cell around each row's content
		// is `display: contents`, and the handle takes no pointer (the whole row is dragged by pointer; the handle
		// is for the keyboard).
		const styled = [...container.querySelectorAll('[style]')];
		expect(styled.map((element) => element.getAttribute('style')).sort()).toEqual([
			'display: contents;',
			'display: contents;',
			'pointer-events: none;',
			'pointer-events: none;'
		]);
		for (const element of styled) element.removeAttribute('style');
		expectOnlyWebUi(container);
	});

	it('reports a press on a row by its id', async () => {
		const user = userEvent.setup();
		const onAction = vi.fn();
		render(
			<ReorderList items={items} onReorder={vi.fn()} onAction={onAction} aria-label="Koder" />
		);
		await user.click(screen.getByText('1002 Möten'));
		expect(onAction).toHaveBeenCalledExactlyOnceWith('1002');
	});

	it('names the handle as the app says', () => {
		render(
			<ReorderList
				items={items}
				onReorder={vi.fn()}
				handleLabel={(item) => `Dra ${item.id}`}
				aria-label="Koder"
			/>
		);
		expect(screen.getByRole('button', { name: 'Dra 1002' })).toBeInTheDocument();
	});

	it('moves a row with the keyboard from its handle, and reports the new order', async () => {
		const user = userEvent.setup();
		const onReorder = vi.fn();
		const three = [
			...items,
			{ id: '1003', title: '1003 Förvaltning', textValue: '1003 Förvaltning' }
		];
		render(<ReorderList items={three} onReorder={onReorder} aria-label="Koder" />);
		await user.tab();
		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('button', { name: 'Flytta 1001 Utveckling' })).toHaveFocus();
		await user.keyboard('{Enter}');
		await act(() => new Promise((done) => setTimeout(done, 0)));
		// The drop target starts before the next row; one step down is before the row after it.
		await user.keyboard('{ArrowDown}');
		await user.keyboard('{Enter}');
		expect(onReorder).toHaveBeenCalledWith(['1002', '1001', '1003']);
	});
});
