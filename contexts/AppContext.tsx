import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement, Course, FlashcardData, Homework, User, Role } from '../types';
import { generateFlashcardContent } from '../services/ai';
import { api } from '../services/api';

interface ToastMessage {
    type: 'success' | 'error';
    message: string;
}

interface AppContextType {
    user: User | null;
    isLoading: boolean;
    
    // UI Feedback
    toast: ToastMessage | null;
    hideToast: () => void;
    
    // Auth Methods
    signIn: (email: string, pass: string) => Promise<{error: any}>;
    signUp: (email: string, pass: string, username: string, fullName: string) => Promise<{error: any}>;
    signOut: () => Promise<void>;

    // Data & Actions
    announcements: Announcement[];
    addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
    deleteAnnouncement: (id: string) => Promise<void>;
    
    flashcards: FlashcardData[];
    addFlashcard: (character: string) => Promise<void>;
    deleteFlashcard: (id: string) => Promise<void>;
    isGeneratingFlashcard: boolean;
    
    schedule: Record<string, Course[]>;
    addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
    updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
    
    homeworks: Homework[];
    addHomework: (homework: Omit<Homework, 'id' | 'isDone'>) => Promise<void>;
    deleteHomework: (id: string) => Promise<void>;
    toggleHomework: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    // Data State
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
    const [schedule, setSchedule] = useState<Record<string, Course[]>>({});
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [isGeneratingFlashcard, setIsGeneratingFlashcard] = useState(false);

    // --- Helpers ---
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const hideToast = () => setToast(null);

    const handleError = (e: any) => {
        console.error(e);
        const msg = e.error || e.message || "Une erreur est survenue";
        // Detection spécifique des erreurs 403 renvoyées par l'API
        if (msg.includes('Forbidden') || msg.includes('Admin')) {
            showToast("Accès Refusé : Droits Admin requis", 'error');
        } else {
            showToast(msg, 'error');
        }
    };

    const loadFromCache = (key: string, setter: Function) => {
        const cached = localStorage.getItem(`g5_${key}`);
        if (cached) setter(JSON.parse(cached));
    };
    const saveToCache = (key: string, data: any) => {
        localStorage.setItem(`g5_${key}`, JSON.stringify(data));
    };

    // --- Initialization & Auth Guard Logic ---
    
    // 1. Check Session on Mount
    useEffect(() => {
        checkUserSession();
    }, []);

    // 2. Fetch Data ONLY if User is Authenticated
    useEffect(() => {
        if (user) {
            // Load cache first for instant feel
            loadFromCache('announcements', setAnnouncements);
            loadFromCache('flashcards', setFlashcards);
            loadFromCache('schedule', setSchedule);
            loadFromCache('homeworks', (data: Homework[]) => {
                 const doneIds = JSON.parse(localStorage.getItem('g5_homework_done_ids') || '[]');
                 setHomeworks(data.map(h => ({...h, isDone: doneIds.includes(h.id)})));
            });
            // Then fetch fresh data
            fetchData();
        } else {
            // Clear data from memory if logged out
            setAnnouncements([]);
            setFlashcards([]);
            setSchedule({});
            setHomeworks([]);
        }
    }, [user]);

    const checkUserSession = async () => {
        if (!api.getToken()) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            // This endpoint returns the Role (Admin/Student)
            const userData = await api.get('/auth?action=me');
            setUser(userData);
        } catch (e) {
            api.clearToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const ann = await api.get('/announcements');
            setAnnouncements(ann);
            saveToCache('announcements', ann);

            const flash = await api.get('/flashcards');
            const mappedFlash = flash.map((f: any) => ({
                id: f.id,
                character: f.character,
                pinyin: f.pinyin,
                translation: f.translation,
                example: f.example,
                exampleTranslation: f.example_translation,
                dateAdded: f.date_added
            }));
            setFlashcards(mappedFlash);
            saveToCache('flashcards', mappedFlash);

            const sch = await api.get('/schedule');
            const mappedSchedule = sch.map((c: any) => ({
                 id: c.id,
                 subject: c.subject,
                 room: c.room,
                 startTime: c.start_time,
                 endTime: c.end_time,
                 day: c.day
             }));
             const schMap: Record<string, Course[]> = {};
             mappedSchedule.forEach((c: Course) => {
                 if(!schMap[c.day]) schMap[c.day] = [];
                 schMap[c.day].push(c);
             });
             Object.keys(schMap).forEach(day => {
                 schMap[day].sort((a,b) => a.startTime.localeCompare(b.startTime));
             });
             setSchedule(schMap);
             saveToCache('schedule', schMap);

            const hw = await api.get('/homework');
            const doneIds = JSON.parse(localStorage.getItem('g5_homework_done_ids') || '[]');
            const mappedHw = hw.map((h: any) => ({
                id: h.id,
                title: h.title,
                dueDate: h.due_date,
                isGlobal: h.is_global,
                isDone: doneIds.includes(h.id)
            }));
            setHomeworks(mappedHw);
            saveToCache('homeworks', mappedHw);

        } catch (e) {
            console.warn("Mode hors-ligne ou erreur fetch", e);
        }
    };

    // --- Actions ---
    
    const signIn = async (email: string, pass: string) => {
        try {
            const session = await api.post('/auth?action=login', { email, password: pass });
            if (session.access_token) {
                api.setToken(session.access_token);
                await checkUserSession(); // This triggers the user effect -> fetches data
                showToast(`Bon retour !`, 'success');
                return { error: null };
            }
            return { error: { message: "Erreur inconnue" } };
        } catch (e: any) {
            return { error: e };
        }
    };

    const signUp = async (email: string, pass: string, username: string, fullName: string) => {
        try {
            const session = await api.post('/auth?action=signup', { email, password: pass, username, fullName });
            if (session.access_token) {
                api.setToken(session.access_token);
                await checkUserSession();
                showToast(`Compte créé avec succès !`, 'success');
                return { error: null };
            }
            return { error: { message: "Erreur inconnue" } };
        } catch (e: any) {
            return { error: e };
        }
    };

    const signOut = async () => {
        api.clearToken();
        setUser(null); // This triggers the effect to clear data
        showToast("Déconnecté", 'success');
    };

    const addAnnouncement = async (data: Omit<Announcement, 'id'>) => {
        try {
            await api.post('/announcements', data);
            fetchData();
            showToast("Annonce publiée", 'success');
        } catch (e) { handleError(e); }
    };

    const deleteAnnouncement = async (id: string) => {
        try {
            await api.delete(`/announcements?id=${id}`);
            fetchData();
            showToast("Annonce supprimée", 'success');
        } catch (e) { handleError(e); }
    };

    const addFlashcard = async (character: string) => {
        setIsGeneratingFlashcard(true);
        try {
            const aiData = await generateFlashcardContent(character);
            await api.post('/flashcards', {
                character,
                pinyin: aiData.pinyin || '',
                translation: aiData.translation || '',
                example: aiData.example || '',
                exampleTranslation: aiData.exampleTranslation || '',
                dateAdded: new Date().toISOString()
            });
            fetchData();
            showToast("Carte créée avec succès", 'success');
        } catch (e) { 
            handleError(e); 
        } finally {
            setIsGeneratingFlashcard(false);
        }
    };

    const deleteFlashcard = async (id: string) => {
        try {
            await api.delete(`/flashcards?id=${id}`);
            fetchData();
            showToast("Carte supprimée", 'success');
        } catch (e) { handleError(e); }
    };

    const addCourse = async (data: Omit<Course, 'id'>) => {
        try {
            await api.post('/schedule', data);
            fetchData();
            showToast("Cours ajouté", 'success');
        } catch (e) { handleError(e); }
    };

    const updateCourse = async (id: string, updates: Partial<Course>) => {
        try {
            await api.put(`/schedule?id=${id}`, updates);
            fetchData();
            showToast("Cours mis à jour", 'success');
        } catch (e) { handleError(e); }
    };

    const deleteCourse = async (id: string) => {
        try {
            await api.delete(`/schedule?id=${id}`);
            fetchData();
            showToast("Cours supprimé", 'success');
        } catch (e) { handleError(e); }
    };

    const addHomework = async (data: Omit<Homework, 'id' | 'isDone'>) => {
        try {
            await api.post('/homework', data);
            fetchData();
            showToast("Devoir ajouté", 'success');
        } catch (e) { handleError(e); }
    };

    const deleteHomework = async (id: string) => {
        try {
            await api.delete(`/homework?id=${id}`);
            fetchData();
            showToast("Devoir supprimé", 'success');
        } catch (e) { handleError(e); }
    };

    const toggleHomework = (id: string) => {
        setHomeworks(prev => {
            const newHw = prev.map(h => h.id === id ? { ...h, isDone: !h.isDone } : h);
            const doneIds = newHw.filter(h => h.isDone).map(h => h.id);
            localStorage.setItem('g5_homework_done_ids', JSON.stringify(doneIds));
            return newHw;
        });
    };

    return (
        <AppContext.Provider value={{
            user, isLoading, toast, hideToast, signIn, signUp, signOut,
            announcements, addAnnouncement, deleteAnnouncement,
            flashcards, addFlashcard, deleteFlashcard, isGeneratingFlashcard,
            schedule, addCourse, updateCourse, deleteCourse,
            homeworks, addHomework, deleteHomework, toggleHomework
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};