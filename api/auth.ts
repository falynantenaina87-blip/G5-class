import { supabaseAdmin, jsonResponse, ADMIN_USERNAMES } from './utils';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (req.method === 'POST') {
        const body = await req.json();

        if (action === 'login') {
            const { data, error } = await supabaseAdmin.auth.signInWithPassword({
                email: body.email,
                password: body.password
            });
            if (error) return jsonResponse({ error: error.message }, 401);
            return jsonResponse(data.session);
        }

        if (action === 'signup') {
            const { data, error } = await supabaseAdmin.auth.signUp({
                email: body.email,
                password: body.password
            });
            if (error) return jsonResponse({ error: error.message }, 400);
            
            if (data.user) {
                // Création du profil immédiate
                const { error: profileError } = await supabaseAdmin.from('profiles').insert({
                    id: data.user.id,
                    username: body.username,
                    full_name: body.fullName
                });
                if (profileError) return jsonResponse({ error: "Erreur création profil" }, 500);
            }
            return jsonResponse(data.session);
        }
    }

    if (req.method === 'GET' && action === 'me') {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return jsonResponse({ error: 'No token' }, 401);

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) return jsonResponse({ error: 'Invalid token' }, 401);

        const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', user.id).single();
        
        if (!profile) return jsonResponse({ error: 'Profile not found' }, 404);

        const role = ADMIN_USERNAMES.includes(profile.username) ? 'ADMIN' : 'STUDENT';

        return jsonResponse({
            id: user.id,
            email: user.email,
            username: profile.username,
            fullName: profile.full_name,
            role
        });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
}