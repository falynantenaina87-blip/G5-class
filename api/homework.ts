import { supabaseAdmin, verifyAdmin, jsonResponse } from './utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin
            .from('homework')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse(data);
    }

    if (req.method === 'POST') {
        const body = await req.json();
        // Si devoir global, Admin requis
        if (body.isGlobal) {
            const isAdmin = await verifyAdmin(req);
            if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);
        }
        // Pour devoir perso, on autorise tout le monde (dans cette démo simplifiée sans table homework_perso dédiée)
        // Note: Dans une vraie app, on lierait le devoir perso à l'ID user.
        // Ici on suppose que POST est utilisé pour ajouter des devoirs à la DB commune (Global ou Perso pour la démo)

        const { error } = await supabaseAdmin.from('homework').insert([{
            title: body.title,
            due_date: body.dueDate,
            is_global: body.isGlobal
        }]);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ success: true });
    }

    if (req.method === 'DELETE') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const { error } = await supabaseAdmin.from('homework').delete().eq('id', id);
        if (error) return jsonResponse({ error }, 500);
        return jsonResponse({ success: true });
    }
}