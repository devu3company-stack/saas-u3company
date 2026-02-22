import { useState, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, MessageSquare, MousePointerClick, Percent, UploadCloud, CheckCircle, Loader2 } from 'lucide-react';

const Traffic = () => {
    const fileInputRef = useRef(null);
    const [isImporting, setIsImporting] = useState(false);
    const [selectedClient, setSelectedClient] = useState('AlphaTech Solutions');

    // Dados Dinâmicos usando State para permitir a simulação do upload
    const [dashboardData, setDashboardData] = useState({
        investimento: '16.060',
        receita: '88.060',
        roas: '5.48x',
        cac: '120,50',
        cpl: '15,30',
        mensagens: '1.050',
        cliques: '5.240',
        ctr: '2.18%',
        chartData: [
            { name: 'Jan', investimento: 4000, receita: 12400 },
            { name: 'Fev', investimento: 3000, receita: 13980 },
            { name: 'Mar', investimento: 2000, receita: 9800 },
            { name: 'Abr', investimento: 2780, receita: 19080 },
            { name: 'Mai', investimento: 1890, receita: 14800 },
            { name: 'Jun', investimento: 2390, receita: 18000 },
        ],
        roasChartData: [
            { name: 'Jan', roas: 3.1 },
            { name: 'Fev', roas: 4.6 },
            { name: 'Mar', roas: 4.9 },
            { name: 'Abr', roas: 6.8 },
            { name: 'Mai', roas: 7.8 },
            { name: 'Jun', roas: 7.5 },
        ],
        insight: "O CPL caiu 15% após o lançamento do novo criativo no Meta Ads. Para o próximo mês, vamos focar a maior parte do orçamento na campanha de Remarketing devido ao ROAS alto (7.5x)."
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);

        // Simula o tempo de leitura da IA / Parser de CSV
        setTimeout(() => {
            setDashboardData({
                investimento: '8.450',
                receita: '52.300',
                roas: '6.18x',
                cac: '85,00',
                cpl: '8,20',
                mensagens: '4.200',
                cliques: '12.450',
                ctr: '3.45%',
                chartData: [
                    { name: 'Jul', investimento: 1200, receita: 6000 },
                    { name: 'Ago', investimento: 2000, receita: 15000 },
                    { name: 'Set', investimento: 2500, receita: 14000 },
                    { name: 'Out', investimento: 2750, receita: 17300 }
                ],
                roasChartData: [
                    { name: 'Jul', roas: 5.0 },
                    { name: 'Ago', roas: 7.5 },
                    { name: 'Set', roas: 5.6 },
                    { name: 'Out', roas: 6.2 }
                ],
                insight: `Relatório "${file.name}" analisado com sucesso pela IA! Notamos uma excelente evolução no CTR (agora 3.45%), o que derrubou seu Custo Por Lead para R$ 8,20. Recomendamos escalar o orçamento nas campanhas de fundo de funil.`
            });
            setIsImporting(false);
            e.target.value = ''; // reseta o input
        }, 2500);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h2>Tráfego e Resultados</h2>
                        <p className="text-muted">Analisador Baseado em Dados Extraídos do Meta/Google</p>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <select
                            className="form-control"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            style={{ minWidth: 200 }}
                        >
                            {JSON.parse(localStorage.getItem('u3_clients') || '[]').map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                            {JSON.parse(localStorage.getItem('u3_clients') || '[]').length === 0 && (
                                <>
                                    <option>AlphaTech Solutions</option>
                                    <option>Imobiliária Prime</option>
                                    <option>Construtora Silva</option>
                                </>
                            )}
                        </select>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Download size={16} /> Exportar Relatório
                        </button>

                        {/* Fake Input para arquivo CSV/XLSX */}
                        <input
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isImporting}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'center' }}
                        >
                            {isImporting ? (
                                <><Loader2 size={16} className="spinner" style={{ animation: 'spin 1.5s linear infinite' }} /> Processando IA...</>
                            ) : (
                                <><UploadCloud size={16} /> Importar Arquivo (CSV)</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Injeção rápida de keyframes para o spinner no arquivo sem fujir do inline/css atual */}
            <style>
                {`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                `}
            </style>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', opacity: isImporting ? 0.5 : 1, transition: '0.3s' }}>
                <div className="card">
                    <div className="card-title">Investimento</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ {dashboardData.investimento}</div>
                </div>
                <div className="card">
                    <div className="card-title">Receita Gerada</div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>R$ {dashboardData.receita}</div>
                </div>
                <div className="card">
                    <div className="card-title">ROAS Global</div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{dashboardData.roas}</div>
                </div>
                <div className="card">
                    <div className="card-title">CAC</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ {dashboardData.cac}</div>
                </div>
                <div className="card">
                    <div className="card-title">CPL</div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ {dashboardData.cpl}</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <MessageSquare size={14} /> Mensagens Inic.
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>{dashboardData.mensagens}</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <MousePointerClick size={14} /> Cliques
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem' }}>{dashboardData.cliques}</div>
                </div>
                <div className="card">
                    <div className="card-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Percent size={14} /> CTR
                    </div>
                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{dashboardData.ctr}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24, opacity: isImporting ? 0.5 : 1, transition: '0.3s' }}>
                <div className="card">
                    <h3 style={{ marginBottom: 24 }}>Investimento vs Receita (R$)</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={dashboardData.chartData}>
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
                            <LineChart data={dashboardData.roasChartData}>
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

            <div className="card" style={{ marginTop: 24, position: 'relative', overflow: 'hidden' }}>
                {isImporting && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                        <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Extraindo dados do relatório...</div>
                    </div>
                )}
                <h3 style={{ marginBottom: 16 }}>Análise da IA (Insight do Mês)</h3>
                <textarea
                    className="form-control"
                    rows="4"
                    value={dashboardData.insight}
                    onChange={(e) => setDashboardData({ ...dashboardData, insight: e.target.value })}
                ></textarea>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle size={16} color="var(--success)" /> Salvar Análise e Relatório
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Traffic;
