import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth';

/**
 * Hook que mantém dados SEMPRE sincronizados com o backend.
 * 
 * - Na montagem: renderiza com cache local (se houver) para UX rápida
 * - Em paralelo: busca do backend via getData (que dispara u3_data_updated)
 * - Quando o backend responde: atualiza o estado automaticamente
 * - Quando o usuário salva: salva no backend via setData
 * 
 * USO:
 *   const [clients, saveClients] = useSyncedData('u3_clients_v2', [], 'shared');
 */
export function useSyncedData(key, fallback = [], overrideNamespace = null) {
    const { getData, setData } = useAuth();
    const ns = overrideNamespace || null;

    const [data, setLocalData] = useState(() => {
        const initial = getData(key, JSON.stringify(fallback), ns);
        return initial ?? fallback;
    });

    // Ouve atualizações vindas do backend (disparadas pelo getData)
    useEffect(() => {
        const handleUpdate = (e) => {
            if (e.detail.key === key) {
                setLocalData(e.detail.value);
            }
        };
        window.addEventListener('u3_data_updated', handleUpdate);

        // Re-fetch ao montar (caso a primeira chamada no useState não tenha pego do backend)
        const fresh = getData(key, JSON.stringify(fallback), ns);
        if (fresh !== null && fresh !== undefined) {
            setLocalData(fresh);
        }

        return () => window.removeEventListener('u3_data_updated', handleUpdate);
    }, [key, ns]);

    // Função para salvar (backend + estado local)
    const save = useCallback((newValue) => {
        setLocalData(newValue);
        setData(key, newValue, ns);
    }, [key, ns, setData]);

    return [data, save];
}
