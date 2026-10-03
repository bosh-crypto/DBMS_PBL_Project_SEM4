// Routing: /login is public. Everything else sits inside <Layout> (sidebar) and needs login.
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UtilityPage from './pages/UtilityPage';
import Layout from './components/Layout';

const Protected = ({ children }) => (useAuth().user ? children : <Navigate to="/login" />);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/electricity" element={<UtilityPage key="electricity" type="electricity" />} />
        <Route path="/gas" element={<UtilityPage key="gas" type="gas" />} />
        <Route path="/water" element={<UtilityPage key="water" type="water" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
