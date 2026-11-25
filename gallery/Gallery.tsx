import type { ReactNode } from 'react';
import { Button } from '../src';

/** Material Symbols' add, as in web-ui's gallery. */
const Add = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
	</svg>
);

/** One part: its name, and the frame the screenshot is taken of (web-ui's and Roborazzi's name). */
function Part({
	title,
	shot,
	depth = false,
	time,
	children
}: {
	title: string;
	shot: string;
	depth?: boolean;
	/** Bouncing dots stand still this many ms into the period in the screenshot (data-tid in web-ui). */
	time?: number;
	children: ReactNode;
}) {
	return (
		<section className="galleri-del">
			<h2 className="kh-text-caption">
				{title} · {shot}
			</h2>
			<div className={depth ? 'ram kh-depth' : 'ram'} data-skarmdump={shot} data-tid={time}>
				{children}
			</div>
		</section>
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
			</main>
		</>
	);
}
