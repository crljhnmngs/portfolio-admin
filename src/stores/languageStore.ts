import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

const LangCodeSchema = z.string().regex(/^[a-z]{2,5}$/);

const STORAGE_KEY = 'portfolio_selected_language';

interface LanguageStore {
    selectedLang: string;
    setSelectedLang: (code: string) => void;
    resetToDefault: (defaultCode: string) => void;
}

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set) => ({
            selectedLang: 'en',
            setSelectedLang: (code) => {
                const parsed = LangCodeSchema.safeParse(code);
                if (parsed.success) {
                    set({ selectedLang: parsed.data });
                } else {
                    console.warn('[languageStore] Invalid lang code:', code);
                }
            },
            resetToDefault: (defaultCode) => set({ selectedLang: defaultCode }),
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({ selectedLang: state.selectedLang }),
            version: 1,
            skipHydration: true,
        }
    )
);
