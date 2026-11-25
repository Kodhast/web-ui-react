# web-ui-react – projektets grundregler

> web-ui:s utseende som React-komponenter: React Aria ger beteendet, web-ui:s `kh-*`-klasser
> utseendet. Vad som finns och hur en app använder det: [README.md](README.md). Varför saker är som de
> är: `docs/beslut/` (ett beslut per fil).

**Svarslängd:** håll chattsvar minimala. Kod, commits och PR-beskrivningar skrivs normalt.

**Ärliga svar:** säg emot när Mats har fel, och säg varför. Inget beröm för frågan, inga
artighetsfraser, inga ursäkter, ingen utfyllnad. Säg vad som är osäkert eller inte kontrollerat.
Ett nej mjukas inte upp. Påstå aldrig att något fungerar innan du kört det.

**Plan före kod bara för större ändringar:** nytt beteende, ny komponent, flera lager eller ett
vägval → plan i ett issue och Mats ok ("kör" eller `plan-godkänd`). Små fixar och dokument går direkt
till PR med raden `Liten ändring: <varför>`. Osäker → större. Skill `android:arbetsregler` är enda källan.

**Webbläsare och användare:** skill `android:webb` (bara Chrome på dator och Android, ingen särskild
hänsyn till skärmläsare men vanlig användbarhet).

**Repot är publikt.** Inga personuppgifter, ingen riktig data ur apparna och inga hemligheter i kod,
galleri, prov, commits eller issues. Galleriets data är påhittad.

## Reglerna

1. **Facit är web-ui, och bakom det android-ui.** En komponent här ser ut exakt som web-ui:s del
   (som följer android-ui:s komponent och Roborazzi-bild). Ett eget utseende är en avvikelse som ska
   ha Mats ok.
2. **Inget eget CSS.** Komponenterna sätter bara web-ui:s `kh-*`-klasser och ARIA-attribut, aldrig
   `style` eller andra klasser (prov i varje komponents test). Saknas något i web-ui läggs det där
   först, med en ny version av web-ui.
3. **React Aria äger beteendet; `kh.js` används inte** (beslut 0001). Ett element ur `kh.js` utan
   motsvarighet i React Aria avgörs per komponent, och inget tillstånd får ha två ägare.
4. **Varje komponent finns i galleriet** (`gallery/`, samma ramar och namn som web-ui:s galleri) med
   skärmdump ljust och mörkt (`npm run skarmdumpar`, checkas in) och ett beteendeprov i Vitest. Bilderna
   jämförs med ögat mot web-ui:s i PR:en. Instabila prov är buggar – gör dem deterministiska.
5. **`dist/` checkas in** i varje PR som ändrar `src/` (`npm run build`); `npm run verify` fäller en
   inaktuell `dist/` (beslut 0001).
6. **Versionen höjs i varje PR som ändrar biblioteket** (`version` i `package.json`, raden i README:s
   versionshistorik): major = brytande (borttagen eller ändrad prop eller export), minor = ny komponent
   eller prop, patch = rättelse. Taggen skapas efter mergen med Actions → Tagga.
7. **CI-budget:** ett jobb (`ci.yml`), en PR kostar högst ett par Actions-minuter. Skärmdumparna tas
   lokalt; CI startar ingen webbläsare.
8. **Bara tillåtna actions:** GitHubs egna (`actions/*`) plus det organisationen tillåtit. Allt annat
   körs som npm-verktyg med `npx`. En ny action kräver Mats ok.
9. **En PR i taget**, mot `main`, squash-merge.

## Språk

Engelska i koden: identifierare, props och kodkommentarer. Svenska i allt annat: dokument, galleri,
commits, issues och PR:er.

## Kommandon

    npm ci
    npm run verify        # före varje push: typkontroll, lint, Vitest med täckning, dist/ aktuell
    npm run build         # dist/ efter ändring i src/ – checka in
    npm run gallery       # galleriet på http://localhost:5180
    npm run skarmdumpar   # bilderna i screenshots/ – checka in

I en molnsession: Node 24 (`.nvmrc`) och `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium` för
skärmdumparna.

## Arbetsflöde och modellval

Issue till PR följer skill `android:arbetsflode` (stommen); basgren `main`. Granskning: `/code-review`
tills repot har en egen granskare. Modellval: skill `android:ai-model-choice` – Opus 5.5 som standard,
Sonnet för en enskild komponent enligt mönstret, Fable 5.2 bara med skäl och medium eller high effort.
