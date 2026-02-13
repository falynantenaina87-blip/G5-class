import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const LoginScreen: React.FC = () => {
    const { signIn, signUp } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(true);
    
    // Auth Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        
        let res;
        if (isLoginMode) {
            res = await signIn(email, password);
        } else {
            res = await signUp(email, password, username, fullName);
        }

        if (res.error) {
            setErrorMsg(res.error.message || "Une erreur est survenue.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-6 justify-center bg-rice-paper min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-calligraphy text-imperial-red mb-2 drop-shadow-sm">G5 Class</h1>
                <p className="text-muted-ink font-medium tracking-wide">Portail Numérique & Culturel</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-imperial-gold/20 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-imperial-red/5 rounded-bl-full -mr-8 -mt-8"></div>
                
                <h2 className="text-xl font-bold text-ink-black mb-6 border-b pb-4 border-gray-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-imperial-red">lock</span>
                    {isLoginMode ? 'Connexion' : 'Inscription Élève'}
                </h2>
                
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 border border-red-100">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLoginMode && (
                        <>
                            <div className="animate-fade-in">
                                <label className="text-xs font-bold text-muted-ink uppercase">Nom Complet</label>
                                <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 border rounded-lg focus:border-imperial-red outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Jean Dupont" />
                            </div>
                            <div className="animate-fade-in">
                                <label className="text-xs font-bold text-muted-ink uppercase">Nom d'utilisateur</label>
                                <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 border rounded-lg focus:border-imperial-red outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="jean.d" />
                                <p className="text-[10px] text-muted-ink mt-1 italic">*Identifiant unique pour l'école.</p>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="text-xs font-bold text-muted-ink uppercase">Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:border-imperial-red outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="email@exemple.com" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-ink uppercase">Mot de passe</label>
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:border-imperial-red outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="••••••" />
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full bg-imperial-red text-white py-3.5 rounded-xl font-bold shadow-lg shadow-imperial-red/20 hover:bg-red-700 transition-all disabled:opacity-50 mt-4 active:scale-[0.98]">
                        {isSubmitting ? 'Authentification...' : (isLoginMode ? 'Entrer en classe' : "S'inscrire")}
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-gray-50">
                    <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-imperial-red font-semibold hover:underline">
                        {isLoginMode ? "Nouvel élève ? Créer un compte" : "Déjà élève ? Se connecter"}
                    </button>
                </div>
            </div>
            
            <p className="text-center text-xs text-muted-ink/50 mt-8">© G5 Class - Accès réservé</p>
        </div>
    );
};

export default LoginScreen;