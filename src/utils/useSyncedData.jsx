import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './auth';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

/**
 * Hook MULTI-TENANT para dados sincronizados em TEMPO REAL com Firebase Firestore.
 *
 * Utiliza o `namespace` da sessão para isolar dados entre agências/clientes.
 *
 * USO:
 *   const [clients, saveClients] = useSyncedData('u3_clients_v2', []);
 */
export function useSyncedData(key, fallback = [], overrideNamespace = null) {
    const { namespace: autoNamespace } = useAuth();
    const ns = overrideNamespace !== null ? overrideNamespace : autoNamespace;

    const [data, setLocalData] = useState(fallback);
    const hasInitialData = useRef(false);

    useEffect(() => {
        if (!ns || !key) return;

        // Referência do documento no Firestore: Coleção 'crm_data' -> Documento '[namespace]__[key]'
        const docRef = doc(db, "crm_data", `${ns}__${key}`);

        // Tenta ler do localStorage primeiro para carregamento instantâneo (UI rápida)
        const localKey = `${ns}__${key}`;
        try {
            const cached = localStorage.getItem(localKey);
            if (cached !== null && !hasInitialData.current) {
                setLocalData(JSON.parse(cached));
            }
        } catch (e) { }

        // SUBSCRIPTION REAL-TIME (onSnapshot)
        // Isso resolve o problema de não atualizar em outras máquinas
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const cloudData = docSnap.data().value;
                setLocalData(cloudData);
                // Atualiza o cache local para o próximo carregamento rápido
                try { localStorage.setItem(localKey, JSON.stringify(cloudData)); } catch (e) { }
            } else {
                // Se documento não existe na nuvem, mantém o local ou volta pro fallback
                if (!hasInitialData.current) {
                    setLocalData(fallback);
                }
            }
            hasInitialData.current = true;
        }, (error) => {
            console.error(`Erro ao sincronizar Firestore (${key}):`, error);
        });

        return () => unsubscribe();
    }, [key, ns]);

    // Função para salvar (Sincroniza com Firestore na nuvem)
    const save = useCallback(async (newValue) => {
        if (!ns || !key) return;

        // Atualiza UI local imediatamente
        setLocalData(newValue);
        
        // Persiste no cache local
        try { localStorage.setItem(`${ns}__${key}`, JSON.stringify(newValue)); } catch (e) { }

        // Persiste no Firestore (vai refletir em todas as outras máquinas via onSnapshot)
        try {
            const docRef = doc(db, "crm_data", `${ns}__${key}`);
            await setDoc(docRef, { 
                value: newValue,
                updatedAt: new Date().toISOString(),
                namespace: ns,
                key: key
            });
        } catch (error) {
            console.error(`Erro ao salvar no Firestore (${key}):`, error);
        }
    }, [key, ns]);

    return [data, save];
}
