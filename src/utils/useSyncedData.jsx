import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

/**
 * Hook MULTI-TENANT para dados sincronizados com o backend.
 *
 * Usa o `namespace` exposto pelo AuthContext (calculado ao vivo a partir do user)
 * para garantir que cada tenant acesse APENAS os seus próprios dados.
 *
 * - CEO/Gestor/SDR/Designer → namespace 'shared'
 * - cliente_admin → namespace 'tenant_<id>'
 * - Membro de tenant → namespace 'tenant_<tenantId>'
 *
 * USO:
 *   const [clients, saveClients] = useSyncedData('u3_clients_v2', []);
 */
export function useSyncedData(key, fallback = [], overrideNamespace = null) {
    const { namespace: autoNamespace, setData } = useAuth();

    // Namespace efetivo: override explícito OU namespace automático do user logado
    const ns = overrideNamespace !== null ? overrideNamespace : autoNamespace;

    const [data, setLocalData] = useState(fallback);
    const hasFetched = useRef(false);

    // Sempre que o namespace ou chave mudar, re-busca do backend
    useEffect(() => {
        hasFetched.current = false;

        // Tenta ler do localStorage (cache local instantâneo)
        const localKey = `${ns}__${key}`;
        try {
            const cached = localStorage.getItem(localKey);
            if (cached !== null) {
                try {
                    const parsed = JSON.parse(cached);
                    setLocalData(parsed);
                } catch { }
            } else {
                // Se não há cache pra este namespace, começa com fallback limpo
                setLocalData(fallback);
            }
        } catch { }

        // Busca do backend (fonte de verdade)
        fetch(`${API_BASE}/api/data/${ns}/${key}`)
            .then(r => r.json())
            .then(result => {
                if (result.success && result.value !== null && result.value !== undefined) {
                    // Atualiza cache local e estado
                    try { localStorage.setItem(localKey, JSON.stringify(result.value)); } catch { }
                    setLocalData(result.value);
                } else if (!hasFetched.current) {
                    // Backend não tem dados para este namespace → usa fallback limpo
                    setLocalData(fallback);
                }
                hasFetched.current = true;
            })
            .catch(() => {
                hasFetched.current = true;
            });

        // Ouve atualizações vindas de outros hooks/componentes para o mesmo key
        const handleUpdate = (e) => {
            if (e.detail.key === key && e.detail.namespace === ns) {
                setLocalData(e.detail.value);
            }
        };
        window.addEventListener('u3_data_updated', handleUpdate);
        return () => window.removeEventListener('u3_data_updated', handleUpdate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, ns]);

    // Função para salvar (backend + cache local + notifica outros componentes)
    const save = useCallback((newValue) => {
        setLocalData(newValue);
        setData(key, newValue, ns);
    }, [key, ns, setData]);

    return [data, save];
}
