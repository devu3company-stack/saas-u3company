import { useState, useRef } from 'react';
import { Upload, FileText, Search, UserPlus, Trash2, CheckCircle, Database, Bot, Zap, MapPin } from 'lucide-react';
import Papa from 'papaparse';
import { useAuth } from '../utils/auth';

const Prospecting = () => {
    const { getData, setData } = useAuth();
    const [leads, setLeads] = useState([]);
    const [fileName, setFileName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);
    const [scraping, setScraping] = useState(false);
    const [scrapeForm, setScrapeForm] = useState({ niche: '', city: '', state: '', limit: 20 });
    const fileInputRef = useRef(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
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

                setLeads(prev => [...parsedData, ...prev]);
                showToast(`✅ ${parsedData.length} contatos lidos com sucesso!`);
            },
            error: (err) => {
                showToast(`❌ Erro ao ler o arquivo: ${err.message}`);
            }
        });
    };

    const handleScrape = async () => {
        if (!scrapeForm.niche || !scrapeForm.city || !scrapeForm.state) {
            showToast('⚠️ Preencha nicho, cidade e estado para iniciar a extração.');
            return;
        }
        setScraping(true);
        showToast('⏳ Iniciando robô extrator via API (isso pode levar alguns minutos)...');
        try {
            const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';
            const resp = await fetch(`${API_BASE}/api/extract-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...scrapeForm, limit: Number(scrapeForm.limit) })
            });

            if (!resp.ok) {
                throw new Error('Servidor retornou erro.');
            }

            const data = await resp.json();
            if (data.leads && data.leads.length > 0) {
                const newLeads = data.leads.map((l, index) => ({
                    id: Date.now() + index,
                    nome: l.nome || 'Empresa Sem Nome',
                    telefone: l.telefone === 'Ver link abaixo' ? '' : (l.telefone || l.whatsapp_link || ''),
                    endereco: l.endereco || `${l.cidade} - ${l.estado}`,
                    site: l.maps_url || '',
                    selecionado: false
                }));

                setLeads(prev => [...newLeads, ...prev]);
                showToast(`✅ ${newLeads.length} leads extraídos no Google e adicionados à lista!`);
            } else {
                showToast('❌ Nenhum lead encontrado com estes parâmetros.');
            }
        } catch (error) {
            console.error('Erro de extração API:', error);
            showToast(`❌ Falha na Extração: ${error.message || 'Verifique se o backend está rodando e respondendo corretamente.'}`);
        }
        setScraping(false);
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
            showToast("⚠️ Selecione pelo menos um contato para importar.");
            return;
        }

        const currentClients = getData('u3_clientes', '[]');

        const newClients = selectedLeads.map(lead => ({
            id: Date.now() + Math.random(),
            nome: lead.nome,
            telefone: lead.telefone,
            endereco: lead.endereco,
            status: 'Lead Frio',
            plano: lead.site ? `Site: ${lead.site}` : 'Prospecção API',
            origem: 'Importação Extrator'
        }));

        setData('u3_clientes', [...newClients, ...currentClients]);

        const currentPipeline = getData('u3_leads', '[]');

        const newLeadsPipeline = selectedLeads.map((lead, index) => ({
            id: Date.now() + index,
            name: lead.nome,
            origem: 'Extrator API',
            campanha: lead.telefone,
            status: 'Novo',
            updatedAt: Date.now()
        }));

        setData('u3_leads', [...currentPipeline, ...newLeadsPipeline]);

        setLeads(prev => prev.filter(l => !l.selecionado));
        showToast(`🚀 ${selectedLeads.length} leads exportados com sucesso para CRM e Funil!`);
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
                    <h2 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>Prospecção (Extrator Google) <Zap color="var(--accent-color)" size={24} /></h2>
                    <p className="text-muted">Utilize o robô integrado para extrair leads do Google Maps automaticamente ou faça upload manual de um dataset CSV.</p>
                </div>
                {leads.length > 0 && (
                    <button className="btn btn-primary" onClick={importToCRM} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Database size={16} /> Importar {leads.filter(l => l.selecionado).length} Selecionados
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                {/* Extrator via API */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ backgroundColor: 'rgba(0, 208, 132, 0.1)', padding: 12, borderRadius: '50%' }}>
                            <Bot size={28} color="var(--accent-color)" />
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 4 }}>Extrator Automático</h3>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Busque leads no Google em tempo real.</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Nicho ou Palavra-Chave</label>
                                <input type="text" className="form-control" placeholder="Ex: Dentistas, Imobiliárias" value={scrapeForm.niche} onChange={e => setScrapeForm({ ...scrapeForm, niche: e.target.value })} disabled={scraping} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Cidade</label>
                                <input type="text" className="form-control" placeholder="Ex: São Paulo" value={scrapeForm.city} onChange={e => setScrapeForm({ ...scrapeForm, city: e.target.value })} disabled={scraping} />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Estado (UF)</label>
                                <input type="text" className="form-control" placeholder="Ex: SP" value={scrapeForm.state} onChange={e => setScrapeForm({ ...scrapeForm, state: e.target.value })} disabled={scraping} maxLength={2} style={{ textTransform: 'uppercase' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Quantidade a buscar</label>
                                <input type="number" className="form-control" placeholder="Ex: 20" value={scrapeForm.limit} onChange={e => setScrapeForm({ ...scrapeForm, limit: e.target.value })} disabled={scraping} />
                            </div>
                        </div>

                        <button className="btn btn-primary" onClick={handleScrape} disabled={scraping} style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
                            {scraping ? <><Bot className="rotating" size={18} /> Extraindo, pode demorar...</> : <><Search size={18} /> Iniciar Extração</>}
                        </button>
                    </div>
                </div>

                {/* Upload CSV */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', borderStyle: 'dashed', borderWidth: 2, borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}>
                    <Database size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                    <h3 style={{ marginBottom: 8 }}>Adicionar Planilha (.CSV)</h3>
                    <p className="text-muted" style={{ textAlign: 'center', maxWidth: 350, marginBottom: 24, fontSize: '0.9rem' }}>
                        Suba contatos da sua base fria. O sistema lerá Nome, Telefone e Endereço.
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
                    {fileName && <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--accent-color)' }}>Lido: {fileName}</p>}
                </div>
            </div>

            {leads.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={20} color="var(--accent-color)" /> Fila de Contatos Extraídos ({leads.length})</h3>
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
                                    <th style={{ padding: '12px 16px' }}>Nome / Empresa</th>
                                    <th style={{ padding: '12px 16px' }}>Telefone</th>
                                    <th style={{ padding: '12px 16px' }}>Localidade</th>
                                    <th style={{ padding: '12px 16px' }}>Site (Maps URL)</th>
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
                                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.endereco}>
                                            <MapPin size={12} style={{ marginRight: 4, display: 'inline-block' }} />
                                            {lead.endereco || '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {lead.site ? <a href={lead.site.startsWith('http') ? lead.site : `https://${lead.site}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.8rem' }} onClick={(e) => e.stopPropagation()}>Maps Link</a> : '-'}
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
