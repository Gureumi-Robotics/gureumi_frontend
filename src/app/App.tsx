import styled from '@emotion/styled';
import { AppProviders } from './providers/AppProviders';

export function App() {
  return (
    <AppProviders>
      <Title>Gureumi</Title>
    </AppProviders>
  );
}

const Title = styled.h1`
  margin: 0;
  padding: 24px;
`;
