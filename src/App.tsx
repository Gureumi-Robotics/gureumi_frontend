import { Navigate, Route, Routes } from 'react-router';
import { AppProviders } from '@/providers/AppProviders';
import { RobotControlPage } from '@/pages/RobotControlPage';

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<RobotControlPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  );
}
