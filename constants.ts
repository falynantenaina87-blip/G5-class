import { Announcement, FlashcardData, Course, Homework } from "./types";

// Les données sont maintenant gérées exclusivement via Supabase et AppContext.
export const ANNOUNCEMENTS: Announcement[] = [];
export const FLASHCARDS: FlashcardData[] = [];
export const WEEK_SCHEDULE: Record<string, Course[]> = {};
export const INITIAL_HOMEWORK: Homework[] = [];