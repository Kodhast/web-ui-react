# web-ui-react

React-komponenter ovanpå [React Aria](https://react-spectrum.adobe.com/react-aria/) som sätter
[web-ui](https://github.com/Kodhast/web-ui):s `kh-*`-klasser. web-ui ger utseendet (som följer android-ui),
React Aria tryck, fokus och tangentbord. Biblioteket har inget eget CSS. Varför: [beslut 0001](docs/beslut/0001-react-aria-kh-js-och-bygget.md).

## Använda i en app

```json
"dependencies": {
	"@kodhast/web-ui": "github:Kodhast/web-ui#v2.0.0",
	"@kodhast/web-ui-react": "github:Kodhast/web-ui-react#v0.1.0",
	"react": "^19.3.1",
	"react-dom": "^19.3.1"
}
```

Appen importerar web-ui:s tal och klasser och sitt eget tema (färger och typsnitt), som förut:

```ts
import '@kodhast/web-ui/tokens.css';
import '@kodhast/web-ui/kh.css';
import './tema.css';
```

`kh.js` behövs inte för komponenterna här.

```tsx
import { Button } from '@kodhast/web-ui-react';

<Button variant="primary" onPress={spara} isPending={sparar}>
	Spara
</Button>;
```

## Komponenterna

| Komponent | web-ui      | android-ui  | Anmärkning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`  | `kh-btn`    | `AppButton` | `variant`: `tonal` (standard), `primary` (vyns primära handling, högst en per vy), `outlined`, `text`, `destructive`, `destructiveText`. `compact`, `block`, `icon` (en `<svg>` före texten), `isDisabled`, `isPending` (prickarna i ikonens ställe, `aria-busy`, trycks inte men behåller färgen och fokus; `isDisabled` vinner), `ref`. Övriga props som React Aria:s `Button` (`onPress`, `type`, `aria-label` …). `buttonClass()` ger klasserna för en länk som ska se ut som en knapp. |
| `Dots`    | `<kh-dots>` | `BrandDots` | `bouncing` hoppar. Ritar sina två `<i>` själv, utan `kh.js`.                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Galleriet

`npm run gallery` visar varje komponent ljust och mörkt med web-ui:s testtema (android-ui:s testpalett,
Roboto, `gallery/fonts/OFL.txt`). `npm run skarmdumpar` tar bilderna i `screenshots/` med samma namn
som web-ui:s, så att de kan jämföras med ögat.

## Versionshistorik

| Version | Ändring                                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1.0   | Grunden: `Button` och `Dots`, galleriet, beslut 0001 (React Aria i stället för `kh.js`, `dist/` incheckad). Kräver web-ui 2.x och React 19. |
