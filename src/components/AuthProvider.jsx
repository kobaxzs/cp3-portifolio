import { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext.js';
import { supabase, verifyOwner } from '../services/supabase.js';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState({ loading: true, owner: false, error: '' });

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Callback síncrono: a verificação de rede acontece no efeito abaixo.
      setAccess({ loading: true, owner: false, error: '' });
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    if (session === undefined) return;
    if (!session) {
      setAccess({ loading: false, owner: false, error: '' });
      return;
    }
    setAccess({ loading: true, owner: false, error: '' });
    verifyOwner()
      .then((owner) => {
        if (active) setAccess({ loading: false, owner, error: '' });
      })
      .catch((error) => {
        if (active) setAccess({ loading: false, owner: false, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [session, attempt]);

  return (
    <AuthContext.Provider value={{ ...access, session, retry: () => setAttempt(attempt + 1) }}>
      {children}
    </AuthContext.Provider>
  );
}
