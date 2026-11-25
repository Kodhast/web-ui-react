import type { ReactNode } from 'react';
import { Modal, type OverlayStateProps } from './Modal.js';

export interface BottomSheetProps extends OverlayStateProps {
	/** Names the sheet (`kh-sheet__title`). */
	title: ReactNode;
	/** A line under the title (`kh-sheet__subtitle`). */
	subtitle?: ReactNode;
	/** The buttons, fixed at the bottom of the sheet while its content scrolls (`kh-sheet__footer`). */
	footer?: ReactNode;
	children?: ReactNode;
}

/**
 * web-ui's `.kh-sheet` (android-ui's AppBottomSheet): a modal `<dialog>` at the bottom with the grip and the blurred
 * backdrop. Escape, Android's back and a press on the backdrop close it.
 */
export function BottomSheet({
	title,
	subtitle,
	footer,
	children,
	isOpen,
	onOpenChange
}: BottomSheetProps) {
	return (
		<Modal
			className="kh-sheet"
			role="dialog"
			isDismissable
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			{({ titleProps }) => (
				<>
					<h2 {...titleProps} className="kh-sheet__title">
						{title}
					</h2>
					{subtitle !== undefined && <p className="kh-sheet__subtitle">{subtitle}</p>}
					{children}
					{footer !== undefined && <div className="kh-sheet__footer">{footer}</div>}
				</>
			)}
		</Modal>
	);
}
