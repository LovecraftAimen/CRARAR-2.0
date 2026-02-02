
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

interface AuthContextType {
  session: any | null;
  user: any | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica primeiro se há uma sessão mock de admin salva
    const mockSession = localStorage.getItem('crarar_admin_session');
    if (mockSession) {
      setSession(JSON.parse(mockSession));
      setLoading(false);
      return;
    }

    // Caso contrário, usa a sessão real do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Só atualiza se não estivermos em modo mock
      if (!localStorage.getItem('crarar_admin_session')) {
        setSession(session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // BYPASS TEMPORÁRIO: Se a senha for 'admin', cria sessão mock
    if (password === 'admin') {
      const mockAdminSession = {
        user: { 
          id: 'mock-admin-id', 
          email: email, 
          user_metadata: { role: 'admin' } 
        },
        access_token: 'mock-token-admin'
      };
      localStorage.setItem('crarar_admin_session', JSON.stringify(mockAdminSession));
      setSession(mockAdminSession);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    localStorage.removeItem('crarar_admin_session');
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile: null, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
