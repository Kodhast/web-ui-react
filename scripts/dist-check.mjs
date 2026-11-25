#!/usr/bin/env node
// dist/ is checked in, so that apps can install a git tag without a build step (ADR 0001). This
// builds src/ into a temporary folder and fails if dist/ differs: run `npm run build` and commit.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fresh = mkdtempSync(join(tmpdir(), 'web-ui-react-dist-'));

/** @param {string} dir @returns {string[]} */
const files = (dir) =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => relative(dir, join(entry.parentPath, entry.name)))
		.sort();

try {
	execFileSync(
		process.execPath,
		[join(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.build.json', '--outDir', fresh],
		{ cwd: root, stdio: 'inherit' }
	);
	const dist = join(root, 'dist');
	const expected = files(fresh);
	/** @type {string[]} */
	let actual = [];
	try {
		actual = files(dist);
	} catch {
		// No dist/ yet: every file counts as missing below.
	}
	const differs = [...new Set([...expected, ...actual])].filter((file) => {
		try {
			return readFileSync(join(fresh, file), 'utf8') !== readFileSync(join(dist, file), 'utf8');
		} catch {
			return true;
		}
	});
	if (differs.length > 0) {
		console.error(`dist/ är inaktuell (${differs.join(', ')}). Kör npm run build och checka in.`);
		process.exit(1);
	}
	console.log(`dist/ är aktuell (${expected.length} filer).`);
} finally {
	rmSync(fresh, { recursive: true, force: true });
}
