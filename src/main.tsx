// base.css → top.css の順を厳守する（@layer の宣言順が優先順位を決めるため）
import './styles/base.css';
import './styles/top.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import TagManager from 'react-gtm-module';

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
    <App />
  </StrictMode>
);
