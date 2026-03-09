import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/auth';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Leads from './pages/Leads';
import Meetings from './pages/Meetings';
import Goals from './pages/Goals';
import Surveys from './pages/Surveys';
import Settings from './pages/Settings';
import Traffic from './pages/Traffic';
import Academy from './pages/Academy';
import Inbox from './pages/Inbox';
import FlowEditor from './pages/FlowEditor';
import Templates from './pages/Templates';
import Financeiro from './pages/Financeiro';
import Tarefas from './pages/Tarefas';
import WhiteLabel from './pages/WhiteLabel';
import Prospecting from './pages/Prospecting';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/clientes/:id" element={<ClientDetail />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/prospeccao" element={<Prospecting />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/reunioes" element={<Meetings />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/trafego" element={<Traffic />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/pesquisas" element={<Surveys />} />
            <Route path="/docs" element={<Settings />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/fluxos" element={<FlowEditor />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/whitelabel" element={<WhiteLabel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
