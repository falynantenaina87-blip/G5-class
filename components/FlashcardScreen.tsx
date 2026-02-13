import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const FlashcardScreen: React.FC = () => {
    const { flashcards, user, addFlashcard, deleteFlashcard, isGeneratingFlashcard } = useApp();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputChar, setInputChar] = useState('');

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
    };

    const handleDelete = async () => {
        if(!currentCard || !confirm("Supprimer ce mot ?")) return;
        await deleteFlashcard(currentCard.id);
        setCurrentIndex(0);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!inputChar) return;
        
        await addFlashcard(inputChar);
        setInputChar('');
        setIsModalOpen(false);
        setCurrentIndex(0);
    };

    return (
        <div className="flex flex-col h-full w-full bg-zen-pattern bg-cover relative overflow-hidden">
            {/* Subtle decorative clouds */}
            <div className="absolute top-10 left-5 opacity-5 pointer-events-none text-ink-black">
                <svg fill="currentColor" height="60" viewBox="0 0 100 50" width="120"><path d="M25 40c-10 0-15-8-10-15 2-3 6-5 10-5 2-8 12-12 20-10 8 2 12 10 10 18 5 0 10 4 10 10s-5 10-10 10H25z"></path></svg>
            </div>
            
            <header className="flex items-center justify-between px-6 py-4 z-10">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur hover:bg-white transition-colors" onClick={handlePrev}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-muted-ink">Mots du jour</h1>
                    <div className="flex gap-1 justify-center mt-1">
                        {flashcards.map((_, idx) => (
                            <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-imperial-red' : 'bg-imperial-gold/30'}`} />
                        ))}
                    </div>
                </div>
                {user?.role === 'ADMIN' ? (
                     <button onClick={() => setIsModalOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-imperial-red text-white shadow-lg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                ) : (
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur hover:bg-white transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                )}
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-8 pb-24 z-10 w-full max-w-md mx-auto">
                {currentCard ? (
                <div 
                    onClick={() => handleNext()} 
                    className="w-full bg-white rounded-2xl shadow-xl shadow-imperial-red/5 border border-imperial-gold/30 flex flex-col items-center justify-between p-8 min-h-[500px] relative overflow-hidden transition-all duration-300 active:scale-[0.98] cursor-pointer group"
                >
                    {/* Admin Delete Icon inside Card */}
                    {user?.role === 'ADMIN' && (
                        <div onClick={(e) => {e.stopPropagation(); handleDelete();}} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-200">
                             <span className="material-symbols-outlined text-lg">delete</span>
                        </div>
                    )}

                    {/* Corner Borders */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-imperial-gold/40 rounded-tl-lg"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-imperial-gold/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-imperial-gold/40 rounded-br-lg"></div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <div className="relative mb-8 group">
                            <span className="text-[140px] font-calligraphy leading-none select-none text-ink-black drop-shadow-sm transition-transform group-hover:scale-110 duration-500 block">
                                {currentCard.character}
                            </span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-3 text-center">
                            <span className="text-4xl font-medium text-imperial-red tracking-wide font-serif">{currentCard.pinyin}</span>
                            <span className="text-xl text-muted-ink font-light italic mt-2">{currentCard.translation}</span>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="w-full pt-8 border-t border-imperial-gold/10 mt-4">
                         <div className="text-center space-y-2">
                             <p className="text-sm text-ink-black font-medium">{currentCard.exampleTranslation}</p>
                             <p className="text-sm text-muted-ink italic">"{currentCard.example}"</p>
                         </div>
                    </div>
                </div>
                ) : (
                    <div className="text-center text-muted-ink">
                        <p>Aucun mot pour l'instant.</p>
                    </div>
                )}

                <div className="mt-8 flex gap-6">
                    <button className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md text-imperial-red hover:bg-imperial-red hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined">volume_up</span>
                    </button>
                     <button className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md text-imperial-gold hover:bg-imperial-gold hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined">star</span>
                    </button>
                </div>
                
                <p className="mt-6 text-xs text-muted-ink/60 font-medium tracking-widest uppercase">Appuyez pour le suivant</p>
            </main>

            {/* AI Generator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
                    <div className="bg-rice-paper w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
                         <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-ink hover:text-ink-black">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-imperial-red/10 rounded-full flex items-center justify-center mx-auto mb-3 text-imperial-red">
                                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-bold text-ink-black">Générateur IA</h3>
                            <p className="text-sm text-muted-ink mt-1">Entrez un caractère, l'IA remplira le reste.</p>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <input 
                                    autoFocus
                                    type="text" 
                                    maxLength={1}
                                    value={inputChar} 
                                    onChange={e => setInputChar(e.target.value)} 
                                    className="w-full text-center text-5xl font-calligraphy p-4 rounded-xl border-2 border-imperial-gold/30 focus:border-imperial-red focus:outline-none" 
                                    placeholder="?" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isGeneratingFlashcard || !inputChar}
                                className="w-full bg-imperial-red text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isGeneratingFlashcard ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Génération...
                                    </>
                                ) : (
                                    'Créer la carte'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardScreen;