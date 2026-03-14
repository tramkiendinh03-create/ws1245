import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

$(() => {
  const container = document.getElementById('app');
  if (!container) {
    throw new Error('[baihe] missing #app mount node');
  }

  const root = createRoot(container);
  root.render(createElement(App));

  $(window).on('pagehide', () => {
    root.unmount();
  });
});
