import { User } from '@/models/User';
import { create } from 'zustand';

interface GlobalState {
  user: User | null;
  setUser: (user: User) => void;
}

const useGlobalStore = create<GlobalState>()((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));

export default useGlobalStore;
