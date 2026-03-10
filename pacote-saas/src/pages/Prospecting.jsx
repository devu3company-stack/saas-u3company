import { useState, useRef } from 'react';
import { Upload, FileText, Search, UserPlus, Trash2, CheckCircle, Database } from 'lucide-react';
import Papa from 'papaparse';
import { useAuth } from '../utils/auth';

const Prospecting = () => {
    const { getData, setData } = useAuth();
    const [leads, setLeads] = useState([]);
    const [fileName, setFileName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data.map((row, index) => ({
                    id: Date.now() + index,
                    nome: row.NOME || row.Nome || row.name || 'Empresa Sem Nome',
                    telefone: row.TELEFONE || row.Telefone || row.Phone || row.WhatsApp_Link || '',
                    endereco: row.ENDERECO || row.Endereco || row.Address || `${row.CIDADE || ''} - ${row.ESTADO || ''}`,
                    site: row.SITE || row.Site || row.Website || '',
                    selecionado: false
                }));

                setLeads(parsedData);
                showToast(`✅ ${parsedData.length} contatos lidos com sucesso!`);
            },
            error: (err) => {
                showToast(`❌ Erro ao ler o arquivo: ${err.message}`);
            }
        });
    };

    const toggleSelect = (id) => {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, selecionado: !lead.selecionado } : lead));
    };

    const selectAll = () => {
        const allSelected = leads.every(l => l.selecionado);
        setLeads(prev => prev.map(lead => ({ ...lead, selecionado: !allSelected })));
    };

    const importToCRM = () => {
        const selectedLeads = leads.filter(l => l.selecionado);
        if (selectedLeads.length === 0) {
            alert("Selecione pelo menos um contato para importar.");
            return;
        }

        const currentClients = getData('u3_clientes', '[]');

        const newClients = selectedLeads.map(lead => ({
            id: Date.now() + Math.random(),
            nome: lead.nome,
            telefone: lead.telefone,
            endereco: lead.endereco,
            status: 'Lead Frio',
            plano: lead.site ? `Site: ${lead.site}` : 'Prospecção Google',
            origem: 'Importação Extrator'
        }));

        setData('u3_clientes', [...newClients, ...currentClients]);

        const currentPipeline = getData('u3_leads', '[]');

        const newLeadsPipeline = selectedLeads.map((lead, index) => ({
            id: Date.now() + index,
            name: lead.nome,
            origem: 'Extrator API',
            campanha: lead.telefone, // Guardando o telefone no espaco de campanha
            status: 'Novo', // Primeira Coluna do Funil
            updatedAt: Date.now()
        }));

        setData('u3_leads', [...currentPipeline, ...newLeadsPipeline]);

        // Remove os importados da lista atual
        setLeads(prev => prev.filter(l => !l.selecionado));
        showToast(`🚀 ${selectedLeads.length} leads importados para o CRM e Funil!`);
    };

    const filteredLeads = leads.filter(lead =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefone.includes(searchTerm) ||
        lead.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '0 24px' }}>
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
                    padding: '14px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-color)',
                    borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease'
                }}>
                    <CheckCircle size={18} color="var(--success)" /> {toast}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h2 style={{ marginBottom: 8 }}>Prospecção (Extrator Google)</h2>
                    <p className="text-muted">Faça upload da planilha .csv gerada pelo seu robô e transforme os dados em novos Leads no CRM.</p>
                </div>
                {leads.length > 0 && (
                    <button className="btn btn-primary" onClick={importToCRM} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Database size={16} /> Importar {leads.filter(l => l.selecionado).length} Selecionados
                    </button>
                )}
            </div>

            <div className="card" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', borderStyle: 'dashed', borderWidth: 2, borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}>
                <Database size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                <h3 style={{ marginBottom: 8 }}>Adicionar Planilha (.CSV)</h3>
                <p className="text-muted" style={{ textAlign: 'center', maxWidth: 400, marginBottom: 24 }}>
                    O sistema lerá colunas como Nome, Telefone, Endereço e Site para organizar a tabela perfeitamente.
                </p>
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <button className="btn btn-outline" onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Upload size={16} /> Escolher Arquivo CSV
                </button>
                {fileName && <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--accent-color)' }}>Arquivo lido: {fileName}</p>}
            </div>

            {leads.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={20} color="var(--accent-color)" /> Resultados Extraídos ({leads.length})</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, padding: '8px 12px', width: 300 }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input type="text" placeholder="Buscar empresa ou telefone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '12px 16px', width: 40 }}>
                                        <input type="checkbox" onChange={selectAll} checked={leads.length > 0 && leads.every(l => l.selecionado)} style={{ accentColor: 'var(--accent-color)' }} />
                                    </th>
                                    <th style={{ padding: '12px 16px' }}>Nome/Empresa</th>
                                    <th style={{ padding: '12px 16px' }}>Telefone</th>
                                    <th style={{ padding: '12px 16px' }}>Endereço</th>
                                    <th style={{ padding: '12px 16px' }}>Site</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map(lead => (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', backgroundColor: lead.selecionado ? 'rgba(255, 246, 0, 0.05)' : 'transparent', cursor: 'pointer' }} onClick={() => toggleSelect(lead.id)}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <input type="checkbox" checked={lead.selecionado} onChange={() => { }} style={{ accentColor: 'var(--accent-color)', pointerEvents: 'none' }} />
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{lead.nome}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.telefone || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.endereco}>{lead.endereco || '-'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {lead.site ? <a href={lead.site.startsWith('http') ? lead.site : `https://${lead.site}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>{lead.site}</a> : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLeads.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Nenhum contato encontrado na busca.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prospecting;
