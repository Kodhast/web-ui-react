import { useRef, type ReactNode } from 'react';
import { useSwitch, type AriaSwitchProps } from 'react-aria/useSwitch';
import { useToggleState } from 'react-stately/useToggleState';
import { cx } from './cx.js';

/** The state props shared by `Switch` and `SwitchRow`. */
export interface SwitchStateProps extends Pick<
	AriaSwitchProps,
	'isSelected' | 'defaultSelected' | 'onChange' | 'isDisabled' | 'isReadOnly' | 'name' | 'value'
> {
	/** The accessible name when no text is shown (`Switch` alone); `SwitchRow` is named by its title. */
	'aria-label'?: string;
}

/** React Aria's switch behaviour on web-ui's own `<input class="kh-switch">`, which a hidden input could not carry. */
function useKhSwitch(props: SwitchStateProps, hasText: boolean) {
	const ref = useRef<HTMLInputElement>(null);
	const state = useToggleState(props);
	// `children` only tells React Aria that the text comes from a wrapping label, so it does not ask for aria-label.
	const { inputProps } = useSwitch({ ...props, children: hasText || undefined }, state, ref);
	return { ref, inputProps };
}

export interface SwitchProps extends SwitchStateProps {
	'aria-label': string;
}

/** web-ui's `.kh-switch` (android-ui's SwitchControl): Material 3's switch alone. For a row, use `SwitchRow`. */
export function Switch(props: SwitchProps) {
	const { ref, inputProps } = useKhSwitch(props, false);
	return <input {...inputProps} ref={ref} className="kh-switch" />;
}

export interface SwitchRowProps extends SwitchStateProps {
	title: ReactNode;
	subtitle?: ReactNode;
	/** Dims the text but not the switch, so it can be turned on again (`kh-switch-row--inactive`). */
	inactive?: boolean;
}

/** web-ui's `.kh-switch-row` (android-ui's SwitchRow): the whole row is the label, so a press anywhere toggles. */
export function SwitchRow({ title, subtitle, inactive = false, ...props }: SwitchRowProps) {
	const { ref, inputProps } = useKhSwitch(props, true);
	return (
		<label className={cx('kh-row', 'kh-switch-row', inactive && 'kh-switch-row--inactive')}>
			<span className="kh-row__text">
				<span className="kh-row__title">{title}</span>
				{subtitle !== undefined && <span className="kh-row__subtitle">{subtitle}</span>}
			</span>
			<input {...inputProps} ref={ref} className="kh-switch" />
		</label>
	);
}
