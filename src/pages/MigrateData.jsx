import { useState } from 'react';
import { useAuth } from '../utils/auth';
import { Upload, CheckCircle, AlertTriangle, Database } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

const MigrateData = () => {
    const { user } = useAuth();
    const [log, setLog] = useState([]);
    const [migrating, setMigrating] = useState(false);
    const [done, setDone] = useState(false);

    const addLog = (msg, type = 'info') => {
        setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const migrateAll = async () => {
        setMigrating(true);
        setLog([]);
        addLog('🚀 Iniciando migração de dados locais para o servidor...', 'info');

        // Keys to migrate (localStorage key → backend namespace/key)
        const keysToMigrate = [
            // Try all possible key formats the app ever used
            { localKeys: ['shared__u3_clients_v2', 'u3_clients_v2', 'clients_v2'], backendKey: 'u3_clients_v2' },
            { localKeys: ['shared__u3_tarefas', 'u3_tarefas', 'tarefas'], backendKey: 'u3_tarefas' },
            { localKeys: ['shared__u3_leads', 'u3_leads', 'leads'], backendKey: 'u3_leads' },
            { localKeys: ['shared__u3_meetings', 'u3_meetings', 'meetings'], backendKey: 'u3_meetings' },
            { localKeys: ['shared__u3_custos', 'u3_custos', 'custos'], backendKey: 'u3_custos' },
            { localKeys: ['shared__u3_caixa', 'u3_caixa', 'caixa'], backendKey: 'u3_caixa' },
            { localKeys: ['shared__u3_inadimplentes', 'u3_inadimplentes', 'inadimplentes'], backendKey: 'u3_inadimplentes' },
            { localKeys: ['shared__u3_goals', 'u3_goals', 'goals'], backendKey: 'u3_goals' },
            { localKeys: ['shared__u3_roadmaps', 'u3_roadmaps', 'roadmaps'], backendKey: 'u3_roadmaps' },
            { localKeys: ['shared__u3_nps_responses', 'u3_nps_responses', 'nps_responses'], backendKey: 'u3_nps_responses' },
            { localKeys: ['shared__u3_traffic_dashboard', 'u3_traffic_dashboard', 'traffic_dashboard'], backendKey: 'u3_traffic_dashboard' },
            { localKeys: ['shared__u3_flow_nodes', 'u3_flow_nodes', 'flow_nodes'], backendKey: 'u3_flow_nodes' },
            { localKeys: ['shared__u3_agencies', 'u3_agencies', 'agencies'], backendKey: 'u3_agencies' },
            { localKeys: ['shared__u3_academy_settings', 'u3_academy_settings', 'academy_settings'], backendKey: 'u3_academy_settings' },
        ];

        let totalMigrated = 0;

        for (const item of keysToMigrate) {
            let value = null;
            let foundKey = null;

            // Try each possible key format
            for (const key of item.localKeys) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    try {
                        value = JSON.parse(raw);
                        foundKey = key;
                        break;
                    } catch {}
                }
            }

            if (value !== null && value !== undefined) {
                const isEmpty = Array.isArray(value) ? value.length === 0 : 
                               (typeof value === 'object' ? Object.keys(value).length === 0 : false);
                
                if (isEmpty) {
                    addLog(`⏭️ ${item.backendKey}: vazio, pulando`, 'skip');
                    continue;
                }

                try {
                    const count = Array.isArray(value) ? value.length : 1;
                    addLog(`📤 Enviando ${item.backendKey} (${count} itens) de "${foundKey}"...`, 'info');
                    
                    const r = await fetch(`${API_BASE}/api/data/shared/${item.backendKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ value })
                    });
                    const d = await r.json();
                    
                    if (d.success) {
                        addLog(`✅ ${item.backendKey}: ${count} itens migrados com sucesso!`, 'success');
                        totalMigrated++;
                    } else {
                        addLog(`❌ ${item.backendKey}: falha ao salvar no servidor`, 'error');
                    }
                } catch (e) {
                    addLog(`❌ ${item.backendKey}: erro de conexão - ${e.message}`, 'error');
                }
            } else {
                addLog(`⏭️ ${item.backendKey}: não encontrado localmente`, 'skip');
            }
        }

        // Migrate users
        try {
            const usersRaw = localStorage.getItem('u3_users_db');
            if (usersRaw) {
                const users = JSON.parse(usersRaw);
                if (users.length > 0) {
                    addLog(`📤 Enviando ${users.length} usuários...`, 'info');
                    const r = await fetch(`${API_BASE}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ users })
                    });
                    const d = await r.json();
                    if (d.success) {
                        addLog(`✅ ${users.length} usuários migrados!`, 'success');
                        totalMigrated++;
                    }
                }
            }
        } catch {}

        addLog(`\n🎉 Migração concluída! ${totalMigrated} categorias enviadas ao servidor.`, 'done');
        setDone(true);
        setMigrating(false);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>⚡ Migração de Dados para o Servidor</h2>
                    <p className="text-muted">
                        Transfere todos os dados salvos localmente neste navegador para o banco de dados do servidor.
                        Após a migração, seus dados estarão disponíveis em qualquer dispositivo.
                    </p>
                </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: 16, backgroundColor: 'rgba(255, 246, 0, 0.05)', borderRadius: 12, border: '1px solid rgba(255, 246, 0, 0.15)' }}>
                    <AlertTriangle size={24} color="var(--warning)" />
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>Importante</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Execute esta migração <strong>no computador onde você criou seus clientes, tarefas e leads</strong>.
                            Os dados serão lidos do histórico do navegador deste computador e enviados ao servidor na nuvem.
                        </div>
                    </div>
                </div>

                {!migrating && !done && (
                    <button className="btn btn-primary" onClick={migrateAll} style={{ padding: '12px 32px', fontSize: '1rem' }}>
                        <Database size={20} style={{ marginRight: 8 }} />
                        Iniciar Migração Agora
                    </button>
                )}

                {done && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'rgba(0, 208, 132, 0.1)', borderRadius: 12, border: '1px solid rgba(0, 208, 132, 0.2)' }}>
                        <CheckCircle size={24} color="var(--success)" />
                        <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                            Migração concluída! Agora seus dados estarão disponíveis em todos os dispositivos.
                        </div>
                    </div>
                )}

                {log.length > 0 && (
                    <div style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--bg-primary)', borderRadius: 8, maxHeight: 400, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {log.map((entry, i) => (
                            <div key={i} style={{ 
                                padding: '4px 0', 
                                color: entry.type === 'success' ? 'var(--success)' : 
                                       entry.type === 'error' ? 'var(--danger)' : 
                                       entry.type === 'done' ? 'var(--accent-color)' :
                                       entry.type === 'skip' ? 'var(--text-muted)' : 'var(--text-main)'
                            }}>
                                <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>[{entry.time}]</span>
                                {entry.msg}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MigrateData;
