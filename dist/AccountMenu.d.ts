/** The signed-in account: what there is of name, e-mail and Google's profile picture. */
export interface AccountInfo {
    name?: string | null;
    email?: string | null;
    photoUrl?: string | null;
}
export interface AccountRowProps extends AccountInfo {
    /** Under the name when there is no e-mail; standard "Inloggad med Google", as android-ui. */
    provider?: string;
}
/**
 * android-ui's AccountRow: the avatar, the name and the e-mail in a `kh-row`. Without a name the e-mail is the
 * title, and without either "Inloggad med Google".
 */
export declare function AccountRow({ name, email, photoUrl, provider }: AccountRowProps): import("react").JSX.Element;
export interface AccountMenuProps {
    /** The signed-in account; `null` when nobody is signed in (no account row, Logga in instead of Logga ut). */
    account: AccountInfo | null;
    /** The app's name, in "Om <appName>" and in the question before signing out. */
    appName: string;
    /** Inställningar: the app's settings. A link with `settingsHref`, else `onOpenSettings`. */
    onOpenSettings?: () => void;
    settingsHref?: string;
    /** Om <appName>: the app's about page. A link with `aboutHref`, else `onOpenAbout`. */
    onOpenAbout?: () => void;
    aboutHref?: string;
    /** Called after "Logga ut?" is confirmed. */
    onSignOut: () => void;
    /** Logga in med Google when nobody is signed in; without it no sign-in item. */
    onSignIn?: () => void;
    /** The avatar's dot: connected (`true`), not connected (`false`, no dot) or not shown (`undefined`). */
    online?: boolean;
}
/**
 * android-ui's AccountMenuAvatar: the avatar and the menu under it, in the same fixed order in every Kodhäst app
 * (android-ui #102, variant B) – the account row, Inställningar, Om <appName>, a line and Logga ut (which asks
 * "Logga ut?" first) or Logga in med Google.
 */
export declare function AccountMenu({ account, appName, onOpenSettings, settingsHref, onOpenAbout, aboutHref, onSignOut, onSignIn, online }: AccountMenuProps): import("react").JSX.Element;
