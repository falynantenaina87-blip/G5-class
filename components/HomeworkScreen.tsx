import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const HomeworkScreen: React.FC = () => {
    const { homeworks, user, toggleHomework, addHomework, deleteHomework } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [isGlobal, setIsGlobal] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addHomework({
            title,
            dueDate: date,
            isGlobal: isGlobal && user?.role === 'ADMIN' // Only admins can add global
        });
        setIsModalOpen(false);
        setTitle('');
        setDate('');
    };

    const pendingCount = homeworks.filter(t => !t.isDone).length;

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-rice-paper">
             <header className="sticky top-0 z-20 bg-rice-paper/95 backdrop-blur-md px-6 py-6 flex flex-col border-b border-imperial-gold/20">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ink-black">Devoirs</h1>
                        <p className="text-sm text-muted-ink mt-1">
                            {pendingCount} devoir{pendingCount > 1 ? 's' : ''} en attente
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-imperial-red/10 flex items-center justify-center text-imperial-red">
                        <span className="material-symbols-outlined filled">assignment</span>
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
                    <div 
                        className="h-full bg-imperial-red transition-all duration-500 ease-out"
                        style={{ width: homeworks.length ? `${(homeworks.filter(t => t.isDone).length / homeworks.length) * 100}%` : '0%' }}
                    />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-28">
                {homeworks.length === 0 && (
                    <div className="text-center text-muted-ink mt-10">Aucun devoir. Reposez-vous !</div>
                )}

                <div className="space-y-3">
                    {homeworks.map((task) => (
                        <div 
                            key={task.id}
                            className={`
                                flex items-center p-4 bg-white rounded-xl border transition-all duration-200 group
                                ${task.isDone ? 'opacity-60 border-transparent shadow-none' : 'border-imperial-gold/20 shadow-sm hover:shadow-md'}
                            `}
                        >
                            <div 
                                onClick={() => toggleHomework(task.id)}
                                className={`
                                    cursor-pointer flex-shrink-0 w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center transition-colors
                                    ${task.isDone ? 'bg-imperial-gold border-imperial-gold' : 'border-gray-300'}
                                `}
                            >
                                {task.isDone && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                            </div>
                            
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleHomework(task.id)}>
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-medium text-base truncate ${task.isDone ? 'line-through text-muted-ink' : 'text-ink-black'}`}>
                                        {task.title}
                                    </h3>
                                    {task.isGlobal && (
                                        <span className="text-[10px] bg-imperial-red/10 text-imperial-red px-1.5 py-0.5 rounded font-bold uppercase ml-2 whitespace-nowrap">Classe</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-ink">
                                    <span className="material-symbols-outlined text-xs">event</span>
                                    <span>Pour le {task.dueDate}</span>
                                </div>
                            </div>

                             {/* Admin Delete */}
                            {user?.role === 'ADMIN' && (
                                <button 
                                    onClick={() => { if(confirm('Supprimer ce devoir ?')) deleteHomework(task.id); }}
                                    className="ml-2 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => { setIsGlobal(false); setIsModalOpen(true); }}
                    className="w-full mt-8 py-3 rounded-lg border-2 border-dashed border-imperial-red/30 text-imperial-red font-medium hover:bg-imperial-red/5 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Ajouter un devoir personnel
                </button>
                
                {user?.role === 'ADMIN' && (
                     <button 
                        onClick={() => { setIsGlobal(true); setIsModalOpen(true); }}
                        className="w-full mt-3 py-3 rounded-lg bg-imperial-red text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-imperial-red/20"
                    >
                        <span className="material-symbols-outlined">campaign</span>
                        Assigner un devoir à la classe
                    </button>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-imperial-red">{isGlobal ? 'Devoir pour la Classe' : 'Devoir Personnel'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-muted-ink mb-1">Titre</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Ex: Exercice p.42" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-ink mb-1">Pour le</label>
                                <input required type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Ex: 12 Oct" />
                            </div>
                            <button type="submit" className="w-full bg-imperial-red text-white font-bold py-3 rounded-xl mt-2">Sauvegarder</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkScreen;