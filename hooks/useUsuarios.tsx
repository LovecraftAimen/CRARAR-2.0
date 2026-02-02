
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Usuario } from '../types';

export function useUsuarios() {
  const [currentUsuario, setCurrentUsuario] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loginUsuario = async (email: string, senha: string): Promise<boolean> => {
    try {
      // BYPASS TEMPORÁRIO: Se a senha for 'admin', verifica se o email existe na tabela de usuários
      if (senha === 'admin') {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .eq('ativo', true)
          .single();
        
        if (!error && data) {
          setCurrentUsuario(data);
          localStorage.setItem('usuario_limitado', JSON.stringify(data));
          return true;
        }
        // Se a senha for admin mas não achar o usuário na tabela 'usuarios', 
        // deixamos passar para tentar o login como Admin Geral no hook useAuth
        return false; 
      }

      // Login normal via senha do banco (tabela personalizada)
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .eq('ativo', true)
        .single();
      
      if (error || !data) return false;

      setCurrentUsuario(data);
      localStorage.setItem('usuario_limitado', JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutUsuario = () => {
    setCurrentUsuario(null);
    localStorage.removeItem('usuario_limitado');
  };

  useEffect(() => {
    const saved = localStorage.getItem('usuario_limitado');
    if (saved) {
      try {
        setCurrentUsuario(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('usuario_limitado');
      }
    }
    setLoading(false);
  }, []);

  return { currentUsuario, loginUsuario, logoutUsuario, loading };
}
