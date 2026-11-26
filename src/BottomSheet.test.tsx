import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BottomSheet, type BottomSheetProps } from './BottomSheet';
import { Button } from './Button';
import { TextField } from './TextField';
import { expectOnlyWebUi } from './noStyle.test-helper';

type Options = Partial<Omit<BottomSheetProps, 'isOpen'>>;

/** An app screen: a button that opens the sheet, with an interval in it and Spara in the footer. */
function Screen({ onOpenChange, ...props }: Options) {
	const [isOpen, setOpen] = useState(false);
	const close = (open: boolean) => {
		onOpenChange?.(open);
		setOpen(open);
	};
	return (
		<>
			<Button onPress={() => setOpen(true)}>Ändra</Button>
			<BottomSheet
				title="Ändra intervall"
				subtitle="Måndag 17 november"
				footer={
					<Button variant="primary" onPress={() => close(false)}>
						Spara
					</Button>
				}
				{...props}
				isOpen={isOpen}
				onOpenChange={close}
			>
				<TextField label="Från" defaultValue="08:00" />
				<TextField label="Till" defaultValue="16:30" />
			</BottomSheet>
		</>
	);
}

async function open(options: Options = {}) {
	const user = userEvent.setup();
	render(<Screen {...options} />);
	const opener = screen.getByRole('button', { name: 'Ändra' });
	await user.click(opener);
	return { user, opener, sheet: screen.getByRole('dialog') };
}

describe('BottomSheet', () => {
	it('renders nothing while closed', () => {
		const { container } = render(
			<BottomSheet title="Ark" isOpen={false} onOpenChange={() => {}} />
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('is web-ui\'s <dialog class="kh-sheet"> with title, subtitle, content and footer', async () => {
		const { sheet } = await open();
		expect(sheet.tagName).toBe('DIALOG');
		expect(sheet).toHaveAttribute('class', 'kh-sheet');
		expect(sheet).toHaveAttribute('open');
		expect(sheet).toHaveAccessibleName('Ändra intervall');
		const classes = [...sheet.children]
			.filter((child) => !child.hasAttribute('hidden'))
			.map((child) => child.className);
		expect(classes).toEqual([
			'kh-sheet__title',
			'kh-sheet__subtitle',
			'kh-field-group',
			'kh-field-group',
			'kh-sheet__footer'
		]);
		expect(sheet.querySelector('.kh-sheet__subtitle')).toHaveTextContent('Måndag 17 november');
	});

	it('leaves out subtitle and footer when not given', async () => {
		const { sheet } = await open({ subtitle: undefined, footer: undefined });
		expect(sheet.querySelector('.kh-sheet__subtitle')).toBeNull();
		expect(sheet.querySelector('.kh-sheet__footer')).toBeNull();
	});

	it('moves focus to the first field and back to the button that opened it', async () => {
		const { user, opener } = await open();
		await waitFor(() => expect(screen.getByRole('textbox', { name: 'Från' })).toHaveFocus());
		await user.click(screen.getByRole('button', { name: 'Spara' }));
		expect(screen.queryByRole('dialog')).toBeNull();
		await waitFor(() => expect(opener).toHaveFocus());
	});

	it('keeps Tab inside the sheet', async () => {
		const { user } = await open();
		const from = screen.getByRole('textbox', { name: 'Från' });
		await waitFor(() => expect(from).toHaveFocus());
		await user.tab();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Spara' })).toHaveFocus();
		await user.tab();
		expect(from).toHaveFocus();
	});

	it('closes on Escape', async () => {
		const onOpenChange = vi.fn();
		const { user } = await open({ onOpenChange });
		await user.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('closes on a press on the backdrop', async () => {
		const { sheet } = await open();
		fireEvent.pointerDown(sheet, { clientX: 200, clientY: 200 });
		fireEvent.click(sheet, { clientX: 200, clientY: 200 });
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it("closes on the browser's close request (Android's back)", async () => {
		const { sheet } = await open();
		fireEvent(sheet, new Event('cancel', { cancelable: true }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('sets no style and no class outside web-ui', async () => {
		await open();
		expectOnlyWebUi(document.body);
	});
});
