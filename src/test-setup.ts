import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// jsdom has <dialog> but not showModal() or close(). This stands in for the attribute and the close event only:
// no top layer, no inert page and no focus move – the tests check what React Aria does, not the browser.
if (!HTMLDialogElement.prototype.showModal) {
	HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
		this.setAttribute('open', '');
	};
	HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
		if (!this.hasAttribute('open')) return;
		this.removeAttribute('open');
		this.dispatchEvent(new Event('close'));
	};
}

// jsdom has no popover. This stands in for showPopover(), hidePopover() and togglePopover(), the toggle event
// (asynchronous, as in the browser), :popover-open as the attribute data-popover-open, and a press on a button
// with popovertarget. No top layer, no anchoring and no light dismiss.
if (!('showPopover' in HTMLElement.prototype)) {
	const toggle = (element: HTMLElement, open: boolean) => {
		if (element.hasAttribute('data-popover-open') === open) return;
		element.toggleAttribute('data-popover-open', open);
		const event = new Event('toggle');
		Object.assign(event, {
			newState: open ? 'open' : 'closed',
			oldState: open ? 'closed' : 'open'
		});
		queueMicrotask(() => element.dispatchEvent(event));
	};
	Object.assign(HTMLElement.prototype, {
		showPopover(this: HTMLElement) {
			toggle(this, true);
		},
		hidePopover(this: HTMLElement) {
			toggle(this, false);
		},
		togglePopover(this: HTMLElement) {
			toggle(this, !this.hasAttribute('data-popover-open'));
		}
	});
	const shown = document.createElement('style');
	shown.textContent = '[popover][data-popover-open] { display: block; }';
	document.head.append(shown);
	document.addEventListener('click', (event) => {
		const button = (event.target as Element).closest?.('button[popovertarget]');
		const target = button && document.getElementById(button.getAttribute('popovertarget') ?? '');
		if (target) (target as HTMLElement & { togglePopover(): void }).togglePopover();
	});
}
