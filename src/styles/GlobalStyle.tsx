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
    -webkit-font-smoothing: antialiased;
  }

  button {
    font: inherit;
  }
`;

export function GlobalStyle() {
  return <Global styles={globalStyles} />;
}
