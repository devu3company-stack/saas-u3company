import { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, TrendingDown, TrendingUp, Plus, CreditCard, Calendar, Wallet } from 'lucide-react';

const Financeiro = () => {
    const [custos, setCustos] = useState(() => {
        const saved = localStorage.getItem('u3_custos');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, descricao: 'Google Workspace', valorNum: 145.00, data: '20/02/2026', categoria: 'Software' },
            { id: 2, descricao: 'Meta Ads (Tráfego U3)', valorNum: 1500.00, data: '18/02/2026', categoria: 'Marketing' },
            { id: 3, descricao: 'Vercel Pro', valorNum: 100.00, data: '15/02/2026', categoria: 'Infraestrutura' }
        ];
    });

    const [caixa, setCaixa] = useState(() => {
        const saved = localStorage.getItem('u3_caixa');
        return saved ? Number(saved) : 50000;
    });

    const [mrrAtual, setMrrAtual] = useState(21000); // Exemplo fixo ou pega do localStorage

    const [inadimplentes, setInadimplentes] = useState([
        { id: 1, cliente: 'AlphaTech Solutions', valor: 'R$ 1.250,00', vencimento: '10/02/2026', status: 'Atrasado (11 dias)', telefone: '(11) 98765-4321' },
        { id: 2, cliente: 'Clínica Sorriso', valor: 'R$ 800,00', vencimento: '05/02/2026', status: 'Atrasado (16 dias)', telefone: '(19) 91234-5678' }
    ]);

    const [showCustoModal, setShowCustoModal] = useState(false);
    const [showCaixaModal, setShowCaixaModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('u3_custos', JSON.stringify(custos));
        localStorage.setItem('u3_caixa', caixa.toString());
    }, [custos, caixa]);

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const totalCustos = custos.reduce((acc, curr) => acc + (curr.valorNum || 0), 0);
    const saldoLiquido = mrrAtual - totalCustos;

    const handleAddCusto = (e) => {
        e.preventDefault();
        const form = e.target;
        const vText = form.valor.value.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
        const novoCusto = {
            id: Date.now(),
            descricao: form.descricao.value,
            valorNum: Number(vText),
            data: form.data.value.split('-').reverse().join('/'),
            categoria: form.categoria.value
        };
        setCustos([novoCusto, ...custos]);
        setShowCustoModal(false);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Gestão Financeira</h1>
                    <p className="text-muted">Controle de Inadimplência e Custos da Empresa (Acesso Restrito)</p>
                </div>
            </div>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp size={18} color="var(--success)" />
                        MRR Atual
                    </div>
                    <div className="card-value" style={{ color: 'var(--success)' }}>{formatCurrency(mrrAtual)}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Receita recorrente</p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingDown size={18} color="var(--danger)" />
                        Total de Despesas
                    </div>
                    <div className="card-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalCustos)}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Custos mensais salvos</p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid #4FC3F7' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <DollarSign size={18} color="#4FC3F7" />
                        Saldo Líquido
                    </div>
                    <div className="card-value" style={{ color: saldoLiquido >= 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                        {formatCurrency(saldoLiquido)}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>MRR - Despesas</p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--accent-color)', cursor: 'pointer' }} onClick={() => setShowCaixaModal(true)}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Wallet size={18} color="var(--accent-color)" />
                            Valor em Caixa
                        </div>
                    </div>
                    <div className="card-value" style={{ color: 'var(--accent-color)' }}>{formatCurrency(caixa)}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Clique para editar</p>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ gap: 24 }}>
                {/* Coluna Inadimplentes */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <AlertCircle size={18} color="var(--danger)" /> Clientes Inadimplentes
                        </h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Cliente</th>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Valor / Venc.</th>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inadimplentes.map(item => (
                                <tr key={item.id}>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ fontWeight: 600 }}>{item.cliente}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.telefone}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--danger)' }}>{item.valor}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.status}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Cobrar (WhatsApp)</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Coluna Custos */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <CreditCard size={18} color="var(--accent-color)" /> Custos da Empresa
                        </h3>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowCustoModal(true)}>
                            <Plus size={16} /> Lançar Custo
                        </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Descrição</th>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Categoria / Data</th>
                                <th style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custos.map(item => (
                                <tr key={item.id}>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ fontWeight: 600 }}>{item.descricao}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{item.categoria}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.data}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 600 }}>
                                        {formatCurrency(item.valorNum)}
                                    </td>
                                </tr>
                            ))}
                            {custos.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum custo cadastrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Lançar Custo */}
            {showCustoModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 480 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CreditCard size={20} color="var(--accent-color)" /> Lançar Novo Custo
                        </h3>
                        <form onSubmit={handleAddCusto}>
                            <div className="form-group">
                                <label className="form-label">Descrição do Custo</label>
                                <input name="descricao" type="text" className="form-control" required placeholder="Ex: Pagamento Fornecedor" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoria</label>
                                <select name="categoria" className="form-control" required>
                                    <option>Marketing / Tráfego</option>
                                    <option>Software / Ferramentas</option>
                                    <option>Infraestrutura / Servidores</option>
                                    <option>Folha de Pagamento</option>
                                    <option>Impostos / Taxas</option>
                                    <option>Outros</option>
                                </select>
                            </div>
                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Valor (R$)</label>
                                    <input name="valor" type="text" className="form-control" required placeholder="0,00" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Data</label>
                                    <input name="data" type="date" className="form-control" required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowCustoModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Confirmar Lançamento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Caixa Atual */}
            {showCaixaModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 400 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Wallet size={20} color="var(--accent-color)" /> Atualizar Caixa
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const vText = e.target.caixaValor.value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
                            setCaixa(Number(vText));
                            setShowCaixaModal(false);
                        }}>
                            <div className="form-group">
                                <label className="form-label">Valor em Caixa Atual (R$)</label>
                                <input name="caixaValor" type="text" className="form-control" required defaultValue={caixa} placeholder="0,00" />
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowCaixaModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Atualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financeiro;
