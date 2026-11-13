import styled from '@emotion/styled';
import { AppProviders } from '@/providers/AppProviders';
import { TodoList } from '@/components/TodoList';

export function App() {
  return (
    <AppProviders>
      <Title>Gureumi</Title>
      <TodoList />
    </AppProviders>
  );
}

const Title = styled.h1`
  margin: 0;
  padding: 24px;
`;
