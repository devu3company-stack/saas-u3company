import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, MessageSquare, MousePointerClick, Percent } from 'lucide-react';

const Traffic = () => {
    // Dados mockados
    const data = [
        { name: 'Jan', investimento: 4000, receita: 12400 },
        { name: 'Fev', investimento: 3000, receita: 13980 },
        { name: 'Mar', investimento: 2000, receita: 9800 },
        { name: 'Abr', investimento: 2780, receita: 19080 },
        { name: 'Mai', investimento: 1890, receita: 14800 },
        { name: 'Jun', investimento: 2390, receita: 18000 },
    ];

    const roasData = [
        { name: 'Jan', roas: 3.1 },
        { name: 'Fev', roas: 4.6 },
        { name: 'Mar', roas: 4.9 },
        { name: 'Abr', roas: 6.8 },
        { name: 'Mai', roas: 7.8 },
        { name: 'Jun', roas: 7.5 },
    ];

    const [selectedClient, setSelectedClient] = useState('AlphaTech Solutions');

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Tráfego e Resultados</h2>
                    <p className="text-muted">Cálculo Automático de Performance</p>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 'auto' }}>
                    <select
                        className="form-control"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        style={{ minWidth: 200 }}
                    >
                        <option>AlphaTech Solutions</option>
                        <option>Imobiliária Prime</option>
                        <option>Construtora Silva</option>
                    </select>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={16} /> Exportar Relatório
                    </button>
                    <button className="btn btn-primary">Importar Mídia</button>
                </div>
            </div>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="card">
                    <div className="card-title">Investimento</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ 16.060</div>
                </div>
                <div className="card">
                    <div className="card-title">Receita Gerada</div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>R$ 88.060</div>
                </div>
                <div className="card">
                    <div className="card-title">ROAS Global</div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>5.48x</div>
                </div>
                <div className="card">
                    <div className="card-title">CAC</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ 120,50</div>
                </div>
                <div className="card">
                    <div className="card-title">CPL</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ 15,30</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <MessageSquare size={14} /> Mensagens Inic.
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>1.050</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <MousePointerClick size={14} /> Cliques
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>5.240</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Percent size={14} /> CTR
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>2.18%</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                <div className="card">
                    <h3 style={{ marginBottom: 24 }}>Investimento vs Receita (R$)</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: 8, color: 'white' }} />
                                <Legend />
                                <Bar dataKey="investimento" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Investimento (R$)" />
                                <Bar dataKey="receita" fill="var(--success)" radius={[4, 4, 0, 0]} name="Receita (R$)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 24 }}>Evolução do ROAS</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <LineChart data={roasData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: 8, color: 'white' }} />
                                <Line type="monotone" dataKey="roas" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 6 }} name="ROAS (X)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Aprendizados do Mês</h3>
                <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Digite aqui as observações, testes realizados e direcionamento geral..."
                    defaultValue="O CPL caiu 15% após o lançamento do novo criativo no Meta Ads. Para o próximo mês, vamos focar a maior parte do orçamento na campanha de Remarketing devido ao ROAS alto (7.5x)."
                ></textarea>
                <button className="btn btn-outline" style={{ marginTop: 16 }}>Salvar Relatório</button>
            </div>
        </div>
    );
};

export default Traffic;
