
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Tutor, Animal, Atendimento, Produto } from '../types';

export function useSupabaseData() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tData, aData, attData, pData] = await Promise.all([
        supabase.from('tutores').select('*').order('nome'),
        supabase.from('animais').select('*').order('nome'),
        supabase.from('atendimentos').select('*').order('data', { ascending: false }),
        supabase.from('produtos').select('*').order('nome')
      ]);
      
      setTutores(tData.data || []);
      setAnimais(aData.data || []);
      setAtendimentos(attData.data || []);
      setProdutos(pData.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveTutor = async (tutor: Omit<Tutor, 'id'>) => {
    const { data, error } = await supabase.from('tutores').insert(tutor).select().single();
    if (error) throw error;
    setTutores(p => [...p, data]);
    return data.id;
  };

  const saveAnimal = async (animal: Omit<Animal, 'id' | 'data_adesao'>) => {
    const { data, error } = await supabase.from('animais').insert(animal).select().single();
    if (error) throw error;
    setAnimais(p => [...p, data]);
    return data.id;
  };

  const saveAtendimento = async (att: Omit<Atendimento, 'id'>) => {
    const { data, error } = await supabase.from('atendimentos').insert(att).select().single();
    if (error) throw error;
    setAtendimentos(p => [data, ...p]);
    return data.id;
  };

  // LÓGICA DE INVENTÁRIO (PRODUTOS)
  const saveProduto = async (produto: Omit<Produto, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('produtos').insert(produto).select().single();
    if (error) throw error;
    setProdutos(p => [...p, data]);
    return data.id;
  };

  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    // Removemos campos que não devem ser atualizados manualmente se necessário
    const { id: _, created_at: __, ...updateData } = produto as any;
    
    const { data, error } = await supabase
      .from('produtos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    setProdutos(p => p.map(item => item.id === id ? data : item));
    return data.id;
  };

  const deleteProduto = async (id: string) => {
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) throw error;
    setProdutos(p => p.filter(item => item.id !== id));
  };

  return { 
    tutores, 
    animais, 
    atendimentos, 
    produtos, 
    loading, 
    saveTutor, 
    saveAnimal, 
    saveAtendimento, 
    saveProduto, 
    updateProduto,
    deleteProduto, 
    reloadData: loadData 
  };
}
