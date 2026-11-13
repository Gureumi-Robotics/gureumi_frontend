import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<any>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const visibleTodos = todos.filter((todo: Todo) => {
    if (filter == 'done') return todo.done;
    if (filter == 'active') return !todo.done;
    return true;
  });

  return (
    <Wrapper>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
      <ul>
        {visibleTodos.map((todo: Todo) => (
          <li>{todo.text}</li>
        ))}
      </ul>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px;
`;
