// db-supabase.js — Substituição do lowdb por Supabase (banco persistente real)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://caxilmlowkjtswtaaoyo.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheGlsbWxvd2tqdHN3dGFhb3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzUzMzAsImV4cCI6MjA4ODg1MTMzMH0.nX_XNFWhMPNGnHaqCbMaHoPt6reANah1MdWXvatXupo'
);

const INITIAL_USERS = [
    { id: 1, email: 'demo@u3company.com', password: 'demo', name: 'Usuário Demonstração', role: 'ceo', tenant_id: null, custom_permissions: null },
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador', role: 'ceo', tenant_id: null, custom_permissions: null },
    { id: 3, email: 'designer@u3company.com', password: 'designer123', name: 'Time de Design', role: 'designer', tenant_id: null, custom_permissions: null }
];

// GET data by namespace + key
async function getData(namespace, key) {
    try {
        const { data, error } = await supabase
            .from('crm_data')
            .select('value')
            .eq('namespace', namespace)
            .eq('key', key)
            .single();
        if (error || !data) return null;
        return data.value;
    } catch (e) {
        console.error('DB getData error:', e.message);
        return null;
    }
}

// SET data by namespace + key (upsert)
async function setData(namespace, key, value) {
    try {
        const { error } = await supabase
            .from('crm_data')
            .upsert({ namespace, key, value, updated_at: new Date().toISOString() }, { onConflict: 'namespace,key' });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('DB setData error:', e.message);
        return false;
    }
}

// GET all users (returns array in legacy format)
async function getUsers() {
    try {
        const { data, error } = await supabase
            .from('crm_users')
            .select('*')
            .order('id', { ascending: true });
        if (error || !data || data.length === 0) return INITIAL_USERS;
        // Convert snake_case to camelCase for frontend compatibility
        return data.map(u => ({
            id: u.id,
            email: u.email,
            password: u.password,
            name: u.name,
            role: u.role,
            tenantId: u.tenant_id,
            customPermissions: u.custom_permissions
        }));
    } catch (e) {
        console.error('DB getUsers error:', e.message);
        return INITIAL_USERS;
    }
}

// SAVE all users (replaces entire list)
async function saveUsers(users) {
    try {
        // Convert camelCase to snake_case
        const rows = users.map(u => ({
            id: u.id,
            email: u.email,
            password: u.password,
            name: u.name,
            role: u.role,
            tenant_id: u.tenantId || null,
            custom_permissions: u.customPermissions || null,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('crm_users')
            .upsert(rows, { onConflict: 'id' });
        
        if (error) throw error;

        // Remove users that no longer exist
        const ids = users.map(u => u.id);
        await supabase
            .from('crm_users')
            .delete()
            .not('id', 'in', `(${ids.join(',')})`);

        return true;
    } catch (e) {
        console.error('DB saveUsers error:', e.message);
        return false;
    }
}

module.exports = { getData, setData, getUsers, saveUsers };
