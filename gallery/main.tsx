import '@kodhast/web-ui/tokens.css';
import '@kodhast/web-ui/kh.css';
import './theme-test.css';
import './galleri.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Gallery } from './Gallery';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Gallery />
	</StrictMode>
);
