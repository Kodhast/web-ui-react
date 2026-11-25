import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';
import { expectOnlyWebUi } from './noStyle.test-helper';

describe('EmptyState', () => {
	it('has the tile, title, text, actions and note in web-ui order', () => {
		const { container } = render(
			<EmptyState
				icon={<svg aria-hidden="true" />}
				title="Inga uppdrag än"
				text="Lägg till ett uppdrag så kan du börja rapportera."
				actions={<button type="button">Lägg till uppdrag</button>}
				note="Du kan ändra allt senare."
			/>
		);
		const empty = container.firstElementChild!;
		expect(empty).toHaveAttribute('class', 'kh-empty');
		expect([...empty.children].map((child) => child.className)).toEqual([
			'kh-empty__message',
			'kh-empty__actions',
			'kh-empty__note'
		]);
		expect(empty.querySelector('.kh-empty__tile svg')).not.toBeNull();
		expect(screen.getByRole('heading', { level: 3, name: 'Inga uppdrag än' })).toHaveClass(
			'kh-empty__title'
		);
	});

	it('leaves out what is not given and sets the variant', () => {
		const { container } = render(<EmptyState title="För lite data än" variant="compact" />);
		const empty = container.firstElementChild!;
		expect(empty).toHaveAttribute('class', 'kh-empty kh-empty--compact');
		expect(empty.querySelector('.kh-empty__tile')).toBeNull();
		expect(empty.querySelector('.kh-empty__text')).toBeNull();
		expect(empty.querySelector('.kh-empty__actions')).toBeNull();
		expect(empty.querySelector('.kh-empty__note')).toBeNull();
	});

	it('sets no style and no class outside web-ui', () => {
		const { container } = render(
			<EmptyState title="A" text="a" variant="error" icon={<svg />} note="n" actions="x" />
		);
		expectOnlyWebUi(container);
	});
});
