import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
	AccountMenu,
	AccountRow,
	Avatar,
	BottomSheet,
	Button,
	Card,
	Chip,
	ConfirmDialog,
	Dots,
	EmptyState,
	FilterChips,
	Header,
	IconButton,
	Notice,
	PeriodPicker,
	Pill,
	Pills,
	ReorderList,
	Row,
	SegmentedChoice,
	Stepper,
	SwitchRow,
	TextField,
	Toolbar,
	TopBar
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
const Box = ({ className }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" aria-hidden="true">
		<path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A1 1 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88zM12 4.15 6.04 7.5 12 10.85l5.96-3.35zM5 15.91l6 3.38v-6.71L5 9.21zm14 0v-6.7l-6 3.37v6.71z" />
	</svg>
);

const ArrowBack = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path
			d="M19 12H5M12 19l-7-7 7-7"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const Archive = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path
			d="M4.5 4h15a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 19.5 9h-15A1.5 1.5 0 0 1 3 7.5v-2A1.5 1.5 0 0 1 4.5 4zM5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const Calendar = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
	</svg>
);
const Settings = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
	</svg>
);
const Play = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M8 5v14l11-7z" />
	</svg>
);

/** A made-up profile picture: a drawn face, no person's photo. */
const photo = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" fill="#7a9e7e"/><circle cx="36" cy="28" r="13" fill="#f3d6b8"/><path d="M12 72c2-16 12-24 24-24s22 8 24 24z" fill="#35577a"/></svg>'
)}`;
const anna = { name: 'Anna Berg', email: 'anna.berg@example.com' };

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
	scroll,
	click,
	tall = false,
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
	/**
	 * A screen with its own scrolling content (web-ui's ram--skarm and data-rull): scrolled this far, so that the
	 * header shows that state.
	 */
	scroll?: number;
	/** The screenshot presses this button in the frame first, e.g. one that opens a menu (data-klick in web-ui). */
	click?: string;
	/** A frame tall enough for an open menu (web-ui's ram--hog). */
	tall?: boolean;
	children: ReactNode;
}) {
	const scroller = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (scroller.current && scroll !== undefined) scroller.current.scrollTop = scroll;
	}, [scroll]);
	const frameClass = [
		'ram',
		scroll !== undefined && 'ram--skarm',
		tall && 'ram--hog',
		depth && 'kh-depth'
	]
		.filter(Boolean)
		.join(' ');
	return (
		<section className="galleri-del">
			<h2 className="kh-text-caption">
				{title} · {shot}
			</h2>
			<div
				className={frameClass}
				data-skarmdump={shot}
				data-tid={time}
				data-helskarm={fullscreen ? '' : undefined}
				data-rull={scroll}
				data-klick={click}
			>
				{scroll === undefined ? (
					children
				) : (
					<div className="rullar" ref={scroller}>
						{children}
					</div>
				)}
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

/** A top screen of a made-up time report under the header, as web-ui's AppHeader frames. */
const HeaderScreen = ({ bouncing = false, version }: { bouncing?: boolean; version?: string }) => (
	<>
		<Header
			icon={<Box />}
			name="Tidrapporten"
			title="Idag"
			subtitle="Torsdag 20 november"
			dots
			bouncing={bouncing}
			version={version}
			trailing={
				<button className="kh-avatar kh-avatar--online" type="button" aria-label="Konto">
					<span className="kh-avatar__circle">AB</span>
				</button>
			}
		/>
		<div className="ark">
			<Card>
				<Prov title="Utveckling" subtitle="08:00–11:30 · 3,5 h" />
			</Card>
		</div>
		<div className="fyll" />
	</>
);

/** The codes in a made-up customer's system, in their order (web-ui's Webb_dra_ordning). */
function CodeOrder() {
	const [codes, setCodes] = useState([
		{ id: '1001', title: '1001 Utveckling', textValue: '1001 Utveckling' },
		{ id: '1002', title: '1002 Möten', textValue: '1002 Möten' },
		{ id: '1003', title: '1003 Förvaltning', textValue: '1003 Förvaltning' },
		{ id: '1004', title: '1004 Intern tid', textValue: '1004 Intern tid' }
	]);
	return (
		<Card>
			<ReorderList
				items={codes}
				onReorder={(ids) => setCodes(ids.map((id) => codes.find((code) => code.id === id)!))}
				aria-label="Kund A:s koder"
			/>
		</Card>
	);
}

/** Idag, Veckan and Inställningar, as in the mockup. */
const tabs = [
	{ id: 'idag', label: 'Idag', icon: <Clock />, href: '#idag' },
	{ id: 'veckan', label: 'Veckan', icon: <Calendar />, href: '#veckan', badge: 2 },
	{ id: 'installningar', label: 'Inställningar', icon: <Settings />, href: '#installningar' }
];

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
				<Part title="Chipknapp" shot="Chip_knapp">
					<div className="kh-chips">
						<Chip trailing={<Expand />} aria-label="Byt tidkod, nu Utveckling">
							Utveckling
						</Chip>
						<Chip icon={<Add />}>Lägg till kod</Chip>
						<Chip isDisabled>Förvaltning</Chip>
					</div>
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
					<div className="rad tat">
						<IconButton aria-label="Tillbaka" tonal>
							<ArrowBack />
						</IconButton>
						<IconButton aria-label="Arkivera">
							<Archive />
						</IconButton>
					</div>
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
				<Part title="Periodväljare (bara webben)" shot="Webb_periodvaljare">
					<PeriodPicker
						label="Tisdag 24 november"
						previousLabel="Föregående dag"
						nextLabel="Nästa dag"
					/>
					<PeriodPicker
						label="Vecka 47 · 16–22 nov"
						previousLabel="Föregående vecka"
						nextLabel="Nästa vecka"
					/>
					<div className="smal">
						<PeriodPicker
							label="Vecka 47 · måndag 16 – söndag 22 november"
							previousLabel="Föregående vecka"
							nextLabel="Nästa vecka"
						/>
					</div>
				</Part>
				<Part title="Periodväljare med djup" shot="Webb_periodvaljare_djup" depth>
					<PeriodPicker
						label="Tisdag 24 november"
						previousLabel="Föregående dag"
						nextLabel="Nästa dag"
					/>
					<PeriodPicker
						label="Vecka 47 · 16–22 nov"
						previousLabel="Föregående vecka"
						nextLabel="Nästa vecka"
					/>
				</Part>
				<Part title="Dra för att ändra ordning (bara webben)" shot="Webb_dra_ordning">
					<CodeOrder />
				</Part>
				<Part title="Dra för att ändra ordning med djup" shot="Webb_dra_ordning_djup" depth>
					<CodeOrder />
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
				<Part title="Ikonknappar" shot="AppIconButton_varianter">
					<div className="rad ikonrad">
						<IconButton aria-label="Tillbaka" tonal>
							<ArrowBack />
						</IconButton>
						<IconButton aria-label="Arkivera">
							<Archive />
						</IconButton>
						<IconButton aria-label="Lägg till" tonal isDisabled>
							<Add />
						</IconButton>
					</div>
				</Part>
				<Part title="Avatar" shot="AccountAvatar_lagen">
					<div className="rad">
						<Avatar
							name="Anna Berg"
							online
							onPress={() => {}}
							aria-label="Konto och inställningar, ansluten"
						/>
						<Avatar name="Anna Berg" onPress={() => {}} aria-label="Konto och inställningar" />
						<Avatar onPress={() => {}} aria-label="Konto och inställningar" />
					</div>
				</Part>
				<Part title="Avatar med foto" shot="AccountAvatar_foto">
					<div className="rad">
						<Avatar name="Anna Berg" photoUrl={photo} online />
						<Avatar name="Anna Berg" photoUrl={photo} />
					</div>
				</Part>
				<Part title="Kontorad" shot="AccountRow_standard">
					<Card>
						<AccountRow {...anna} photoUrl={photo} />
					</Card>
				</Part>
				<Part title="Kontomenyn öppen" shot="AccountMenu_inloggad" tall click=".kh-avatar">
					<div className="hoger">
						<AccountMenu
							account={anna}
							appName="Tidrapporten"
							online
							onOpenSettings={() => {}}
							onOpenAbout={() => {}}
							onSignOut={() => {}}
						/>
					</div>
				</Part>
				<Part title="Kontomenyn utloggad" shot="AccountMenuAvatar_utloggad" tall click=".kh-avatar">
					<div className="hoger">
						<AccountMenu
							account={null}
							appName="Tidrapporten"
							onOpenSettings={() => {}}
							onOpenAbout={() => {}}
							onSignOut={() => {}}
							onSignIn={() => {}}
						/>
					</div>
				</Part>
				<Part title="Sidhuvud i vila med version" shot="AppHeader_vila_version" depth scroll={0}>
					<HeaderScreen version="1.3.0" />
				</Part>
				<Part title="Sidhuvud i vila" shot="AppHeader_vila" depth scroll={0}>
					<HeaderScreen />
				</Part>
				<Part title="Sidhuvud ihopfällt" shot="AppHeader_ihopfalld" depth scroll={81}>
					<HeaderScreen />
				</Part>
				<Part title="Sidhuvud som synkar" shot="AppHeader_synkar" depth scroll={0} time={225}>
					<HeaderScreen bouncing />
				</Part>
				<Part title="Topprad" shot="AppTopBar_tillbakapil">
					<TopBar title="Standard" onBack={() => {}} />
					<TopBar title="Lägg till frånvaro" onBack={() => {}} plainBack />
					<TopBar title="Grön ton" onBack={() => {}} backTone="ton-gron" />
					<TopBar title="Blå via appen" onBack={() => {}} plainBack backTone="ton-bla" />
				</Part>
				<Part title="Topprad som hämtar" shot="AppTopBar_prickar_hamtar" time={225}>
					<TopBar title="Vecka 47" backHref="#veckan" bouncing />
				</Part>
				<Part title="Topprad med åtgärd" shot="Webb_topprad_atgard">
					<TopBar
						title="Måndag 17 nov"
						onBack={() => {}}
						dots
						actions={
							<Button variant="primary" compact>
								Spara
							</Button>
						}
					/>
				</Part>
				<Part title="Flikrad" shot="AppFloatingToolbar_flikar">
					<div className="vanster">
						<Toolbar tabs={tabs} selected="idag" aria-label="Flikar" />
					</div>
				</Part>
				<Part title="Flikrad med huvudknapp" shot="AppFloatingToolbar_huvudknapp">
					<div className="vanster">
						<Toolbar
							tabs={tabs}
							selected="veckan"
							aria-label="Flikar"
							action={{ label: 'Starta timern', icon: <Play />, onPress: () => {} }}
						/>
					</div>
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
