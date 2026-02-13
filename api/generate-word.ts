import { GoogleGenAI, Type } from "@google/genai";
import { verifyAdmin, jsonResponse } from './utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

    // SÉCURITÉ : Seuls les admins peuvent consommer le quota IA
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) return jsonResponse({ error: 'Accès Refusé : Droits Admin requis pour l\'IA.' }, 403);

    const { character } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return jsonResponse({ error: "Configuration Serveur : Clé API manquante" }, 500);
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Génère une carte mémoire pour le caractère chinois suivant : "${character}". 
            Je veux le Pinyin, la traduction en français (courte), une phrase d'exemple simple en chinois, et la traduction de l'exemple en français.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pinyin: { type: Type.STRING },
                        translation: { type: Type.STRING },
                        example: { type: Type.STRING },
                        exampleTranslation: { type: Type.STRING },
                    },
                    required: ["pinyin", "translation", "example", "exampleTranslation"],
                },
            },
        });

        const text = response.text;
        if (!text) throw new Error("Réponse IA vide");
        
        return jsonResponse(JSON.parse(text));

    } catch (error: any) {
        console.error("AI Error:", error);
        return jsonResponse({ error: error.message || "Erreur de génération IA" }, 500);
    }
}