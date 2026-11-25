import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Notice } from './Notice';
import { expectOnlyWebUi } from './noStyle.test-helper';

const Icon = () => <svg aria-hidden="true" />;

describe('Notice', () => {
	it('has the icon, title and detail with the tone', () => {
		const { container } = render(
			<Notice
				tone="ton-varning"
				icon={<Icon />}
				title="Molnbudgeten är till 92 % använd"
				detail="92 kr av 100 kr i november."
			/>
		);
		const notice = container.firstElementChild!;
		expect(notice.tagName).toBe('DIV');
		expect(notice).toHaveAttribute('class', 'kh-notice ton-varning');
		expect(notice.firstElementChild?.tagName).toBe('svg');
		expect(notice.querySelector('.kh-notice__title')).toHaveTextContent(
			'Molnbudgeten är till 92 % använd'
		);
		expect(notice.querySelector('.kh-notice__detail')).toHaveTextContent(
			'92 kr av 100 kr i november.'
		);
		expect(notice.querySelector('.kh-chevron')).toBeNull();
	});

	it('is a link with a chevron when it has href', () => {
		const { container } = render(<Notice title="Notiser är avstängda" href="/installningar" />);
		const link = screen.getByRole('link', { name: 'Notiser är avstängda' });
		expect(link).toHaveAttribute('href', '/installningar');
		expect(container.querySelector('.kh-chevron')).not.toBeNull();
	});

	it('is a button with a chevron when it has onPress', async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(<Notice title="Synka" onPress={onPress} />);
		await user.click(screen.getByRole('button', { name: 'Synka' }));
		expect(onPress).toHaveBeenCalledOnce();
	});

	it('puts the action under the text, and leaves it out of a link', () => {
		const { container } = render(
			<>
				<Notice title="Saknas" action={<button type="button">Installera</button>} />
				<Notice title="Länk" href="#" action={<button type="button">Aldrig</button>} />
			</>
		);
		expect(container.querySelector('.kh-notice__text > button')).toHaveTextContent('Installera');
		expect(screen.queryByRole('button', { name: 'Aldrig' })).toBeNull();
	});

	it('sets no style and no class outside web-ui and the tone', () => {
		const { container } = render(
			<>
				<Notice tone="ton-ok" icon={<Icon />} title="A" detail="a" />
				<Notice title="B" href="#" />
			</>
		);
		expectOnlyWebUi(container, ['ton-ok']);
	});
});
