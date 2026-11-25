#!/usr/bin/env node
// Skärmdumpar av galleriets delar, ljust och mörkt, i screenshots/ med web-ui:s och Roborazzi-bildernas
// namn (t.ex. AppButton_djup_light.png), så att de kan läggas bredvid web-ui:s bilder.
// 400 breda i 2,925 skala = 1170 bildpunkter, som Roborazzi-bilderna. Tas lokalt och checkas in; CI tar inga.
// I en molnsession: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium.
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { build, preview } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'screenshots');
mkdirSync(out, { recursive: true });

await build({
	root: join(root, 'gallery'),
	configFile: join(root, 'vite.config.ts'),
	logLevel: 'warn'
});
const server = await preview({ configFile: join(root, 'vite.config.ts') });
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error('Förhandsvisningen av galleriet startade inte.');

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
try {
	for (const [tema, suffix] of [
		['ljust', 'light'],
		['mork', 'dark']
	]) {
		const page = await browser.newPage({
			viewport: { width: 440, height: 900 },
			deviceScaleFactor: 2.925
		});
		await page.goto(`${url}?tema=${tema}`);
		await page.locator('[data-skarmdump]').first().waitFor();
		await page.evaluate(() => document.fonts.ready);
		const frames = await page.locator('[data-skarmdump]').all();
		for (const frame of frames) {
			const name = await frame.getAttribute('data-skarmdump');
			await frame.scrollIntoViewIfNeeded();
			// data-tid: prickar som hoppar står still så många ms in i perioden (som Roborazzi-provets klocka).
			const time = await frame.getAttribute('data-tid');
			if (time) {
				await frame.evaluate((element, ms) => {
					for (const animation of element.getAnimations({ subtree: true })) {
						animation.pause();
						animation.currentTime = ms;
					}
				}, Number(time));
			}
			await frame.screenshot({
				path: join(out, `${name}_${suffix}.png`),
				animations: time ? 'allow' : 'disabled'
			});
		}
		console.log(`${frames.length} skärmdumpar (${suffix}).`);
		await page.close();
	}
} finally {
	await browser.close();
	await new Promise((done) => server.httpServer.close(done));
}
