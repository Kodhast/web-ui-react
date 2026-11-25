import { useState, type ReactNode } from 'react';
import {
	BottomSheet,
	Button,
	Card,
	ConfirmDialog,
	Dots,
	EmptyState,
	FilterChips,
	Notice,
	Pill,
	Pills,
	Row,
	SegmentedChoice,
	Stepper,
	SwitchRow,
	TextField
} from '../src';

/** Material Symbols' add, as in web-ui's gallery. */
const Add = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
	</svg>
);

/** Material Symbols used in web-ui's gallery. */
const Clock = () => (
	<svg className="kh-icon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
	</svg>
);
const Check = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
	</svg>
);
const Expand = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
	</svg>
);
const Download = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2z" />
	</svg>
);
const Box = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A1 1 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88zM12 4.15 6.04 7.5 12 10.85l5.96-3.35zM5 15.91l6 3.38v-6.71L5 9.21zm14 0v-6.7l-6 3.37v6.71z" />
	</svg>
);

/** A card's content without rows (web-ui's .prov). */
const Prov = ({ title, subtitle }: { title: string; subtitle: string }) => (
	<div className="prov">
		<span className="kh-text-item-title">{title}</span>
		<span className="kh-text-item-subtitle">{subtitle}</span>
	</div>
);

/** One part: its name, and the frame the screenshot is taken of (web-ui's and Roborazzi's name). */
function Part({
	title,
	shot,
	depth = false,
	time,
	fullscreen = false,
	children
}: {
	title: string;
	shot: string;
	depth?: boolean;
	/** Bouncing dots stand still this many ms into the period in the screenshot (data-tid in web-ui). */
	time?: number;
	/**
	 * A modal dialog or sheet (data-helskarm in web-ui): the screenshot presses the frame's first button and takes the
	 * whole window, since the backdrop covers it.
	 */
	fullscreen?: boolean;
	children: ReactNode;
}) {
	return (
		<section className="galleri-del">
			<h2 className="kh-text-caption">
				{title} · {shot}
			</h2>
			<div
				className={depth ? 'ram kh-depth' : 'ram'}
				data-skarmdump={shot}
				data-tid={time}
				data-helskarm={fullscreen ? '' : undefined}
			>
				{children}
			</div>
		</section>
	);
}

/** Made-up cards behind a modal, as in web-ui's gallery, so that the blur shows. */
const Behind = () => (
	<>
		<Card>
			<Prov title="Måndag 17 nov" subtitle="08:00–16:30 · 8 h" />
		</Card>
		<Card>
			<Prov title="Tisdag 18 nov" subtitle="07:45–16:15 · 8 h" />
		</Card>
		<Card>
			<Prov title="Onsdag 19 nov" subtitle="08:30–17:00 · 8 h" />
		</Card>
		<Card>
			<Prov title="Torsdag 20 nov" subtitle="08:00–15:00 · 6,5 h" />
		</Card>
		<Card>
			<Prov title="Fredag 21 nov" subtitle="08:00–16:00 · 7,5 h" />
		</Card>
		<Card>
			<Prov title="Vecka 47" subtitle="Låst · 38 h" />
		</Card>
	</>
);

function DialogDemo() {
	const [isOpen, setOpen] = useState(false);
	return (
		<>
			<div className="rad">
				<Button compact onPress={() => setOpen(true)}>
					Öppna dialogen
				</Button>
			</div>
			<Behind />
			<ConfirmDialog
				title="Lås upp veckan?"
				text="Vecka 47 är skickad. Ändringen loggas med ditt skäl."
				confirmLabel="Lås upp"
				onConfirm={() => {}}
				isOpen={isOpen}
				onOpenChange={setOpen}
			>
				<TextField label="Skäl" defaultValue="Glömde fredagens möte" />
			</ConfirmDialog>
		</>
	);
}

function SheetDemo() {
	const [isOpen, setOpen] = useState(false);
	return (
		<>
			<div className="rad">
				<Button compact onPress={() => setOpen(true)}>
					Öppna arket
				</Button>
			</div>
			<Behind />
			<BottomSheet
				title="Ändra intervall"
				subtitle="Torsdag 20 november"
				isOpen={isOpen}
				onOpenChange={setOpen}
				footer={
					<>
						<Button variant="text" onPress={() => setOpen(false)}>
							Avbryt
						</Button>
						<Button variant="primary" onPress={() => setOpen(false)}>
							Spara
						</Button>
					</>
				}
			>
				<TextField label="Från" defaultValue="08:00" inputMode="numeric" />
				<TextField label="Till" defaultValue="15:00" inputMode="numeric" />
			</BottomSheet>
		</>
	);
}

const toggleTheme = () => {
	const root = document.documentElement;
	root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
};

export function Gallery() {
	return (
		<>
			<header className="galleri-topp">
				<h1 className="kh-text-section-title">web-ui-react · galleri</h1>
				<Button compact onPress={toggleTheme}>
					Byt tema
				</Button>
			</header>
			<main>
				<Part title="Knappar" shot="AppButton_varianter">
					<Button variant="primary" block icon={<Add />}>
						Logga in
					</Button>
					<Button variant="primary" block isPending>
						Loggar in …
					</Button>
					<div className="rad">
						<Button>Lägg till</Button>
					</div>
					<div className="rad">
						<Button variant="text">Avbryt</Button>
					</div>
					<div className="rad">
						<Button variant="primary" isDisabled>
							Spara
						</Button>
					</div>
					<div className="rad">
						<Button variant="destructive">Radera</Button>
					</div>
					<div className="rad">
						<Button variant="primary" compact>
							Spara
						</Button>
					</div>
				</Part>
				<Part title="Knappar med djup" shot="AppButton_djup" depth>
					<Button variant="primary" block icon={<Add />}>
						Logga in
					</Button>
					<div className="rad">
						<Button>Lägg till</Button>
						<Button variant="outlined">Visa alla</Button>
					</div>
					<div className="rad">
						<Button variant="destructive">Radera</Button>
						<Button variant="text">Avbryt</Button>
					</div>
					<div className="rad">
						<Button variant="primary" isDisabled>
							Spara
						</Button>
						<Button variant="primary" isPending>
							Sparar …
						</Button>
						<Button variant="primary" compact>
							Spara
						</Button>
					</div>
				</Part>
				<Part title="Knapp som arbetar, med prickar" shot="AppButton_laddar_prickar" time={225}>
					<div className="rad">
						<Button variant="primary" isPending>
							Sparar …
						</Button>
					</div>
				</Part>
				<Part title="Övriga varianter" shot="AppButton_ovriga">
					<div className="rad">
						<Button variant="outlined">Visa alla</Button>
						<Button variant="destructiveText" compact>
							Radera
						</Button>
					</div>
					<Button block isPending icon={<Add />}>
						Hämtar
					</Button>
				</Part>
				<Part title="Prickar" shot="BrandDots_lagen" time={225}>
					<div className="rad">
						<Dots />
						<Dots bouncing />
					</div>
				</Part>
				<Part title="Kort" shot="AppCard_varianter">
					<Card>
						<Prov title="Solkräm" subtitle="1 tub per 7 dagar" />
						<Prov title="Plåster" subtitle="1 förpackning" />
					</Card>
					<Card tone="ton-gron">
						<Prov title="Allt är packat" subtitle="12 av 12" />
					</Card>
					<Card onPress={() => {}} aria-label="Öppna">
						<Clock />
					</Card>
				</Part>
				<Part title="Kort med djup" shot="AppCard_djup" depth>
					<Card href="#">
						<Row title="Resa till Kreta" subtitle="12–19 juni · 3 personer" navigates />
					</Card>
					<Card>
						<Prov title="Alvedon 500 mg" subtitle="18 st" />
						<Prov title="Loratadin 10 mg" subtitle="8 st" />
						<Prov title="Skavsårsplåster" subtitle="1 förp." />
					</Card>
					<Card tone="ton-gron">
						<Prov title="Allt packat" subtitle="Inget saknas" />
					</Card>
				</Part>
				<Part title="Listrader" shot="ItemRow_varianter">
					<Card>
						<Row title="Alvedon 500 mg" subtitle="2 tabletter per dag" href="#" navigates />
						<Row title="Solkräm" subtitle="1 tub" tinted done />
						<Row
							title="Plåster"
							subtitle="Lisa"
							accentClass="accent-bla"
							trailing={<Pill tone="ton-gron">3 st</Pill>}
						/>
						<Row
							title="Hydrokortison"
							subtitle="Pausat – räknas inte med"
							inactive
							href="#"
							navigates
						/>
						<Row title="Promenad" subtitle="45 minuter" leading={<Clock />} />
					</Card>
				</Part>
				<Part title="Pills" shot="InfoPill_varianter">
					<Pills>
						<Pill>3 kvar</Pill>
						<Pill tone="ton-gron">
							<Check />
							Packad
						</Pill>
						<Pill onPress={() => {}}>Synkas</Pill>
						<Pill onPress={() => {}}>
							Vecka
							<Expand />
						</Pill>
						<Pill tone="ton-gron">Glad</Pill>
					</Pills>
				</Part>
				<Part title="Valchip" shot="AppFilterChip_lagen">
					<FilterChips
						aria-label="Form"
						defaultSelected={['tablett']}
						options={[
							{ value: 'tablett', label: 'Tablett' },
							{ value: 'kapsel', label: 'Kapsel' },
							{ value: 'plaster', label: 'Plåster', icon: <Add /> },
							{ value: 'kram', label: 'Kräm', isDisabled: true }
						]}
					/>
				</Part>
				<Part title="Valda med djup" shot="Valda_djup" depth>
					<FilterChips
						aria-label="Visa"
						defaultSelected={['alla', 'kram']}
						options={[
							{ value: 'alla', label: 'Alla' },
							{ value: 'mediciner', label: 'Mediciner' },
							{ value: 'kram', label: 'Kräm', isDisabled: true }
						]}
					/>
					<FilterChips
						aria-label="Medicin"
						options={[
							{
								value: 'ipren',
								label: 'Ipren 400 mg',
								icon: <Clock />,
								pending: 'från 15:40'
							}
						]}
					/>
					<SegmentedChoice
						aria-label="Tema"
						defaultValue="ljust"
						options={[
							{ value: 'ljust', label: 'Ljust' },
							{ value: 'morkt', label: 'Mörkt' },
							{ value: 'auto', label: 'Auto' }
						]}
					/>
					<FilterChips
						aria-label="Symtom"
						defaultSelected={['huvudvark']}
						options={[{ value: 'huvudvark', label: 'Huvudvärk', count: 4, emphasized: true }]}
					/>
				</Part>
				<Part title="Reglagerader" shot="SwitchRow_varianter">
					<Card>
						<SwitchRow title="Påminnelser" subtitle="Varje dag 08:00" defaultSelected />
						<SwitchRow title="Kvällsdos" />
						<SwitchRow title="Mående" subtitle="Av" inactive />
					</Card>
				</Part>
				<Part title="Reglagerader med djup, låst" shot="Webb_reglage_djup" depth>
					<Card>
						<SwitchRow title="Matlåda" subtitle="Räkna med en portion till" defaultSelected />
						<SwitchRow title="Veckomeny på söndag" />
						<SwitchRow title="Låst på" defaultSelected isDisabled />
						<SwitchRow title="Låst av" isDisabled />
					</Card>
				</Part>
				<Part title="Stegare" shot="QuantityStepper_varianter">
					<div>
						<Stepper label="doser per dag" defaultValue={2} />
					</div>
					<div>
						<Stepper label="tabletter" defaultValue={0} isDisabled />
					</div>
					<div className="stegare-48">
						<Stepper label="minsta tid mellan doser" defaultValue={4} min={0} max={24} />
					</div>
				</Part>
				<Part title="Stegare med etikett" shot="QuantityStepper_etikett">
					<Stepper label="doser per dag" defaultValue={2} showLabel />
				</Part>
				<Part title="Stegare med djup" shot="Webb_stegare_djup" depth>
					<div>
						<Stepper label="portioner" defaultValue={4} min={1} max={12} />
					</div>
					<div>
						<Stepper label="portioner" defaultValue={1} min={1} max={12} />
					</div>
				</Part>
				<Part title="Segmentval" shot="AppSegmentedChoice_tema">
					<SegmentedChoice
						aria-label="Tema"
						defaultValue="system"
						options={[
							{ value: 'ljust', label: 'Ljust' },
							{ value: 'morkt', label: 'Mörkt' },
							{ value: 'system', label: 'System' }
						]}
					/>
				</Part>
				<Part title="Textfält" shot="AppTextField_lagen">
					<TextField
						label="Namn"
						defaultValue="Solkräm"
						description="Som det står på förpackningen"
					/>
					<TextField label="Styrka" errorMessage="Ange en styrka" />
					<TextField
						label="Anteckning"
						multiline
						defaultValue="Smörj in var annan timme, och efter bad."
					/>
					<TextField label="Doshöjning" defaultValue="25" inputMode="numeric" suffix="mg" />
				</Part>
				<Part title="Textfält med ikonknapp" shot="Webb_textfalt_ikonknapp">
					<TextField
						label="När är visningen?"
						defaultValue="sön 23 nov kl 13–14"
						description="Läses som söndag 23 november."
						action={{ icon: <Clock />, label: 'Välj dag och tid', onPress: () => {} }}
					/>
				</Part>
				<Part title="Meddelanderad" shot="NoticeBanner_lagen">
					<Notice
						href="#"
						icon={<Clock />}
						title="Notiser är avstängda"
						detail="Påminnelserna kan inte visas. Tryck för att slå på notiser för ReseApoteket."
					/>
					<Notice
						tone="ton-gron"
						icon={<Clock />}
						title="Health Connect kopplad"
						detail="Steg, puls och sömn visas här."
					/>
					<Notice
						tone="ton-bla"
						icon={<Download />}
						title="Health Connect saknas"
						detail="Installera Health Connect från Play Butik."
						action={<Button variant="primary">Installera</Button>}
					/>
				</Part>
				<Part title="Tomt läge" shot="EmptyState_varianter">
					<EmptyState
						icon={<Box />}
						title="Inga resor än"
						text="Lägg till en resa så räknar appen ut vad som ska packas."
						actions={<Button variant="primary">Lägg till resa</Button>}
						note="Du kan ändra allt senare."
					/>
					<Card>
						<EmptyState
							variant="compact"
							icon={<Clock />}
							title="För lite data än"
							text="Logga några dagar till så syns kurvan."
						/>
					</Card>
				</Part>
				<Part title="Ark med oskärpa" shot="AppBottomSheet_oskarpa" depth fullscreen>
					<SheetDemo />
				</Part>
				<Part title="Dialog med oskärpa" shot="ConfirmDialog_oskarpa" depth fullscreen>
					<DialogDemo />
				</Part>
			</main>
		</>
	);
}
