import { useState } from 'react';
import { useAuth } from '../utils/auth';
import { Upload, CheckCircle, AlertTriangle, Database, ArrowRight, Users } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

// Todas as chaves de dados operacionais que podem ser migradas
const DATA_KEYS = [
    { localKeys: ['shared__u3_clients_v2', 'u3_clients_v2', 'clients_v2'], backendKey: 'u3_clients_v2', label: 'Clientes' },
    { localKeys: ['shared__u3_tarefas', 'u3_tarefas', 'tarefas'], backendKey: 'u3_tarefas', label: 'Tarefas' },
    { localKeys: ['shared__u3_leads', 'u3_leads', 'leads'], backendKey: 'u3_leads', label: 'Leads (CRM)' },
    { localKeys: ['shared__u3_meetings', 'u3_meetings', 'meetings'], backendKey: 'u3_meetings', label: 'Reuniões' },
    { localKeys: ['shared__u3_custos', 'u3_custos', 'custos'], backendKey: 'u3_custos', label: 'Custos' },
    { localKeys: ['shared__u3_caixa', 'u3_caixa', 'caixa'], backendKey: 'u3_caixa', label: 'Fluxo de Caixa' },
    { localKeys: ['shared__u3_inadimplentes', 'u3_inadimplentes'], backendKey: 'u3_inadimplentes', label: 'Inadimplentes' },
    { localKeys: ['shared__u3_goals', 'u3_goals', 'goals'], backendKey: 'u3_goals', label: 'Metas' },
    { localKeys: ['shared__u3_nps_responses', 'u3_nps_responses'], backendKey: 'u3_nps_responses', label: 'Pesquisas NPS' },
    { localKeys: ['shared__u3_traffic_dashboard', 'u3_traffic_dashboard'], backendKey: 'u3_traffic_dashboard', label: 'Tráfego' },
    { localKeys: ['shared__u3_academy_settings', 'u3_academy_settings'], backendKey: 'u3_academy_settings', label: 'Academy' },
    { localKeys: ['shared__u3_agencies', 'u3_agencies'], backendKey: 'u3_agencies', label: 'Agências (White-Label)' },
    { localKeys: ['shared__u3_flow_nodes', 'u3_flow_nodes'], backendKey: 'u3_flow_nodes', label: 'Fluxos de IA' },
];

const MigrateData = () => {
    const { user } = useAuth();
    const [log, setLog] = useState([]);
    const [migrating, setMigrating] = useState(false);
    const [done, setDone] = useState(false);
    const [mode, setMode] = useState('local'); // 'local' | 'recover'

    // Namespace destino: onde os dados vão parar
    const getTargetNamespace = () => {
        if (!user) return 'shared';
        if (user.id === 1) return 'demo';
        if (user.role === 'cliente_admin') return `tenant_${user.id}`;
        if (user.tenantId) return `tenant_${user.tenantId}`;
        return 'shared';
    };

    const targetNamespace = getTargetNamespace();
    const isTenant = targetNamespace.startsWith('tenant_');

    const addLog = (msg, type = 'info') => {
        setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const migrateAll = async (sourceNamespace = null) => {
        setMigrating(true);
        setDone(false);
        setLog([]);

        const dest = targetNamespace;
        addLog(`🚀 Iniciando migração → destino: [${dest}]`, 'info');
        if (sourceNamespace) {
            addLog(`🔍 Recuperando dados do namespace antigo: [${sourceNamespace}]`, 'info');
        }

        let totalMigrated = 0;

        for (const item of DATA_KEYS) {
            let value = null;
            let foundKey = null;

            // Se recovery mode: primeiro tenta buscar do backend (namespace antigo/shared)
            if (sourceNamespace) {
                try {
                    const r = await fetch(`${API_BASE}/api/data/${sourceNamespace}/${item.backendKey}`);
                    const d = await r.json();
                    if (d.success && d.value !== null && d.value !== undefined) {
                        const isEmpty = Array.isArray(d.value) ? d.value.length === 0 :
                            (typeof d.value === 'object' ? Object.keys(d.value).length === 0 : false);
                        if (!isEmpty) {
                            value = d.value;
                            foundKey = `backend/${sourceNamespace}`;
                        }
                    }
                } catch { }
            }

            // Fallback: tenta localStorage
            if (!value) {
                const keysToTry = sourceNamespace
                    ? [`${sourceNamespace}__${item.backendKey}`, ...item.localKeys]
                    : item.localKeys;

                for (const key of keysToTry) {
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        try {
                            value = JSON.parse(raw);
                            foundKey = key;
                            break;
                        } catch { }
                    }
                }
            }

            if (value !== null && value !== undefined) {
                const isEmpty = Array.isArray(value) ? value.length === 0 :
                    (typeof value === 'object' ? Object.keys(value).length === 0 : false);

                if (isEmpty) {
                    addLog(`⏭️ ${item.label}: sem dados para migrar`, 'skip');
                    continue;
                }

                try {
                    const count = Array.isArray(value) ? value.length : 1;
                    addLog(`📤 Enviando: ${item.label} (${count} item(ns)) de "${foundKey}"...`, 'info');

                    const r = await fetch(`${API_BASE}/api/data/${dest}/${item.backendKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ value })
                    });
                    const d = await r.json();

                    if (d.success) {
                        addLog(`✅ ${item.label}: ${count} item(ns) migrado(s) com sucesso!`, 'success');
                        totalMigrated++;
                    } else {
                        addLog(`❌ ${item.label}: falha ao salvar no servidor`, 'error');
                    }
                } catch (e) {
                    addLog(`❌ ${item.label}: erro de conexão - ${e.message}`, 'error');
                }
            } else {
                addLog(`⏭️ ${item.label}: não encontrado`, 'skip');
            }
        }

        // Usuários — apenas para CEO/Matriz
        if (!isTenant) {
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
            } catch { }
        }

        addLog(`\n🎉 Concluído! ${totalMigrated} categoria(s) enviada(s) ao servidor.`, 'done');
        setDone(true);
        setMigrating(false);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>⚡ Migração e Recuperação de Dados</h2>
                    <p className="text-muted">
                        Transfere dados do navegador para o servidor — ou recupera dados de uma conta antiga.
                    </p>
                </div>
            </div>

            {/* Seleção de modo */}
            {!migrating && !done && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div
                        onClick={() => setMode('local')}
                        className="card"
                        style={{
                            flex: 1, minWidth: 260, cursor: 'pointer', padding: 20,
                            border: `2px solid ${mode === 'local' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Upload size={22} color="var(--accent-color)" />
                            <strong>Migrar dados deste computador</strong>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            Você criou clientes, tarefas ou leads aqui neste navegador e quer subir para o servidor.
                        </p>
                    </div>

                    <div
                        onClick={() => setMode('recover')}
                        className="card"
                        style={{
                            flex: 1, minWidth: 260, cursor: 'pointer', padding: 20,
                            border: `2px solid ${mode === 'recover' ? '#a855f7' : 'var(--border-color)'}`,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Users size={22} color="#a855f7" />
                            <strong>Recuperar dados de conta anterior</strong>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            Sua conta foi recriada e você quer importar dados que estavam em outro usuário ou namespace.
                        </p>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 24 }}>
                {/* Info do usuário logado */}
                <div style={{ marginBottom: 20, padding: '12px 16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 10, fontSize: '0.85rem' }}>
                    <strong>Usuário logado:</strong> {user?.name} ({user?.role})<br />
                    <strong>Destino dos dados:</strong> <code style={{ backgroundColor: 'var(--bg-main)', padding: '2px 8px', borderRadius: 4, color: 'var(--accent-color)' }}>{targetNamespace}</code>
                    {isTenant && <span style={{ color: 'var(--success)', marginLeft: 10, fontSize: '0.8rem' }}>✅ Ambiente isolado do seu tenant</span>}
                </div>

                {/* Aviso */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, padding: 16, backgroundColor: 'rgba(255, 246, 0, 0.05)', borderRadius: 12, border: '1px solid rgba(255, 246, 0, 0.15)' }}>
                    <AlertTriangle size={22} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                        {mode === 'local' ? (
                            <>
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>Execute no computador correto</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Abra esta página <strong>no computador onde os dados foram criados</strong>.
                                    Os dados serão lidos do localStorage deste navegador e enviados ao servidor.
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>Recuperação da conta anterior</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Esta opção vai buscar os dados do namespace <code>shared</code> (conta antiga da equipe matriz)
                                    e copiá-los para o seu ambiente atual <code>({targetNamespace})</code>.
                                    Use isto se você estava em uma conta de equipe e foi movido para um ambiente de cliente.
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {!migrating && !done && (
                    <div style={{ display: 'flex', gap: 12 }}>
                        {mode === 'local' ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => migrateAll(null)}
                                style={{ padding: '12px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}
                            >
                                <Database size={20} /> Iniciar Migração do Navegador
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Escolha de qual namespace você quer recuperar os dados:
                                </p>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => migrateAll('shared')}
                                        style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
                                    >
                                        <ArrowRight size={16} /> Recuperar de "shared" (equipe matriz)
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => migrateAll('demo')}
                                        style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}
                                    >
                                        <ArrowRight size={16} /> Recuperar de "demo"
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {migrating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', color: 'var(--warning)' }}>
                        <div style={{ width: 16, height: 16, border: '2px solid var(--warning)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Migrando dados, aguarde...
                    </div>
                )}

                {done && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'rgba(0, 208, 132, 0.1)', borderRadius: 12, border: '1px solid rgba(0, 208, 132, 0.2)', marginBottom: 16 }}>
                        <CheckCircle size={24} color="var(--success)" />
                        <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                            Migração concluída! Faça logout e login novamente para visualizar os dados atualizados.
                        </div>
                    </div>
                )}

                {done && (
                    <button className="btn btn-outline" onClick={() => { setDone(false); setLog([]); }} style={{ marginBottom: 16 }}>
                        Fazer outra migração
                    </button>
                )}

                {/* Log de Execução */}
                {log.length > 0 && (
                    <div style={{ marginTop: 20, padding: 16, backgroundColor: 'var(--bg-main)', borderRadius: 8, maxHeight: 400, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                        {log.map((entry, i) => (
                            <div key={i} style={{
                                padding: '3px 0',
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
