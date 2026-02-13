import { FlashcardData } from "../types";
import { api } from "./api";

// Le client ne connait plus la clé API. Il demande au serveur de générer.
export const generateFlashcardContent = async (character: string): Promise<Partial<FlashcardData>> => {
    try {
        const data = await api.post('/generate-word', { character });
        return data;
    } catch (error: any) {
        console.error("Erreur génération:", error);
        throw error; // L'erreur sera attrapée par le Context pour afficher le Toast
    }
};