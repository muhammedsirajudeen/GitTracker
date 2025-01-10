import { User } from '@/models/User';
import { create } from 'zustand';

interface GlobalState {
  user: User | null;
  setUser: (user: User) => void;
  endpoint:string;
  setEndpoint:(endpoint:string)=>void;
}

const useGlobalStore = create<GlobalState>()((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  endpoint:'',
  setEndpoint:(endpoint:string)=>set({endpoint})
}));

export default useGlobalStore;
