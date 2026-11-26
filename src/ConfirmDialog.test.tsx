import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';
import { TextField } from './TextField';
import { expectOnlyWebUi } from './noStyle.test-helper';

type Options = Partial<Omit<ConfirmDialogProps, 'isOpen'>> & { withField?: boolean };

/** An app screen: a button that opens the dialog, which the app keeps open or closed. */
function Screen({ withField = false, onOpenChange, ...props }: Options) {
	const [isOpen, setOpen] = useState(false);
	return (
		<>
			<Button onPress={() => setOpen(true)}>Lås upp</Button>
			<ConfirmDialog
				title="Lås upp veckan?"
				text="Ändringen loggas med ditt skäl."
				confirmLabel="Lås upp"
				onConfirm={() => {}}
				{...props}
				isOpen={isOpen}
				onOpenChange={(open) => {
					onOpenChange?.(open);
					setOpen(open);
				}}
			>
				{withField && <TextField label="Skäl" />}
			</ConfirmDialog>
		</>
	);
}

async function open(options: Options = {}) {
	const user = userEvent.setup();
	render(<Screen {...options} />);
	const opener = screen.getByRole('button', { name: 'Lås upp' });
	await user.click(opener);
	const dialog = screen.getByRole('alertdialog');
	return { user, opener, dialog };
}

/** A press on ::backdrop: the target is the <dialog> itself, outside its box (jsdom's box is 0 × 0 at 0, 0). */
function pressBackdrop(dialog: HTMLElement) {
	fireEvent.pointerDown(dialog, { clientX: 200, clientY: 200 });
	fireEvent.click(dialog, { clientX: 200, clientY: 200 });
}

describe('ConfirmDialog', () => {
	it('renders nothing while closed', () => {
		const { container } = render(
			<ConfirmDialog
				title="Radera?"
				confirmLabel="Radera"
				onConfirm={() => {}}
				isOpen={false}
				onOpenChange={() => {}}
			/>
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('is web-ui\'s <dialog class="kh-dialog"> opened as modal, named by its title', async () => {
		const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
		const { dialog } = await open();
		expect(dialog.tagName).toBe('DIALOG');
		expect(dialog).toHaveAttribute('class', 'kh-dialog');
		expect(dialog).toHaveAttribute('open');
		expect(showModal).toHaveBeenCalledOnce();
		expect(dialog).toHaveAccessibleName('Lås upp veckan?');
		expect(dialog).toHaveAccessibleDescription('Ändringen loggas med ditt skäl.');
		const classes = [...dialog.children]
			.filter((child) => !child.hasAttribute('hidden'))
			.map((child) => child.className);
		expect(classes).toEqual(['kh-dialog__title', 'kh-dialog__text', 'kh-dialog__actions']);
		expect(dialog.querySelector('h2')).toHaveClass('kh-dialog__title');
		const [cancel, confirm] = dialog.querySelectorAll('.kh-dialog__actions button');
		expect(cancel).toHaveAttribute('class', 'kh-btn kh-btn--text');
		expect(cancel).toHaveTextContent('Avbryt');
		expect(confirm).toHaveAttribute('class', 'kh-btn kh-btn--primary');
		showModal.mockRestore();
	});

	it('leaves out the text when not given', async () => {
		const { dialog } = await open({ text: undefined });
		expect(dialog.querySelector('.kh-dialog__text')).toBeNull();
		expect(dialog).not.toHaveAttribute('aria-describedby');
	});

	it('moves focus to the first field and back to the button that opened it', async () => {
		const { user, opener } = await open({ withField: true });
		await waitFor(() => expect(screen.getByRole('textbox', { name: 'Skäl' })).toHaveFocus());
		await user.keyboard('Glömde en dag');
		await user.keyboard('{Escape}');
		expect(screen.queryByRole('alertdialog')).toBeNull();
		await waitFor(() => expect(opener).toHaveFocus());
	});

	it('keeps Tab inside the dialog', async () => {
		const { user } = await open({ withField: true });
		const field = screen.getByRole('textbox', { name: 'Skäl' });
		await waitFor(() => expect(field).toHaveFocus());
		await user.tab();
		expect(screen.getByRole('button', { name: 'Avbryt' })).toHaveFocus();
		await user.tab();
		expect(screen.getAllByRole('button', { name: 'Lås upp' })[1]).toHaveFocus();
		await user.tab();
		expect(field).toHaveFocus();
	});

	it('focuses Avbryt first when there is no field', async () => {
		await open();
		await waitFor(() => expect(screen.getByRole('button', { name: 'Avbryt' })).toHaveFocus());
	});

	it('calls onConfirm and closes on the confirm button', async () => {
		const onConfirm = vi.fn();
		const onOpenChange = vi.fn();
		const { user, dialog } = await open({ onConfirm, onOpenChange });
		await user.click(dialog.querySelector('.kh-btn--primary')!);
		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('keeps the confirm button disabled while isConfirmDisabled', async () => {
		const onConfirm = vi.fn();
		const { user, dialog } = await open({ onConfirm, isConfirmDisabled: true });
		const confirm = dialog.querySelector<HTMLButtonElement>('.kh-btn--primary')!;
		expect(confirm.disabled).toBe(true);
		await user.click(confirm);
		expect(onConfirm).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeDefined();
	});

	it('closes on Avbryt without confirming', async () => {
		const onConfirm = vi.fn();
		const { user } = await open({ onConfirm, cancelLabel: 'Behåll' });
		await user.click(screen.getByRole('button', { name: 'Behåll' }));
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('closes on Escape and prevents the browser closing it by itself', async () => {
		const { dialog } = await open();
		const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
		dialog.dispatchEvent(escape);
		expect(escape.defaultPrevented).toBe(true);
		await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
	});

	it("closes on the browser's close request (Android's back), which it cancels", async () => {
		const { dialog } = await open();
		const cancel = new Event('cancel', { cancelable: true });
		fireEvent(dialog, cancel);
		expect(cancel.defaultPrevented).toBe(true);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('closes on a press on the backdrop, but not on one inside the dialog', async () => {
		const { user, dialog } = await open();
		await user.click(dialog.querySelector('.kh-dialog__title')!);
		fireEvent.pointerDown(dialog, { clientX: 0, clientY: 0 });
		fireEvent.click(dialog, { clientX: 0, clientY: 0 });
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		pressBackdrop(dialog);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('does not close when a press starts inside and ends on the backdrop', async () => {
		const { dialog } = await open();
		fireEvent.pointerDown(dialog.querySelector('.kh-dialog__text')!);
		fireEvent.click(dialog, { clientX: 200, clientY: 200 });
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	describe('destructive', () => {
		it('has the destructive confirm button', async () => {
			const { dialog } = await open({ destructive: true, confirmLabel: 'Radera' });
			expect(screen.getByRole('button', { name: 'Radera' })).toHaveAttribute(
				'class',
				'kh-btn kh-btn--destructive'
			);
			expect(dialog).toBeInTheDocument();
		});

		it('is not closed by Escape, the close request or the backdrop', async () => {
			const onOpenChange = vi.fn();
			const { user, dialog } = await open({ destructive: true, onOpenChange });
			onOpenChange.mockClear();
			await user.keyboard('{Escape}');
			const escape = new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true
			});
			dialog.dispatchEvent(escape);
			expect(escape.defaultPrevented).toBe(true);
			const cancel = new Event('cancel', { cancelable: true });
			fireEvent(dialog, cancel);
			expect(cancel.defaultPrevented).toBe(true);
			pressBackdrop(dialog);
			expect(onOpenChange).not.toHaveBeenCalled();
			expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		});

		it('closes with Avbryt', async () => {
			const onConfirm = vi.fn();
			const { user } = await open({ destructive: true, onConfirm });
			await user.click(screen.getByRole('button', { name: 'Avbryt' }));
			expect(screen.queryByRole('alertdialog')).toBeNull();
			expect(onConfirm).not.toHaveBeenCalled();
		});
	});

	it('follows the browser when it closes the dialog by itself', async () => {
		const onOpenChange = vi.fn();
		const { dialog } = await open({ destructive: true, onOpenChange });
		(dialog as HTMLDialogElement).close();
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('sets no style and no class outside web-ui', async () => {
		await open({ withField: true });
		expectOnlyWebUi(document.body);
	});
});
