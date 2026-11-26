#!/usr/bin/env node
// Screenshots of the gallery's parts, light and dark, in screenshots/ with web-ui's and Roborazzi's names
// (e.g. AppButton_djup_light.png), so that they can be laid next to web-ui's images.
// 400 wide at scale 2.925 = 1170 pixels, like the Roborazzi images. Taken locally and checked in; CI takes none.
// In a cloud session: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium.
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
			// data-helskarm: a modal dialog or sheet covers the window, so the frame's first button opens it, the frame
			// is placed at the top (its content behind the backdrop) and the window is taken.
			const fullscreen = (await frame.getAttribute('data-helskarm')) !== null;
			if (fullscreen) {
				await frame.evaluate((element) => element.scrollIntoView({ block: 'start' }));
				await frame.locator('button').first().click();
				await page.locator('dialog:modal').waitFor();
				await page.mouse.move(0, 0);
			}
			// data-rull: a scrolled screen; two frames, so that the header has read the scroll.
			if ((await frame.getAttribute('data-rull')) !== null) {
				await frame.evaluate(
					() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
				);
			}
			// data-tid: bouncing dots stand still this many ms into the period (like the Roborazzi test's clock).
			const time = await frame.getAttribute('data-tid');
			if (time) {
				await frame.evaluate((element, ms) => {
					for (const animation of element.getAnimations({ subtree: true })) {
						// Scroll-driven animations (the blur under the top bar) follow the scroll, not the clock.
						if (!(animation.timeline instanceof DocumentTimeline)) continue;
						animation.pause();
						animation.currentTime = ms;
					}
				}, Number(time));
			}
			await (fullscreen ? page : frame).screenshot({
				path: join(out, `${name}_${suffix}.png`),
				animations: time ? 'allow' : 'disabled'
			});
			if (fullscreen) {
				await page.keyboard.press('Escape');
				await page.locator('dialog:modal').waitFor({ state: 'detached' });
			}
		}
		console.log(`${frames.length} skärmdumpar (${suffix}).`);
		await page.close();
	}
} finally {
	await browser.close();
	await new Promise((done) => server.httpServer.close(done));
}
