import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AuthProvider } from './utils/auth';
import { initMetaPixel } from './utils/metaPixel';
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

function App() {
  useEffect(() => {
    initMetaPixel(); // Dispara PageView init

    // Captura tags UTM da URL no momento em que a pessoa cai em qualquer tela do SaaS
    const urlParams = new URLSearchParams(window.location.search);
    if (Array.from(urlParams.keys()).length > 0) {
      const stored = localStorage.getItem('u3_utm_params');
      if (!stored) { // Só grava a primeira origem
        localStorage.setItem('u3_utm_params', urlParams.toString());
      }
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="clientes/:id" element={<ClientDetail />} />
            <Route path="leads" element={<Leads />} />
            <Route path="prospeccao" element={<Prospecting />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="reunioes" element={<Meetings />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="trafego" element={<Traffic />} />
            <Route path="academy" element={<Academy />} />
            <Route path="metas" element={<Goals />} />
            <Route path="pesquisas" element={<Surveys />} />
            <Route path="docs" element={<Settings />} /> {/* Simulated page for docs */}
            <Route path="configuracoes" element={<Settings />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="fluxos" element={<FlowEditor />} />
            <Route path="templates" element={<Templates />} />
            <Route path="whitelabel" element={<WhiteLabel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
