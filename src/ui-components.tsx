import './styles/base.css';
import './styles/ui-components.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { UiComponentsPage } from './components/ui-components/UiComponentsPage';

const gtmId = import.meta.env.VITE_GTM_ID?.trim();
if (import.meta.env.PROD && gtmId) {
  TagManager.initialize({ gtmId });
}

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('マウント先の #root が見つかりません');
}

createRoot(rootElement).render(
  <StrictMode>
    <UiComponentsPage />
  </StrictMode>
);
