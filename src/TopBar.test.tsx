import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { expectOnlyWebUi } from './noStyle.test-helper';
import { TopBar } from './TopBar';

describe('TopBar', () => {
	it('calls onBack from a tonal back arrow named Tillbaka', async () => {
		const user = userEvent.setup();
		const onBack = vi.fn();
		render(<TopBar title="Vecka 47" onBack={onBack} />);
		const back = screen.getByRole('button', { name: 'Tillbaka' });

		await user.click(back);

		expect(onBack).toHaveBeenCalledOnce();
		expect(back).toHaveAttribute('class', 'kh-icon-btn kh-icon-btn--tonal');
	});

	it('renders the back arrow as a link with backHref, which wins over onBack', () => {
		render(<TopBar title="Vecka 47" backHref="/veckan" onBack={() => {}} />);
		expect(screen.getByRole('link', { name: 'Tillbaka' })).toHaveAttribute('href', '/veckan');
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('has no back arrow without onBack or backHref, and the title is the heading', () => {
		const { container } = render(<TopBar title="Inställningar" />);
		expect(screen.queryByRole('button')).toBeNull();
		expect(screen.getByRole('heading', { level: 1, name: 'Inställningar' })).toHaveClass(
			'kh-topbar__title'
		);
		expect(container.querySelector('header')).toHaveAttribute('class', 'kh-topbar');
		expect(container.querySelector('kh-dots')).toBeNull();
	});

	it('shows still or bouncing dots before the title', () => {
		const { container, rerender } = render(<TopBar title="Vecka 47" dots />);
		expect(container.querySelector('.kh-topbar__title > kh-dots')).not.toHaveAttribute('bouncing');
		rerender(<TopBar title="Vecka 47" bouncing />);
		expect(container.querySelector('.kh-topbar__title > kh-dots')).toHaveAttribute('bouncing');
	});

	it('puts the actions at the end, and takes a plain back arrow with a tone and own name', () => {
		const { container } = render(
			<TopBar
				title="Måndag"
				onBack={() => {}}
				backLabel="Till veckan"
				plainBack
				backTone="ton-gron"
				actions={<Button compact>Spara</Button>}
			/>
		);
		expect(screen.getByRole('button', { name: 'Till veckan' })).toHaveAttribute(
			'class',
			'kh-icon-btn ton-gron'
		);
		expect(container.querySelector('.kh-topbar__actions')).toContainElement(
			screen.getByRole('button', { name: 'Spara' })
		);
	});

	it('has no inline style and no class outside web-ui', () => {
		const { container } = render(
			<TopBar title="Vecka 47" onBack={() => {}} bouncing backTone="ton-bla" actions="3 h" />
		);
		expectOnlyWebUi(container, ['ton-bla']);
	});
});
