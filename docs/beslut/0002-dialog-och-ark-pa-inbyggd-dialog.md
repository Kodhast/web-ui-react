# 0002. Dialog och ark på inbyggd `<dialog>` med React Aria:s krokar

- **Status:** Beslutat
- **Datum:** 2026-11-25

## Sammanhang

`ConfirmDialog` och `BottomSheet` (issue 5) ska se ut som web-ui:s `kh-dialog` och `kh-sheet`. web-ui 2.x
bygger båda på en inbyggd `<dialog>` som öppnas med `showModal()`:

- slöjan och oskärpan bakom är `:is(.kh-dialog, .kh-sheet)::backdrop`,
- `.kh-dialog:not([open])` och `.kh-sheet:not([open])` är dolda; bara `[open]` visas,
- arkets plats längst ned (`margin: auto auto 0`) räknar med det översta lagret (top layer).

React Aria:s `ModalOverlay` och `Modal` ritar `<div>`:ar. De har ingen `::backdrop`, ett `<div class="kh-dialog">`
saknar `open` och döljs av `kh.css`, och `ModalOverlay` sätter alltid `style` (`--visual-viewport-height` m.fl.).
web-ui:s utseende skulle alltså kräva eget CSS och `style`, vilket regel 2 förbjuder.

## Beslut

- **Komponenterna ritar en egen `<dialog>` och öppnar den med `showModal()`** när den monteras. Den finns bara
  i DOM:en medan `isOpen` är sant; att stänga är att avmontera. Appen äger öppet och stängt (`isOpen`,
  `onOpenChange`), ingen annan.
- **React Aria:s krokar äger beteendet**, inte `RAC`-komponenterna: `useDialog` (roll, namn ur rubriken,
  beskrivning ur texten), `FocusScope` (`autoFocus` till första fältet eller Avbryt, `contain` för Tab,
  `restoreFocus` till knappen som öppnade) och `useOverlay` (Escape, och bara det översta lagret stänger).
- **Webbläsaren gör det som bara den kan:** slöjan med oskärpa, det översta lagret och att sidan bakom är
  inert. Webbläsarens egen stängning tas över: Escape-tangenten hindras (`preventDefault` på `keydown`) och
  `cancel` (Androids bakåt) hindras och blir `onOpenChange(false)` om dialogen får stängas. Stänger
  webbläsaren ändå (ett upprepat bakåt utan tryck emellan kan inte hindras) följer `onOpenChange(false)`.
- **Ett tryck på slöjan** landar på `<dialog>` själv, utanför dess ruta. Det stänger bara om trycket både
  börjar och slutar där, så att en markering som dras ut ur dialogen inte stänger den. React Aria har ingen
  krok för `::backdrop`; det här är den enda egna beteendekoden.
- **En destruktiv fråga** (`destructive`) stängs bara med knapparna: inte med Escape, bakåt eller slöjan.

### Provet

Galleriets `ConfirmDialog_oskarpa` och `AppBottomSheet_oskarpa` (ljust och mörkt, hela fönstret) visar
slöjan med oskärpa och arkets grepp som web-ui:s bilder med samma namn. I Chromium (Playwright, galleriet):
första fältet fick fokus, ett tryck på slöjan stängde arket och fokus gick tillbaka till knappen, ett tryck i
dialogen stängde den inte, och en `<dialog>` med `keydown`-Escape hindrad var öppen efter tre Escape.
**Inte kontrollerat på en riktig Android-telefon** (bakåt-gesten).

## Följder

- jsdom har `<dialog>` men inte `showModal()`; `src/test-setup.ts` sätter bara `open` och skickar `close`.
  Proven visar React Aria:s del (fokus, Tab, Escape, `cancel`, slöjan), inte webbläsarens lager.
- Sidan bakom rullar fortfarande med hjulet över slöjan, som i web-ui. React Aria:s `usePreventScroll`
  används inte eftersom den sätter `style` på `<html>`. Ska sidan stå still läggs det i web-ui:s `kh.css`
  (t.ex. `html:has(dialog:modal) { overflow: hidden }`).
- Ingen in- och utanimering: web-ui har ingen.
