import { supabaseAdmin, verifyAdmin, jsonResponse } from './utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin.from('schedule').select('*');
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse(data);
    }

    // Tous les changements nécessitent Admin
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        if (req.method === 'POST') {
            const body = await req.json();
            const { error } = await supabaseAdmin.from('schedule').insert([{
                subject: body.subject,
                room: body.room,
                start_time: body.startTime,
                end_time: body.endTime,
                day: body.day
            }]);
            if (error) return jsonResponse({ error }, 500);
        }

        if (req.method === 'PUT') {
            const body = await req.json();
            const url = new URL(req.url);
            const id = url.searchParams.get('id');
            const { error } = await supabaseAdmin.from('schedule').update({
                subject: body.subject,
                room: body.room,
                start_time: body.startTime,
                end_time: body.endTime,
            }).eq('id', id);
            if (error) return jsonResponse({ error }, 500);
        }

        if (req.method === 'DELETE') {
            const url = new URL(req.url);
            const id = url.searchParams.get('id');
            const { error } = await supabaseAdmin.from('schedule').delete().eq('id', id);
            if (error) return jsonResponse({ error }, 500);
        }
        return jsonResponse({ success: true });
    }
}