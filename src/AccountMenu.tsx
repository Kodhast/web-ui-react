import { useState } from 'react';
import { Avatar } from './Avatar.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { Menu, MenuItem, MenuSeparator } from './Menu.js';
import { Row } from './Row.js';

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
export function AccountRow({
	name,
	email,
	photoUrl,
	provider = 'Inloggad med Google'
}: AccountRowProps) {
	const title = name || email || provider;
	const subtitle = email && email !== title ? email : provider !== title ? provider : undefined;
	return (
		<Row
			title={title}
			subtitle={subtitle}
			leading={<Avatar name={name || email} photoUrl={photoUrl} />}
		/>
	);
}

/** Icons as android-ui's (Lucide's lines, 24 with a stroke of 2). */
const line = {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2,
	strokeLinecap: 'round',
	strokeLinejoin: 'round'
} as const;
const SettingsIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path {...line} d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0z" />
		<path
			{...line}
			d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
		/>
	</svg>
);
const AboutIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path {...line} d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20zM12 16v-4M12 8h.01" />
	</svg>
);
const SignOutIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path {...line} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
	</svg>
);
const SignInIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path {...line} d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
	</svg>
);

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
export function AccountMenu({
	account,
	appName,
	onOpenSettings,
	settingsHref,
	onOpenAbout,
	aboutHref,
	onSignOut,
	onSignIn,
	online
}: AccountMenuProps) {
	const [confirm, setConfirm] = useState(false);
	const connection = online === undefined ? '' : online ? ', ansluten' : ', utan anslutning';
	return (
		<>
			<Menu
				aria-label="Konto"
				trigger={
					<Avatar
						name={account?.name || account?.email}
						photoUrl={account?.photoUrl}
						online={online}
						aria-label={`Konto och inställningar${connection}`}
					/>
				}
				header={
					account && (
						<>
							<AccountRow {...account} />
							<MenuSeparatorLine />
						</>
					)
				}
			>
				<MenuItem icon={<SettingsIcon />} href={settingsHref} onAction={onOpenSettings}>
					Inställningar
				</MenuItem>
				<MenuItem icon={<AboutIcon />} href={aboutHref} onAction={onOpenAbout}>
					{`Om ${appName}`}
				</MenuItem>
				{(account || onSignIn) && <MenuSeparator />}
				{account ? (
					<MenuItem icon={<SignOutIcon />} onAction={() => setConfirm(true)}>
						Logga ut
					</MenuItem>
				) : (
					onSignIn && (
						<MenuItem icon={<SignInIcon />} onAction={onSignIn}>
							Logga in med Google
						</MenuItem>
					)
				)}
			</Menu>
			<ConfirmDialog
				isOpen={confirm}
				onOpenChange={setConfirm}
				title="Logga ut?"
				text={`Det du sparat i ${appName} finns kvar i ditt konto och kommer tillbaka när du loggar in igen.`}
				confirmLabel="Logga ut"
				onConfirm={onSignOut}
			/>
		</>
	);
}

/** The line under the account row, outside the menu's items. */
const MenuSeparatorLine = () => <hr className="kh-divider" />;
