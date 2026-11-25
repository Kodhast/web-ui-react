import {
	useLayoutEffect,
	useRef,
	type DialogHTMLAttributes,
	type DOMAttributes,
	type MouseEvent,
	type PointerEvent,
	type ReactNode
} from 'react';
import { FocusScope } from 'react-aria/FocusScope';
import { mergeProps } from 'react-aria/mergeProps';
import { useDialog } from 'react-aria/useDialog';
import { useOverlay } from 'react-aria/useOverlay';

/** Open and closed, owned by the app: the overlay is shown while `isOpen` and asks to close with `onOpenChange(false)`. */
export interface OverlayStateProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

interface ModalProps extends OverlayStateProps {
	className: 'kh-dialog' | 'kh-sheet';
	role: 'dialog' | 'alertdialog';
	/** Escape, Android's back and a press on the backdrop close it. */
	isDismissable: boolean;
	/** The content, given the props for the title (its id names the dialog) and, in an alertdialog, the text. */
	children: (props: {
		titleProps: DOMAttributes<HTMLElement>;
		contentProps: DOMAttributes<HTMLElement>;
	}) => ReactNode;
}

/**
 * web-ui's `<dialog>` opened with `showModal()` (ADR 0002): the browser draws the backdrop (`::backdrop`, with the
 * blur) and makes the page behind inert; React Aria moves focus in, keeps it there and gives it back. Rendered only
 * while open, so closing is unmounting and the open state has one owner, the app.
 */
export function Modal(props: ModalProps) {
	return props.isOpen ? <OpenModal {...props} /> : null;
}

function OpenModal({ className, role, isDismissable, onOpenChange, children }: ModalProps) {
	const ref = useRef<HTMLDialogElement>(null);
	const close = () => onOpenChange(false);
	const { overlayProps } = useOverlay(
		{ isOpen: true, onClose: close, isKeyboardDismissDisabled: !isDismissable },
		ref
	);
	const { dialogProps, titleProps, contentProps } = useDialog({ role }, ref);
	const pressStartedOnBackdrop = useRef(false);

	// Before FocusScope's autoFocus (an effect), so that the first field is focusable when it is focused.
	useLayoutEffect(() => {
		ref.current?.showModal();
	}, []);

	// React Aria handles Escape (useOverlay); the browser's own close request would close a destructive question.
	const escapeProps: DialogHTMLAttributes<HTMLDialogElement> = {
		onKeyDown: (event) => {
			if (event.key === 'Escape') event.preventDefault();
		}
	};

	return (
		<dialog
			{...mergeProps(overlayProps, dialogProps, escapeProps)}
			ref={ref}
			className={className}
			// Other close requests (Android's back): the app decides, as for Escape.
			onCancel={(event) => {
				event.preventDefault();
				if (isDismissable) close();
			}}
			// The browser closed it anyway (a repeated back without a tap in between cannot be cancelled): follow it.
			onClose={close}
			onPointerDown={(event) => {
				pressStartedOnBackdrop.current = isOnBackdrop(event);
			}}
			onClick={(event) => {
				if (isDismissable && pressStartedOnBackdrop.current && isOnBackdrop(event)) close();
				pressStartedOnBackdrop.current = false;
			}}
		>
			<FocusScope contain restoreFocus autoFocus>
				{children({ titleProps, contentProps })}
			</FocusScope>
		</dialog>
	);
}

/** A press on `::backdrop` lands on the `<dialog>` itself, outside its box; one on its padding lands inside it. */
function isOnBackdrop(event: MouseEvent<HTMLDialogElement> | PointerEvent<HTMLDialogElement>) {
	if (event.target !== event.currentTarget) return false;
	const box = event.currentTarget.getBoundingClientRect();
	return (
		event.clientX < box.left ||
		event.clientX > box.right ||
		event.clientY < box.top ||
		event.clientY > box.bottom
	);
}
