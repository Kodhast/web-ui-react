import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectOnlyWebUi } from './noStyle.test-helper';
import { Toolbar, type ToolbarTab } from './Toolbar';

const Icon = () => (
	<svg aria-hidden="true">
		<path d="M0 0h1" />
	</svg>
);

const tabs: ToolbarTab[] = [
	{ id: 'idag', label: 'Idag', icon: <Icon />, href: '/' },
	{ id: 'veckan', label: 'Veckan', icon: <Icon />, href: '/veckan', badge: 2 },
	{ id: 'installningar', label: 'Inställningar', icon: <Icon />, href: '/installningar' }
];

describe('Toolbar', () => {
	it('renders the tabs as links, and only the selected one has aria-current="page"', () => {
		render(<Toolbar tabs={tabs} selected="idag" aria-label="Flikar" />);
		const links = screen.getAllByRole('link');
		expect(links.map((link) => link.getAttribute('href'))).toEqual([
			'/',
			'/veckan',
			'/installningar'
		]);
		expect(screen.getByRole('link', { name: 'Idag' })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Veckan' })).not.toHaveAttribute('aria-current');
		expect(screen.getByRole('navigation', { name: 'Flikar' })).toHaveClass('kh-toolbar__tabs');
		for (const link of links) expect(link).toHaveClass('kh-toolbar__tab');
	});

	it('shows the badge only on a tab that is not selected', () => {
		const { container, rerender } = render(<Toolbar tabs={tabs} selected="idag" />);
		expect(container.querySelector('.kh-toolbar__badge')).toHaveTextContent('2');
		rerender(<Toolbar tabs={tabs} selected="veckan" />);
		expect(container.querySelector('.kh-toolbar__badge')).toBeNull();
	});

	it('has the main action as a named button that presses', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<Toolbar
				tabs={tabs}
				selected="idag"
				action={{ label: 'Starta timern', icon: <Icon />, onPress }}
			/>
		);
		const action = screen.getByRole('button', { name: 'Starta timern' });

		await user.click(action);

		expect(onPress).toHaveBeenCalledOnce();
		expect(action).toHaveAttribute('class', 'kh-toolbar__action');
	});

	it('is a kh-toolbar element, fixed at the bottom with fixed', () => {
		const { container, rerender } = render(<Toolbar tabs={tabs} selected="idag" />);
		const toolbar = container.querySelector('kh-toolbar');
		expect(toolbar).not.toHaveAttribute('class');
		expect(screen.queryByRole('button')).toBeNull();
		rerender(<Toolbar tabs={tabs} selected="idag" fixed />);
		expect(toolbar).toHaveAttribute('class', 'kh-toolbar--fixed');
	});

	it('has no inline style and no class outside web-ui', () => {
		const { container } = render(
			<Toolbar
				tabs={tabs}
				selected="installningar"
				fixed
				action={{ label: 'Stoppa timern', icon: <Icon />, onPress: () => {} }}
			/>
		);
		expectOnlyWebUi(container);
	});
});
