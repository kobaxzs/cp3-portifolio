import { createContext, useContext } from 'react';

export const AuthContext = createContext({ loading: true, owner: false, session: null, error: '' });
export function useAuth() {
  return useContext(AuthContext);
}
