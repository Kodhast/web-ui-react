import { expect } from 'vitest';

/** Rule 2: no inline style, and no class except web-ui's `kh-*` and the app classes passed in. */
export function expectOnlyWebUi(container: Element, appClasses: string[] = []) {
	for (const element of container.querySelectorAll('*')) {
		expect(element).not.toHaveAttribute('style');
		for (const name of element.classList) {
			if (!appClasses.includes(name)) expect(name).toMatch(/^kh-/);
		}
	}
}
