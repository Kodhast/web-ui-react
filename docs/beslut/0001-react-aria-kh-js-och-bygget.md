# 0001. React Aria i stället för kh.js, och dist/ incheckad

- **Status:** Beslutat
- **Datum:** 2026-11-25

## Sammanhang

web-ui-react ska ge Kodhästs React-appar web-ui:s utseende som komponenter (Tidrapporten först).
Webbstacken är beslutad: komponenter ovanpå `react-aria-components` som sätter web-ui:s `kh-*`-klasser,
och web-ui hämtas via tagg utan att CSS:en kopieras (Tidrapportens ADR 0005, issue #1). Tre frågor
stod öppna:

1. web-ui har beteende i `kh.js`: egna element som `<kh-segmented>`, `<kh-toolbar>`, `<kh-time-picker>`,
   `<kh-stepper>`, `<kh-header>`, `<kh-refresh>`, `<kh-swipe>` och `<kh-dots>`. En React Aria-komponent
   ovanpå dem får två ägare till samma beteende.
2. Komponenterna är TSX. Någon måste bygga dem, och appar hämtar biblioteket som en git-tagg.
3. Knappen som arbetar visar prickarna `<kh-dots>`, som `kh.js` fyller i.

### Provet

Segmentvalet byggdes två gånger med samma prov (Vitest och user-event, jsdom, web-ui 2.0.0). Knappen
har inget `kh.js`-element och kunde inte avgöra frågan.

|                                             | React Aria `ToggleButtonGroup` + `kh-segmented`-klasser | Omslag kring `<kh-segmented>` och `kh-select`                                                                  |
| ------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Tryck väljer                                | ja                                                      | ja                                                                                                             |
| Kontrollerat värde: föräldern avböjer bytet | visar fortfarande det gamla valet (rätt)                | **visar det nya valet** – `kh.js` skrev `aria-checked` och React ritade inte om                                |
| Tabb                                        | ett stopp för gruppen (roving tabindex)                 | ett stopp per segment                                                                                          |
| Pilar                                       | flyttar fokus, väljer inte                              | flyttar fokus och väljer                                                                                       |
| Kod                                         | 28 rader                                                | 41 rader, med en händelselyssnare, en ref och en effekt som skriver tillbaka valet – och ändå fel i raden ovan |

Märkningen blev densamma: React Aria ger `role="radio"` och `aria-checked`, som `kh-segmented` redan
läser. Provkoden är inte incheckad.

Knappens tryck prövades också i Chromium med galleriet: med mus får React Aria-knappen `:active` och
web-ui:s tryckläge (lagret och krympningen med `kh-depth`) som en vanlig `<button>`. Med beröring
(CDP-tryck i huvudlös Chromium) fick varken React Aria-knappen eller en vanlig `<button>` `:active`,
så provet säger inget om telefonen. **Inte kontrollerat på en riktig Android-telefon.** React Aria
sätter dessutom `data-pressed` under trycket.

## Beslut

- **React Aria äger beteendet. web-ui-react använder inte `kh.js`.** Komponenterna sätter bara
  `kh-*`-klasser och ARIA-attribut som `kh.css` läser. Appen behöver inte ladda `kh.js` för
  web-ui-reacts komponenter.
- **Ett `kh.js`-element utan motsvarighet i React Aria** (sidhuvudet som krymper, dra ned, svep) avgörs
  per komponent i sitt issue: beteendet flyttas till en React-hook, eller elementet slås in – men bara om
  elementet inte äger något tillstånd som React också styr. Det tillståndet får aldrig ha två ägare.
- **Byggsteget är `tsc` till `dist/`** (ESM och `.d.ts`, ingen bundler, relativa importer med `.js`).
  `dist/` checkas in i varje PR som ändrar `src/`, och `npm run verify` fäller en inaktuell `dist/`
  (`scripts/dist-check.mjs`). Då fungerar `github:Kodhast/web-ui-react#vX.Y.Z` utan installationsskript.
- **Prickarna är en egen komponent, `Dots`,** som ritar `<kh-dots>` med sina två `<i>`. De ser rätt ut
  utan `kh.js`, och `kh.js` lägger inte till något om en app ändå laddar den.
- **`react`, `react-dom` och `@kodhast/web-ui` är `peerDependencies`.** Appen äger versionerna och
  importerar web-ui:s `tokens.css` och `kh.css` själv, som i dag.

## Följder

- Segmentvalet i Kodhast/Tidrapporten#30 byggs med React Aria. Ska pilarna välja som i `kh.js` passar
  `RadioGroup` bättre än `ToggleButtonGroup`; avgörs där.
- `kh.css` måste fortsätta läsa ARIA-attribut (`aria-checked`, `aria-pressed`, `aria-busy`,
  `aria-disabled`) och inte klasser som bara `kh.js` sätter. En del som kräver en sådan klass läggs till
  i web-ui först.
- Fungerar trycket inte på telefonen (lagret syns inte när knappen trycks) läggs `[data-pressed]`
  till bredvid `:active` i web-ui:s `kh.css` – en web-ui-ändring, inte en egen stil här.
- Varje PR som ändrar `src/` kör `npm run build` och checkar in `dist/`; diffen blir större, men CI
  fångar en glömd byggning.
