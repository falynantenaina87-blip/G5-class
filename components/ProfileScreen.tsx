import React from 'react';
import { useApp } from '../contexts/AppContext';

const ProfileScreen: React.FC = () => {
    const { user, signOut } = useApp();

    // Note: Login logic has been moved to LoginScreen.tsx and handled by App.tsx guard.
    // If we are here, user is guaranteed to be logged in.
    if (!user) return null;

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-rice-paper p-6 overflow-y-auto pb-28">
            <div className="bg-white rounded-2xl shadow-sm border border-imperial-gold/30 p-8 flex flex-col items-center text-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-imperial-red/5 to-transparent"></div>
                
                <div className="w-24 h-24 rounded-full bg-imperial-gold/10 flex items-center justify-center text-imperial-gold mb-4 border-2 border-white shadow-lg z-10">
                    <span className="material-symbols-outlined text-5xl">person</span>
                </div>

                <h2 className="text-2xl font-bold text-ink-black z-10">{user.fullName}</h2>
                <p className="text-muted-ink mb-2 z-10">@{user.username}</p>
                
                <div className="flex items-center gap-2 mt-2 z-10">
                    <span className="px-3 py-1 rounded-full bg-rice-paper border border-imperial-gold/20 text-xs font-bold text-ink-black uppercase tracking-wide">
                        Élève de la G5
                    </span>
                    {user.role === 'ADMIN' && (
                        <span className="px-3 py-1 rounded-full bg-imperial-gold text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-md animate-pulse-slow">
                            <span className="material-symbols-outlined text-sm">verified</span> Admin
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                        <span className="font-medium text-ink-black">Paramètres</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                 <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">help</span>
                        </div>
                        <span className="font-medium text-ink-black">Aide & Support</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
            </div>

            <button onClick={signOut} className="mt-8 w-full py-3 text-imperial-red font-bold border border-imperial-red/20 rounded-xl hover:bg-imperial-red/5 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">logout</span>
                Se déconnecter
            </button>
        </div>
    );
};

export default ProfileScreen;