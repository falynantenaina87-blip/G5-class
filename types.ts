export type Role = 'ADMIN' | 'STUDENT';

export interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: Role;
}

export interface Announcement {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tag: string;
    date: string;
    created_at?: string;
}

export interface FlashcardData {
    id: string;
    character: string;
    pinyin: string;
    translation: string;
    example: string;
    exampleTranslation: string;
    dateAdded: string;
    created_at?: string;
}

export interface Course {
    id: string;
    startTime: string;
    endTime: string;
    subject: string;
    room: string;
    day: string;
    created_at?: string;
}

export interface Homework {
    id: string;
    title: string;
    dueDate: string;
    isGlobal: boolean;
    created_at?: string;
    // Local state only
    isDone?: boolean;
}

export type Tab = 'announcements' | 'flashcard' | 'schedule' | 'homework' | 'profile';