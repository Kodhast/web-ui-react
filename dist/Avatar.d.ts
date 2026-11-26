import { type ButtonHTMLAttributes, type Ref } from 'react';
export interface AvatarProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children' | 'onClick' | 'type' | 'name'> {
    /** The account's name (or e-mail): its initials are shown, under the picture. Without it a person icon. */
    name?: string | null;
    /** The account's picture, e.g. Google's profile picture. One that does not load gives way to the initials. */
    photoUrl?: string | null;
    /** The dot for a connection (`kh-avatar--online`); `aria-label` should say it too. */
    online?: boolean;
    /** Makes the avatar a button. A button that opens a menu takes `popoverTarget` instead (see `Menu`). */
    onPress?: () => void;
    ref?: Ref<HTMLButtonElement>;
}
/** android-ui's initials: the first letter of the first and the last word, upper case. */
export declare function initials(name: string): string | null;
/**
 * web-ui's `.kh-avatar` (android-ui's AccountAvatar): the picture, else the initials, else a person, in a circle
 * of 36 in a touch target of 48. A button with `onPress` or `popoverTarget` (then `aria-label` is needed), otherwise
 * only a picture.
 */
export declare function Avatar({ name, photoUrl, online, onPress, ref, ...button }: AvatarProps): import("react").JSX.Element;
