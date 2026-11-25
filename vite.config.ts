import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// `npm run gallery` serves the gallery; the library itself is built with tsc (see ADR 0001).
export default defineConfig({
	root: join(import.meta.dirname, 'gallery'),
	plugins: [react()],
	server: { port: 5180, strictPort: true },
	preview: { port: 5181, strictPort: true },
	build: { outDir: join(import.meta.dirname, 'gallery-dist'), emptyOutDir: true },
	test: {
		root: import.meta.dirname,
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['src/test-setup.ts'],
		expect: { requireAssertions: true },
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.test.{ts,tsx}',
				'src/**/*.test-helper.ts',
				'src/test-setup.ts',
				'src/index.ts'
			],
			thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 }
		}
	}
});
