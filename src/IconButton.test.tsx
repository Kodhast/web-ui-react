import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';
import { expectOnlyWebUi } from './noStyle.test-helper';

const Icon = () => (
	<svg aria-hidden="true">
		<path d="M0 0h1" />
	</svg>
);

describe('IconButton', () => {
	it('requires aria-label in its type', () => {
		// @ts-expect-error – an icon button without a name does not compile.
		const element = <IconButton onPress={() => {}}>{<Icon />}</IconButton>;
		expect(element).toBeTruthy();
	});

	it('is a button named by aria-label that presses', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<IconButton aria-label="Arkivera" onPress={onPress}>
				<Icon />
			</IconButton>
		);
		const button = screen.getByRole('button', { name: 'Arkivera' });

		await user.click(button);

		expect(onPress).toHaveBeenCalledOnce();
		expect(button).toHaveAttribute('class', 'kh-icon-btn');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('is tonal and takes the app tone class', () => {
		render(
			<IconButton aria-label="Tillbaka" tonal tone="ton-gron">
				<Icon />
			</IconButton>
		);
		expect(screen.getByRole('button')).toHaveAttribute(
			'class',
			'kh-icon-btn kh-icon-btn--tonal ton-gron'
		);
	});

	it('ignores presses when disabled', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(
			<IconButton aria-label="Lägg till" tonal isDisabled onPress={onPress}>
				<Icon />
			</IconButton>
		);
		const button = screen.getByRole('button');

		await user.click(button);

		expect(onPress).not.toHaveBeenCalled();
		expect(button).toBeDisabled();
	});

	it('is a link with href', () => {
		render(
			<IconButton aria-label="Tillbaka" href="/veckan" tonal>
				<Icon />
			</IconButton>
		);
		const link = screen.getByRole('link', { name: 'Tillbaka' });
		expect(link).toHaveAttribute('href', '/veckan');
		expect(link).toHaveAttribute('class', 'kh-icon-btn kh-icon-btn--tonal');
	});

	it('passes a ref to the button element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<IconButton aria-label="Arkivera" ref={ref}>
				<Icon />
			</IconButton>
		);
		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('has no inline style and no class outside web-ui and the tone', () => {
		const { container } = render(
			<>
				<IconButton aria-label="A">
					<Icon />
				</IconButton>
				<IconButton aria-label="B" tonal tone="ton-bla" isDisabled>
					<Icon />
				</IconButton>
				<IconButton aria-label="C" href="#">
					<Icon />
				</IconButton>
			</>
		);
		expectOnlyWebUi(container, ['ton-bla']);
	});
});
