import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    
    const navItems: { id: Tab; label: string; icon: string }[] = [
        { id: 'announcements', label: 'Annonces', icon: 'campaign' },
        { id: 'flashcard', label: 'Mots', icon: 'brush' }, 
        { id: 'schedule', label: 'Emploi', icon: 'calendar_month' },
        { id: 'homework', label: 'Devoirs', icon: 'edit_note' },
        { id: 'profile', label: 'Profil', icon: 'person' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-imperial-red/10 px-4 pb-safe pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-end max-w-lg mx-auto pb-4">
                {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 group w-14 transition-all duration-300 ${isActive ? 'translate-y-[-4px]' : ''}`}
                        >
                            <div className={`
                                relative flex items-center justify-center rounded-full transition-all duration-300
                                ${isActive ? 'bg-imperial-red text-white w-10 h-10 shadow-lg shadow-imperial-red/30' : 'text-muted-ink w-8 h-8 group-hover:text-imperial-red'}
                            `}>
                                <span className={`material-symbols-outlined ${isActive ? 'filled text-[20px]' : 'text-[24px]'}`}>
                                    {item.icon}
                                </span>
                            </div>
                            <span className={`text-[9px] font-medium tracking-wide transition-colors ${isActive ? 'text-imperial-red font-bold' : 'text-muted-ink'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;