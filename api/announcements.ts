import { supabaseAdmin, verifyAdmin, jsonResponse } from './utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    // GET: Public
    if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse(data);
    }

    // POST: Admin Only
    if (req.method === 'POST') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        const body = await req.json();
        const { error } = await supabaseAdmin.from('announcements').insert([{
            title: body.title,
            description: body.description,
            image_url: body.imageUrl,
            tag: body.tag,
            date: body.date
        }]);

        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ success: true });
    }

    // DELETE: Admin Only
    if (req.method === 'DELETE') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        const { error } = await supabaseAdmin.from('announcements').delete().eq('id', id);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ success: true });
    }
}