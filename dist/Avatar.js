import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cx } from './cx.js';
/** android-ui's initials: the first letter of the first and the last word, upper case. */
export function initials(name) {
    const words = name
        .trim()
        .split(/\s+/)
        .filter((word) => /\p{L}/u.test(word));
    if (words.length === 0)
        return null;
    const ends = words.length > 1 ? [words[0], words.at(-1)] : [words[0]];
    return ends.map((word = '') => (word.match(/\p{L}/u)?.[0] ?? '').toUpperCase()).join('');
}
/** Material's person, for an avatar without a name. */
const Person = () => (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }) }));
/**
 * web-ui's `.kh-avatar` (android-ui's AccountAvatar): the picture, else the initials, else a person, in a circle
 * of 36 in a touch target of 48. A button with `onPress` or `popoverTarget` (then `aria-label` is needed), otherwise
 * only a picture.
 */
export function Avatar({ name, photoUrl, online = false, onPress, ref, ...button }) {
    // A picture that does not load is dropped, until there is a new address.
    const [failed, setFailed] = useState(null);
    const letters = name ? initials(name) : null;
    const circle = (_jsxs("span", { className: "kh-avatar__circle", children: [letters ?? _jsx(Person, {}), photoUrl && failed !== photoUrl && (_jsx("img", { src: photoUrl, alt: "", referrerPolicy: "no-referrer", onError: () => setFailed(photoUrl) }))] }));
    const className = cx('kh-avatar', online && 'kh-avatar--online');
    if (onPress === undefined && button.popoverTarget === undefined) {
        return (_jsx("span", { className: className, "aria-hidden": "true", children: circle }));
    }
    return (_jsx("button", { ...button, ref: ref, type: "button", className: className, onClick: onPress, children: circle }));
}
