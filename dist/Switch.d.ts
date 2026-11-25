import { type ReactNode } from 'react';
import { type AriaSwitchProps } from 'react-aria/useSwitch';
/** The state props shared by `Switch` and `SwitchRow`. */
export interface SwitchStateProps extends Pick<AriaSwitchProps, 'isSelected' | 'defaultSelected' | 'onChange' | 'isDisabled' | 'isReadOnly' | 'name' | 'value'> {
    /** The accessible name when no text is shown (`Switch` alone); `SwitchRow` is named by its title. */
    'aria-label'?: string;
}
export interface SwitchProps extends SwitchStateProps {
    'aria-label': string;
}
/** web-ui's `.kh-switch` (android-ui's SwitchControl): Material 3's switch alone. For a row, use `SwitchRow`. */
export declare function Switch(props: SwitchProps): import("react").JSX.Element;
export interface SwitchRowProps extends SwitchStateProps {
    title: ReactNode;
    subtitle?: ReactNode;
    /** Dims the text but not the switch, so it can be turned on again (`kh-switch-row--inactive`). */
    inactive?: boolean;
}
/** web-ui's `.kh-switch-row` (android-ui's SwitchRow): the whole row is the label, so a press anywhere toggles. */
export declare function SwitchRow({ title, subtitle, inactive, ...props }: SwitchRowProps): import("react").JSX.Element;
