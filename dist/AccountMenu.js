import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Avatar } from './Avatar.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { Menu, MenuItem, MenuSeparator } from './Menu.js';
import { Row } from './Row.js';
/**
 * android-ui's AccountRow: the avatar, the name and the e-mail in a `kh-row`. Without a name the e-mail is the
 * title, and without either "Inloggad med Google".
 */
export function AccountRow({ name, email, photoUrl, provider = 'Inloggad med Google' }) {
    const title = name || email || provider;
    const subtitle = email && email !== title ? email : provider !== title ? provider : undefined;
    return (_jsx(Row, { title: title, subtitle: subtitle, leading: _jsx(Avatar, { name: name || email, photoUrl: photoUrl }) }));
}
/** Icons as android-ui's (Lucide's lines, 24 with a stroke of 2). */
const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
};
const SettingsIcon = () => (_jsxs("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("path", { ...line, d: "M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0z" }), _jsx("path", { ...line, d: "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" })] }));
const AboutIcon = () => (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { ...line, d: "M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20zM12 16v-4M12 8h.01" }) }));
const SignOutIcon = () => (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { ...line, d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" }) }));
const SignInIcon = () => (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { ...line, d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" }) }));
/**
 * android-ui's AccountMenuAvatar: the avatar and the menu under it, in the same fixed order in every Kodhäst app
 * (android-ui #102, variant B) – the account row, Inställningar, Om <appName>, a line and Logga ut (which asks
 * "Logga ut?" first) or Logga in med Google.
 */
export function AccountMenu({ account, appName, onOpenSettings, settingsHref, onOpenAbout, aboutHref, onSignOut, onSignIn, online }) {
    const [confirm, setConfirm] = useState(false);
    const connection = online === undefined ? '' : online ? ', ansluten' : ', utan anslutning';
    return (_jsxs(_Fragment, { children: [_jsxs(Menu, { "aria-label": "Konto", trigger: _jsx(Avatar, { name: account?.name || account?.email, photoUrl: account?.photoUrl, online: online, "aria-label": `Konto och inställningar${connection}` }), header: account && (_jsxs(_Fragment, { children: [_jsx(AccountRow, { ...account }), _jsx(MenuSeparatorLine, {})] })), children: [_jsx(MenuItem, { icon: _jsx(SettingsIcon, {}), href: settingsHref, onAction: onOpenSettings, children: "Inst\u00E4llningar" }), _jsx(MenuItem, { icon: _jsx(AboutIcon, {}), href: aboutHref, onAction: onOpenAbout, children: `Om ${appName}` }), (account || onSignIn) && _jsx(MenuSeparator, {}), account ? (_jsx(MenuItem, { icon: _jsx(SignOutIcon, {}), onAction: () => setConfirm(true), children: "Logga ut" })) : (onSignIn && (_jsx(MenuItem, { icon: _jsx(SignInIcon, {}), onAction: onSignIn, children: "Logga in med Google" })))] }), _jsx(ConfirmDialog, { isOpen: confirm, onOpenChange: setConfirm, title: "Logga ut?", text: `Det du sparat i ${appName} finns kvar i ditt konto och kommer tillbaka när du loggar in igen.`, confirmLabel: "Logga ut", onConfirm: onSignOut })] }));
}
/** The line under the account row, outside the menu's items. */
const MenuSeparatorLine = () => _jsx("hr", { className: "kh-divider" });
