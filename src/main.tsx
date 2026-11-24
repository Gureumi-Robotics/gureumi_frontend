import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from '@/App';

const rootElement = document.getElementById('root');

if (rootElement == null) {
  throw new Error('#root 요소를 찾을 수 없습니다.');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
