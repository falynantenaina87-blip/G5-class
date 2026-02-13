// Service Proxy pour communiquer avec le backend Serverless
const API_BASE = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('g5_session_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // Auth Helpers
    setToken: (token: string) => localStorage.setItem('g5_session_token', token),
    clearToken: () => localStorage.removeItem('g5_session_token'),
    getToken: () => localStorage.getItem('g5_session_token'),

    // Generic Methods
    get: async (endpoint: string) => {
        const res = await fetch(`${API_BASE}${endpoint}`, { headers: getHeaders() });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    post: async (endpoint: string, body: any) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    put: async (endpoint: string, body: any) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    delete: async (endpoint: string) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw await res.json();
        return res.json();
    }
};