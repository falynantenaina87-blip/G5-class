import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const AnnouncementsScreen: React.FC = () => {
    const { announcements, user, addAnnouncement, deleteAnnouncement } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('INFO');
    const [desc, setDesc] = useState('');
    const [imgUrl, setImgUrl] = useState('https://source.unsplash.com/random/800x600/?chinese');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAnnouncement({
            title,
            tag,
            description: desc,
            imageUrl: imgUrl,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        });
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setDesc('');
    };

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative">
            <header className="sticky top-0 z-20 bg-rice-paper/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-imperial-gold/20">
                <h1 className="text-xl font-bold tracking-tight text-ink-black">Annonces</h1>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-ink-black transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
                {announcements.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-ink">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">newspaper</span>
                        <p>Aucune annonce publiée.</p>
                    </div>
                )}
                
                {announcements.map((item) => (
                    <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-imperial-red/5 hover:shadow-md transition-shadow duration-300 relative group">
                        <div className="relative aspect-video w-full overflow-hidden">
                             <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                             />
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-imperial-red text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-imperial-red/10">
                                {item.tag}
                             </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <h2 className="text-lg font-bold text-ink-black leading-tight">{item.title}</h2>
                                <span className="text-xs font-medium text-muted-ink whitespace-nowrap bg-rice-paper px-2 py-1 rounded">{item.date}</span>
                            </div>
                            <p className="text-muted-ink text-sm leading-relaxed line-clamp-3">
                                {item.description}
                            </p>
                        </div>
                        
                        {/* Admin Delete Button */}
                        {user?.role === 'ADMIN' && (
                            <button 
                                onClick={() => { if(confirm('Supprimer cette annonce ?')) deleteAnnouncement(item.id); }}
                                className="absolute top-4 left-4 w-8 h-8 bg-white/90 text-red-600 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        )}
                    </article>
                ))}
            </main>

            {/* Admin FAB */}
            {user?.role === 'ADMIN' && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="fixed right-6 bottom-24 w-14 h-14 bg-imperial-red text-white rounded-full shadow-lg shadow-imperial-red/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            )}

            {/* Modal Creation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-rice-paper">
                            <h3 className="font-bold text-lg text-imperial-red">Nouvelle Annonce</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-ink hover:text-ink-black">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-muted-ink uppercase mb-1">Titre</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-imperial-red focus:ring-1 focus:ring-imperial-red transition-all" placeholder="Ex: Fête de la Lune" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted-ink uppercase mb-1">Type</label>
                                    <select value={tag} onChange={e => setTag(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                                        <option value="INFO">Information</option>
                                        <option value="ÉVÉNEMENT">Événement</option>
                                        <option value="COURS">Cours</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-ink uppercase mb-1">Image URL</label>
                                    <input type="text" value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" placeholder="https://..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-ink uppercase mb-1">Description</label>
                                <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-imperial-red" placeholder="Détails de l'annonce..." />
                            </div>
                            <button type="submit" className="w-full bg-imperial-red text-white font-bold py-4 rounded-xl shadow-lg shadow-imperial-red/20 hover:bg-red-700 transition-colors">
                                Publier l'annonce
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsScreen;