import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AccountMenu, AccountRow } from './AccountMenu';
import { expectOnlyWebUi } from './noStyle.test-helper';

const anna = {
	name: 'Anna Berg',
	email: 'anna.berg@exempel.se',
	photoUrl: 'https://exempel.se/a.png'
};

/** The toggle event comes a microtask after the popover opens, as in the browser. */
const settle = () => act(() => Promise.resolve());

describe('AccountRow', () => {
	it('shows the name and the e-mail, or the e-mail alone', () => {
		const { container, rerender } = render(<AccountRow {...anna} />);
		expect(container.querySelector('.kh-row__title')).toHaveTextContent('Anna Berg');
		expect(container.querySelector('.kh-row__subtitle')).toHaveTextContent('anna.berg@exempel.se');
		expect(container.querySelector('.kh-row__leading .kh-avatar img')).not.toBeNull();
		rerender(<AccountRow email="anna.berg@exempel.se" />);
		expect(container.querySelector('.kh-row__title')).toHaveTextContent('anna.berg@exempel.se');
		expect(container.querySelector('.kh-row__subtitle')).toHaveTextContent('Inloggad med Google');
		expectOnlyWebUi(container);
	});
});

describe('AccountMenu', () => {
	const open = async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Konto och inställningar/ }));
		await settle();
	};

	it('has the fixed order: the account, Inställningar, Om, a line and Logga ut', async () => {
		const { container } = render(
			<AccountMenu
				account={anna}
				appName="Tidrapporten"
				settingsHref="#/installningar"
				aboutHref="#/om"
				onSignOut={() => {}}
				online
			/>
		);
		const avatar = screen.getByRole('button', { name: 'Konto och inställningar, ansluten' });
		expect(avatar).toHaveClass('kh-avatar', 'kh-avatar--online');
		expect(avatar.querySelector('img')).toHaveAttribute('src', anna.photoUrl);
		await open();
		const menu = container.querySelector('.kh-menu')!;
		expect(menu.querySelector(':scope > .kh-row .kh-row__title')).toHaveTextContent('Anna Berg');
		expect(menu.querySelector(':scope > hr.kh-divider')).not.toBeNull();
		const items = screen.getAllByRole('menuitem');
		expect(items.map((item) => item.textContent)).toEqual([
			'Inställningar',
			'Om Tidrapporten',
			'Logga ut'
		]);
		expect(items[0]).toHaveAttribute('href', '#/installningar');
		expect(items[1]).toHaveAttribute('href', '#/om');
		expect(screen.getByRole('menu', { name: 'Konto' })).toContainElement(items[2]!);
		expectOnlyWebUi(container);
	});

	it('asks "Logga ut?" before signing out', async () => {
		const onSignOut = vi.fn();
		render(<AccountMenu account={anna} appName="Tidrapporten" onSignOut={onSignOut} />);
		await open();
		await userEvent.click(screen.getByRole('menuitem', { name: 'Logga ut' }));
		const dialog = await screen.findByRole('alertdialog', { name: 'Logga ut?' });
		expect(dialog).toHaveTextContent('Det du sparat i Tidrapporten finns kvar');
		expect(onSignOut).not.toHaveBeenCalled();
		await userEvent.click(screen.getByRole('button', { name: 'Logga ut' }));
		expect(onSignOut).toHaveBeenCalledOnce();
		await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
	});

	it('calls the settings and the about page when they are not links', async () => {
		const onOpenSettings = vi.fn();
		const onOpenAbout = vi.fn();
		render(
			<AccountMenu
				account={anna}
				appName="Tidrapporten"
				onOpenSettings={onOpenSettings}
				onOpenAbout={onOpenAbout}
				onSignOut={() => {}}
			/>
		);
		await open();
		await userEvent.click(screen.getByRole('menuitem', { name: 'Inställningar' }));
		expect(onOpenSettings).toHaveBeenCalledOnce();
		await open();
		await userEvent.click(screen.getByRole('menuitem', { name: 'Om Tidrapporten' }));
		expect(onOpenAbout).toHaveBeenCalledOnce();
	});

	it('signed out: no account row, a person, and Logga in med Google only with onSignIn', async () => {
		const onSignIn = vi.fn();
		const { container, rerender } = render(
			<AccountMenu account={null} appName="Tidrapporten" onSignOut={() => {}} online={false} />
		);
		const avatar = screen.getByRole('button', { name: 'Konto och inställningar, utan anslutning' });
		expect(avatar).not.toHaveClass('kh-avatar--online');
		expect(avatar.querySelector('svg')).not.toBeNull();
		await open();
		expect(container.querySelector('.kh-menu .kh-row')).toBeNull();
		expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
			'Inställningar',
			'Om Tidrapporten'
		]);
		expect(screen.queryByRole('separator')).toBeNull();
		rerender(
			<AccountMenu account={null} appName="Tidrapporten" onSignOut={() => {}} onSignIn={onSignIn} />
		);
		await userEvent.click(screen.getByRole('menuitem', { name: 'Logga in med Google' }));
		expect(onSignIn).toHaveBeenCalledOnce();
	});
});
