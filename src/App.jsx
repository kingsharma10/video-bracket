import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HostView from './pages/HostView';
import VotePage from './pages/VotePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostView />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </BrowserRouter>
  );
}
