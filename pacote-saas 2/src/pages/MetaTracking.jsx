import React, { useState, useEffect } from 'react';
import { Radar, Filter, RefreshCw, Smartphone, Monitor, Globe, ChevronDown, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MetaTracking = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Dados de exemplo simulando um sistema de tracking de UTMs (como UTMfy, PerfectPay, etc)
    const [trackingData] = useState({
        totalClicks: 14250,
        uniqueLeads: 2145,
        totalSales: 312,
        revenue: 45890.00,
        roas: '3.4x',
        cpl: 15.20,
        cpa: 104.50,
        chart: [
            { date: '01/03', clicks: 450, conversions: 12 },
            { date: '02/03', clicks: 520, conversions: 18 },
            { date: '03/03', clicks: 480, conversions: 15 },
            { date: '04/03', clicks: 810, conversions: 35 },
            { date: '05/03', clicks: 750, conversions: 28 },
            { date: '06/03', clicks: 1200, conversions: 55 },
            { date: '07/03', clicks: 1450, conversions: 62 },
        ],
        campaigns: [
            { id: 'CMP_001', source: 'fb_ads', campaign: 'black_friday_2026', content: 'video_oferta', term: 'publico_frio', clicks: 4520, leads: 850, sales: 120, revenue: 18500, roas: 4.2 },
            { id: 'CMP_002', source: 'fb_ads', campaign: 'remarketing_7d', content: 'carrossel_depoimentos', term: 'visitantes', clicks: 1250, leads: 420, sales: 85, revenue: 14200, roas: 8.5 },
            { id: 'CMP_003', source: 'google_ads', campaign: 'search_fundo_funil', content: 'pesquisa_direta', term: 'comprar_agora', clicks: 840, leads: 315, sales: 65, revenue: 8900, roas: 6.1 },
            { id: 'CMP_004', source: 'tiktok_ads', campaign: 'viral_challenge', content: 'ugc_video', term: 'jovens_18_24', clicks: 6200, leads: 430, sales: 25, revenue: 2150, roas: 1.2 },
            { id: 'CMP_005', source: 'organic_insta', campaign: 'stories_ceo', content: 'link_bio', term: '', clicks: 1440, leads: 130, sales: 17, revenue: 2140, roas: 0 },
        ],
        devices: { mobile: 78, desktop: 20, tablet: 2 }
    });

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1200);
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Radar color="var(--accent-color)" size={28} />
                        Rastreamento Inteligente (UTMs)
                    </h2>
                    <p className="text-muted">Painel centralizado de atribuição de conversões do Meta/Google Ads.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={16} /> Filtros
                    </button>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={16} /> Exportar CSV
                    </button>
                    <button className="btn btn-primary" onClick={refreshData} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RefreshCw size={16} className={isLoading ? "spinner" : ""} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                        {isLoading ? 'Sincronizando...' : 'Atualizar Dados'}
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                    <div className="card-title">Cliques Rastreáveis</div>
                    <div className="card-value">{trackingData.totalClicks.toLocaleString('pt-BR')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: 8 }}>+12% vs. período anterior</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
                    <div className="card-title">Leads Captações (UTM)</div>
                    <div className="card-value">{trackingData.uniqueLeads.toLocaleString('pt-BR')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Custo p/ Lead: {formatCurrency(trackingData.cpl)}</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div className="card-title">Vendas Atribuídas</div>
                    <div className="card-value">{trackingData.totalSales}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Custo p/ Aquisição: {formatCurrency(trackingData.cpa)}</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div className="card-title">Receita Rastreada</div>
                    <div className="card-value" style={{ color: 'var(--success)' }}>{formatCurrency(trackingData.revenue)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>ROAS Global: <strong>{trackingData.roas}</strong></div>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ gap: 24, marginBottom: 24 }}>
                <div className="card">
                    <h3 style={{ marginBottom: 24 }}>Volume de Tráfego vs Conversões</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trackingData.chart}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'white' }} />
                                <Area type="monotone" dataKey="clicks" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorClicks)" name="Cliques" strokeWidth={2} />
                                <Area type="monotone" dataKey="conversions" stroke="var(--success)" fillOpacity={1} fill="url(#colorConv)" name="Conversões" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: 24 }}>Dispositivos & Conexões</h3>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Smartphone size={16} color="var(--accent-color)" /> Mobile ({trackingData.devices.mobile}%)</span>
                                <span>{Math.round(trackingData.totalClicks * (trackingData.devices.mobile / 100)).toLocaleString('pt-BR')} cliques</span>
                            </div>
                            <div style={{ height: 8, background: 'var(--bg-color)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${trackingData.devices.mobile}%`, background: 'var(--accent-color)', borderRadius: 4 }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Monitor size={16} color="#a855f7" /> Desktop ({trackingData.devices.desktop}%)</span>
                                <span>{Math.round(trackingData.totalClicks * (trackingData.devices.desktop / 100)).toLocaleString('pt-BR')} cliques</span>
                            </div>
                            <div style={{ height: 8, background: 'var(--bg-color)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${trackingData.devices.desktop}%`, background: '#a855f7', borderRadius: 4 }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={16} color="var(--success)" /> Outros ({trackingData.devices.tablet}%)</span>
                                <span>{Math.round(trackingData.totalClicks * (trackingData.devices.tablet / 100)).toLocaleString('pt-BR')} cliques</span>
                            </div>
                            <div style={{ height: 8, background: 'var(--bg-color)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${trackingData.devices.tablet}%`, background: 'var(--success)', borderRadius: 4 }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Tracking Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3>Origem das Conversões (Postbacks UTM)</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(0,255,100,0.1)', padding: '6px 12px', borderRadius: 20 }}>
                        <CheckCircle size={14} /> Sincronização Pixel & CAPI Ativa
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Origem e Campanha</th>
                                <th>Criativo (UTM Content)</th>
                                <th style={{ textAlign: 'right' }}>Cliques</th>
                                <th style={{ textAlign: 'right' }}>Leads</th>
                                <th style={{ textAlign: 'right' }}>Vendas</th>
                                <th style={{ textAlign: 'right' }}>Receita</th>
                                <th style={{ textAlign: 'right' }}>ROAS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackingData.campaigns.map((camp) => (
                                <tr key={camp.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>{camp.campaign}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{
                                                padding: '2px 6px',
                                                backgroundColor: camp.source.includes('fb') ? 'rgba(59, 130, 246, 0.2)' : camp.source.includes('google') ? 'rgba(234, 67, 53, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                color: camp.source.includes('fb') ? '#60a5fa' : camp.source.includes('google') ? '#f87171' : 'white',
                                                borderRadius: 4,
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase'
                                            }}>{camp.source}</span>
                                            {camp.term && <span style={{ opacity: 0.7 }}>&middot; {camp.term}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{camp.content}</div>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{camp.clicks.toLocaleString('pt-BR')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{camp.leads.toLocaleString('pt-BR')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{camp.sales}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(camp.revenue)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            backgroundColor: camp.roas > 3 ? 'rgba(0, 208, 132, 0.1)' : camp.roas > 0 ? 'rgba(255, 171, 0, 0.1)' : 'rgba(255, 82, 82, 0.1)',
                                            color: camp.roas > 3 ? 'var(--success)' : camp.roas > 0 ? 'var(--warning)' : 'var(--danger)',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem'
                                        }}>
                                            {camp.roas > 0 ? `${camp.roas}x` : 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx="true">{`
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default MetaTracking;
