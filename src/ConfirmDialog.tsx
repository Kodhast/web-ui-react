import type { ReactNode } from 'react';
import { Button } from './Button.js';
import { Modal, type OverlayStateProps } from './Modal.js';

export interface ConfirmDialogProps extends OverlayStateProps {
	/** The question, e.g. "Radera Lax?". Names the dialog. */
	title: ReactNode;
	/** What happens, under the title (`kh-dialog__text`). Describes the dialog. */
	text?: ReactNode;
	/** Fields between the text and the buttons, e.g. a `TextField` for a reason. */
	children?: ReactNode;
	/** The button that does it, e.g. "Radera". */
	confirmLabel: ReactNode;
	cancelLabel?: ReactNode;
	/**
	 * Something that cannot be undone: the confirm button is `destructive`, and only the buttons close the dialog –
	 * not Escape, Android's back or a press on the backdrop.
	 */
	destructive?: boolean;
	/** Called when the confirm button is pressed; the dialog then asks to close. */
	onConfirm: () => void;
	/** Keeps the confirm button disabled, e.g. while a required reason is empty. */
	isConfirmDisabled?: boolean;
}

/**
 * web-ui's `.kh-dialog` (android-ui's ConfirmDialog): a question with Avbryt and the action, as a modal
 * `<dialog>` with the blurred backdrop. Focus goes to the first field (or Avbryt) and back to the button that opened it.
 */
export function ConfirmDialog({
	title,
	text,
	children,
	confirmLabel,
	cancelLabel = 'Avbryt',
	destructive = false,
	onConfirm,
	isConfirmDisabled = false,
	isOpen,
	onOpenChange
}: ConfirmDialogProps) {
	return (
		<Modal
			className="kh-dialog"
			role="alertdialog"
			isDismissable={!destructive}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			{({ titleProps, contentProps }) => (
				<>
					<h2 {...titleProps} className="kh-dialog__title">
						{title}
					</h2>
					{text !== undefined && (
						<p {...contentProps} className="kh-dialog__text">
							{text}
						</p>
					)}
					{children}
					<div className="kh-dialog__actions">
						<Button variant="text" onPress={() => onOpenChange(false)}>
							{cancelLabel}
						</Button>
						<Button
							variant={destructive ? 'destructive' : 'primary'}
							isDisabled={isConfirmDisabled}
							onPress={() => {
								onConfirm();
								onOpenChange(false);
							}}
						>
							{confirmLabel}
						</Button>
					</div>
				</>
			)}
		</Modal>
	);
}
