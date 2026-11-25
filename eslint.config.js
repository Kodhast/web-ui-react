import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
	globalIgnores(['dist', 'gallery-dist', 'coverage', 'spike']),
	js.configs.recommended,
	ts.configs.recommended,
	reactHooks.configs.flat['recommended-latest'],
	prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// TypeScript checks undefined names itself; see typescript-eslint's FAQ.
			'no-undef': 'off'
		}
	}
);
