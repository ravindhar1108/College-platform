import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  saved: number[];
  compare: number[];
  toggleSaved: (id: number) => void;
  toggleCompare: (id: number) => void;
  removeCompare: (id: number) => void;
  clearCompare: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      saved: [],
      compare: [],
      toggleSaved: (id) =>
        set({
          saved: get().saved.includes(id)
            ? get().saved.filter((s) => s !== id)
            : [...get().saved, id],
        }),
      toggleCompare: (id) => {
        const c = get().compare;
        if (c.includes(id)) return set({ compare: c.filter((s) => s !== id) });
        if (c.length >= 3) return;
        set({ compare: [...c, id] });
      },
      removeCompare: (id) => set({ compare: get().compare.filter((s) => s !== id) }),
      clearCompare: () => set({ compare: [] }),
    }),
    { name: "edufind-store" }
  )
);
