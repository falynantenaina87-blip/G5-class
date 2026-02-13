import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Course } from '../types';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const ScheduleScreen: React.FC = () => {
    const { schedule, user, addCourse, updateCourse, deleteCourse } = useApp();
    const [selectedDay, setSelectedDay] = useState(DAYS[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [editingCourse, setEditingCourse] = useState<Course | null>(null); // If null, adding new. If set, editing.
    const [formSubject, setFormSubject] = useState('');
    const [formRoom, setFormRoom] = useState('');
    const [formStart, setFormStart] = useState('09:00');
    const [formEnd, setFormEnd] = useState('10:00');
    const [formDay, setFormDay] = useState('Lundi');

    const openAddModal = () => {
        setEditingCourse(null);
        setFormSubject(''); setFormRoom(''); setFormStart('09:00'); setFormEnd('10:00'); setFormDay(selectedDay);
        setIsModalOpen(true);
    };

    const openEditModal = (c: Course) => {
        setEditingCourse(c);
        setFormSubject(c.subject); setFormRoom(c.room); setFormStart(c.startTime); setFormEnd(c.endTime); setFormDay(c.day);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            await updateCourse(editingCourse.id, {
                subject: formSubject,
                room: formRoom,
                startTime: formStart,
                endTime: formEnd,
            }); // Note: Usually we don't change the day in edit for simplicity, but could be added
        } else {
            await addCourse({
                subject: formSubject,
                room: formRoom,
                startTime: formStart,
                endTime: formEnd,
                day: formDay
            });
        }
        setIsModalOpen(false);
        if(editingCourse) setEditingCourse(null);
    };

    const handleDelete = async () => {
        if(editingCourse && confirm("Supprimer ce cours ?")) {
            await deleteCourse(editingCourse.id);
            setIsModalOpen(false);
            setEditingCourse(null);
        }
    }

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-rice-paper">
             <header className="sticky top-0 z-20 bg-rice-paper/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                    <h1 className="text-xl font-bold tracking-tight text-ink-black">Emploi du Temps</h1>
                    {user?.role === 'ADMIN' && (
                        <button 
                            onClick={openAddModal}
                            className="text-xs font-bold bg-imperial-red text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-red-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Ajouter
                        </button>
                    )}
                </div>
                
                {/* Horizontal Day Selector */}
                <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar snap-x">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`
                                snap-start flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border
                                ${selectedDay === day 
                                    ? 'bg-imperial-red text-white border-imperial-red shadow-md shadow-imperial-red/20' 
                                    : 'bg-white text-muted-ink border-transparent hover:border-imperial-red/20'}
                            `}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-28">
                <div className="space-y-4">
                    {schedule[selectedDay]?.length > 0 ? (
                        schedule[selectedDay].map((course) => (
                            <div key={course.id} className="flex group relative">
                                {/* Time Column */}
                                <div className="flex flex-col items-end pr-4 w-20 pt-2 space-y-1">
                                    <span className="text-sm font-bold text-ink-black">{course.startTime}</span>
                                    <span className="text-xs text-muted-ink">{course.endTime}</span>
                                    <div className="h-full w-px bg-imperial-gold/30 my-2 relative">
                                        <div className="absolute top-0 -right-[4px] w-2 h-2 rounded-full bg-imperial-gold"></div>
                                    </div>
                                </div>
                                
                                {/* Card */}
                                <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-imperial-red border-y border-r border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-ink-black text-lg mb-1">{course.subject}</h3>
                                    <div className="flex items-center text-muted-ink text-sm gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            <span>{course.room}</span>
                                        </div>
                                    </div>
                                    
                                    {user?.role === 'ADMIN' && (
                                        <button 
                                            onClick={() => openEditModal(course)}
                                            className="absolute top-2 right-2 text-imperial-gold hover:text-imperial-red p-2"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-ink opacity-60">
                            <span className="material-symbols-outlined text-6xl mb-2">weekend</span>
                            <p>Aucun cours prévu</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Add/Edit Course */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-imperial-red">{editingCourse ? 'Modifier le Cours' : 'Ajouter un Cours'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             {!editingCourse && (
                                 <div>
                                    <label className="block text-xs font-bold text-muted-ink mb-1">Jour</label>
                                    <select value={formDay} onChange={e => setFormDay(e.target.value)} className="w-full border rounded-lg p-2 bg-white">
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-muted-ink mb-1">Matière</label>
                                <input required type="text" value={formSubject} onChange={e => setFormSubject(e.target.value)} className="w-full border rounded-lg p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-muted-ink mb-1">Début</label>
                                    <input required type="time" value={formStart} onChange={e => setFormStart(e.target.value)} className="w-full border rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-ink mb-1">Fin</label>
                                    <input required type="time" value={formEnd} onChange={e => setFormEnd(e.target.value)} className="w-full border rounded-lg p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-ink mb-1">Salle</label>
                                <input required type="text" value={formRoom} onChange={e => setFormRoom(e.target.value)} className="w-full border rounded-lg p-2" />
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                                {editingCourse && (
                                    <button type="button" onClick={handleDelete} className="flex-1 bg-gray-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50">Supprimer</button>
                                )}
                                <button type="submit" className="flex-[2] bg-imperial-red text-white font-bold py-3 rounded-xl">Sauvegarder</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleScreen;