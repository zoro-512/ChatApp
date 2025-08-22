import { create } from "zustand";


export const useAddUserStore = create((set) => ({
  isOpen: false,
  openBox: () => set({ isOpen: true }),
  closeBox: () => set({ isOpen: false }),
  toggleBox: () => set((state) => ({ isOpen: !state.isOpen })),
}));
