import { supabaseAdmin, verifyAdmin, jsonResponse } from './utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin
            .from('flashcards')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse(data);
    }

    if (req.method === 'POST') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        const body = await req.json();
        const { error } = await supabaseAdmin.from('flashcards').insert([{
            character: body.character,
            pinyin: body.pinyin,
            translation: body.translation,
            example: body.example,
            example_translation: body.exampleTranslation,
            date_added: body.dateAdded
        }]);

        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ success: true });
    }

    if (req.method === 'DELETE') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        const { error } = await supabaseAdmin.from('flashcards').delete().eq('id', id);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ success: true });
    }
}