import React, { useState } from 'react';
import { Search, Database, Download, CloudUpload, CheckCircle, Loader2, MapPin, Building2, Phone, Mail, Filter, Trash2 } from 'lucide-react';
import { useSyncedData } from '../utils/useSyncedData';
import { useNavigate } from 'react-router-dom';

const ExtractorTool = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({ niche: '', location: '' });
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [exporting, setExporting] = useState(false);

    // Conecta com o banco de dados de leads do CRM
    const [crmLeads, saveCrmLeads] = useSyncedData('u3_leads', []);

    const simulateleads = [
        { id: 101, name: 'Restaurante Gourmet Silva', phone: '(11) 98877-6655', email: 'contato@silvagourmet.com', category: 'Restaurante', address: 'Av. Paulista, 1000 - SP' },
        { id: 102, name: 'Academia Corpo & Mente', phone: '(11) 97766-5544', email: 'admin@corpoemente.com.br', category: 'Academia', address: 'Rua Augusta, 500 - SP' },
        { id: 103, name: 'Clínica Odonto Clean', phone: '(11) 96655-4433', email: 'recepcao@odontoclean.com', category: 'Saúde', address: 'Al. Campinas, 200 - SP' },
        { id: 104, name: 'Hotel Transamérica', phone: '(11) 95544-3322', email: 'reservas@transamerica.com', category: 'Hotelaria', address: 'Av. das Nações Unidas, 18591' },
        { id: 105, name: 'Oficina do João', phone: '(11) 94433-2211', email: 'joao.oficina@gmail.com', category: 'Automotivo', address: 'Rua das Flores, 12 - SP' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.niche) return alert("Digite um nicho para buscar!");
        
        setLoading(true);
        setLeads([]);
        
        // Simulando delay de rede/extração
        setTimeout(() => {
            setLeads(simulateleads.map(l => ({
                ...l,
                id: Date.now() + Math.random(), // IDs únicos reais
                niche: query.niche,
                location: query.location || 'Brasil'
            })));
            setLoading(false);
        }, 2000);
    };

    const toggleSelect = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(i => i !== id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const selectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.id));
        }
    };

    const pushToCrm = () => {
        if (selectedLeads.length === 0) return alert("Selecione pelo menos um lead!");
        
        setExporting(true);
        
        const leadsToExport = leads.filter(l => selectedLeads.includes(l.id));
        
        // Mapeamento EXATO para as colunas do CRM (Leads.jsx)
        const formattedLeads = leadsToExport.map(l => ({
            id: Date.now() + Math.random(), // id numérico (timestamp + rand)
            name: l.name,
            telefone: l.phone,
            email: l.email || '',
            origem: 'Extrator de Leads',
            campanha: `Busca: ${query.niche}`,
            status: 'Novo', // Coluna inicial padrão do CRM
            updatedAt: Date.now(),
            cardColor: '#ffffff',
            comentarios: `Extraído via ferramenta integrada em ${new Date().toLocaleDateString()}. Foco: ${query.niche} em ${query.location}. Endereço original: ${l.address}`
        }));

        // Adiciona aos leads existentes
        const newList = [...crmLeads, ...formattedLeads];
        saveCrmLeads(newList);

        setTimeout(() => {
            setExporting(false);
            alert(`${formattedLeads.length} leads exportados com sucesso para o seu CRM!`);
            setSelectedLeads([]);
            navigate('/leads');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '12px' }}>
            <div className="page-header">
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Database color="var(--accent-color)" /> Extrator de Leads Inteligente
                    </h2>
                    <p className="text-muted">Busque empresas e profissionais em qualquer região e jogue direto no seu funil.</p>
                </div>
            </div>

            {/* Barra de Busca Avançada */}
            <div className="card" style={{ padding: 24, border: '1px solid var(--border-color)' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2, minWidth: 250 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--text-muted)' }}>
                            <Building2 size={14} style={{ marginRight: 4 }} /> O que você busca? (Nicho/Nome)
                        </label>
                        <input 
                            className="form-control" 
                            placeholder="Ex: Restaurantes, Dentistas, Lojas de Roupas..." 
                            value={query.niche}
                            onChange={e => setQuery({...query, niche: e.target.value})}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--text-muted)' }}>
                            <MapPin size={14} style={{ marginRight: 4 }} /> Localização (Cidade/Bairro)
                        </label>
                        <input 
                            className="form-control" 
                            placeholder="Ex: São Paulo, SP ou Itaim Bibi" 
                            value={query.location}
                            onChange={e => setQuery({...query, location: e.target.value})}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ height: 44, padding: '0 24px', display: 'flex', gap: 8, alignItems: 'center' }} disabled={loading}>
                        {loading ? <Loader2 className="spin" size={20} /> : <Search size={20} />} Buscar Agora
                    </button>
                </form>
            </div>

            {/* Resultados em formato de Planilha/Tabela */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Resultados da Extração</h3>
                        <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{leads.length} encontrados</span>
                    </div>
                    
                    {leads.length > 0 && (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" onClick={selectAll} style={{ fontSize: '0.85rem' }}>
                                {selectedLeads.length === leads.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={pushToCrm} 
                                style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem', backgroundColor: '#10b981' }}
                                disabled={exporting}
                            >
                                {exporting ? <Loader2 className="spin" size={16} /> : <CloudUpload size={16} />}
                                Enviar {selectedLeads.length > 0 ? `(${selectedLeads.length})` : ''} para o CRM
                            </button>
                        </div>
                    )}
                </div>

                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '16px 24px', width: 40 }}></th>
                                <th style={{ padding: '16px 24px' }}>Empresa / Nome</th>
                                <th style={{ padding: '16px 24px' }}>WhatsApp / Telefone</th>
                                <th style={{ padding: '16px 24px' }}>E-mail</th>
                                <th style={{ padding: '16px 24px' }}>Endereço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length > 0 ? leads.map(l => (
                                <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: selectedLeads.includes(l.id) ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedLeads.includes(l.id)} 
                                            onChange={() => toggleSelect(l.id)}
                                            style={{ cursor: 'pointer', width: 18, height: 18 }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 600 }}>{l.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.category}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--accent-color)', fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Phone size={14} /> {l.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                                            <Mail size={14} color="var(--text-muted)" /> {l.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {l.address}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: 60, textAlign: 'center' }}>
                                        {loading ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                                <Loader2 className="spin" size={40} color="var(--accent-color)" />
                                                <div style={{ fontWeight: 600 }}>Varrendo a rede em busca de contatos...</div>
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                                                <Search size={40} style={{ marginBottom: 16, opacity: 0.2 }} /><br />
                                                Nada para exibir ainda. Use a barra de busca acima para encontrar leads.
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dica do Especialista */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 16, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <CheckCircle size={32} color="var(--accent-color)" />
                <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-color)' }}>Sincronização Ativa com U3 Flow</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Os leads selecionados são enviados com as colunas formatadas para que o sistema de acompanhamento entenda automaticamente. 
                        Eles cairão na primeira coluna ("Novo") do seu pipeline.
                    </div>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ExtractorTool;
