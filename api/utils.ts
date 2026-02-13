import { createClient } from '@supabase/supabase-js';

// SERVER-SIDE ONLY CONFIGURATION
const SUPABASE_URL = process.env.SUPABASE_URL!;
// Utilisation de la clé Service Role pour avoir les droits complets après vérification manuelle
// OU clé Anon si on se repose sur RLS. Ici on sécurise via code.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

export const ADMIN_USERNAMES = ['juliano', 'delegate1', 'delegate2'];

// Helper pour vérifier si la requête vient d'un Admin
export const verifyAdmin = async (req: Request): Promise<boolean> => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) return false;

    // Vérification du pseudo dans la table profiles
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

    if (!profile) return false;

    return ADMIN_USERNAMES.includes(profile.username);
};

export const getUser = async (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    return user;
}

export const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
};