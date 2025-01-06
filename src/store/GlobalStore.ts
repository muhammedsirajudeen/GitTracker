// store.ts
import { User } from '@/models/User';
import {create} from 'zustand';

interface BearState {
  user?: User;
}

const useGlobalStore = create<BearState>((set) => ({
    setUser:(user:User)=>set(()=>({user:user}))
}));

export default useGlobalStore;
