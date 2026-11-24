import { css, Global } from '@emotion/react';

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: #f7f8fa;
    color: #242b34;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  button {
    font: inherit;
  }
`;

export function GlobalStyle() {
  return <Global styles={globalStyles} />;
}
