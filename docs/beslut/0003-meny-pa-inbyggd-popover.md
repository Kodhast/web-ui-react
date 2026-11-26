# 0003. Menyn på inbyggd popover med React Aria:s `Menu`

- **Status:** Beslutat
- **Datum:** 2026-11-26

## Sammanhang

Kontots meny (`AccountMenu`, issue 18) och andra menyer ska se ut som web-ui:s `kh-menu`. web-ui bygger menyn
på en inbyggd popover (`<div class="kh-menu" popover>`) som öppnas av en knapp med `popovertarget`:

- `.kh-menu:popover-open` visas, annars inte,
- menyn placeras under knappen, linjerad med dess högerkant, med `position-area` (CSS-förankring), och
  vänds med `position-try-fallbacks` när den inte ryms,
- `kh.js` sätter `anchor-name` och `position-anchor` med `style` och sköter `aria-expanded`.

React Aria:s `Popover` (och `MenuTrigger` med den) ritar en egen `<div>` och placerar den med `style`
(`position`, `top`, `left`, `max-height` …). Det förbjuder regel 2, och `kh.js` används inte (beslut 0001).

## Beslut

- **Webbläsaren öppnar, förankrar och stänger.** `Menu` ritar `<div class="kh-menu" popover="auto">` och ger sin
  knapp `popovertarget`. Chrome gör då knappen till menyns underförstådda ankare (implicit anchor), så web-ui:s
  `position-area` placerar menyn utan `anchor-name` eller `style`. Escape, ett tryck utanför och Androids
  bakåt stänger menyn (light dismiss), och fokus går tillbaka till knappen.
- **React Aria:s `Menu`, `MenuItem` och `Separator` (RAC) äger beteendet inuti:** rollerna `menu` och
  `menuitem`, pilarna, Home/End, sökning på bokstav och val med Enter, mellanslag eller tryck. `Menu` står
  inne i popovern utan egen klass; den sätter ingen `style`.
- **Det egna är två rader:** när popovern öppnas (`toggle`) får första valet fokus, och knappens
  `aria-expanded` följer läget. Ett val stänger menyn med `hidePopover()` (`onClose`).
- **Knappen är en vanlig `<button>`**, inte React Aria:s `Button`, eftersom den måste bära `popovertarget`.
  `Avatar` är en sådan knapp.
- **Det som inte är ett val** (kontoraden) står i popovern ovanför React Aria:s `menu`, så att det inte blir ett
  `menuitem`.

### Provet

Galleriets `AccountMenu_inloggad` (ljust och mörkt): i Chromium (Playwright) öppnade ett tryck på avataren menyn
under den, linjerad med högerkanten, utan `kh.js` och utan `style`; Escape stängde den. **Inte kontrollerat på en
riktig Android-telefon** (bakåt-gesten).

## Följder

- Förankringen kräver Chromes stöd för CSS-förankring och implicit ankare från `popovertarget`; bara Chrome
  stöds (skill `android:webb`).
- jsdom har ingen popover. `src/test-setup.ts` står för `showPopover()`, `hidePopover()`, `togglePopover()`,
  `toggle`-händelsen och knappens `popovertarget`; proven visar React Aria:s del och den egna koden, inte
  webbläsarens lager eller förankringen.
- Kontomenyns "Logga ut?" (`ConfirmDialog`) ligger i `AccountMenu`, som i android-ui, så att frågan och texten
  är likadana i alla appar.
