
import React, { useState } from 'react';
import { Edit, Trash2, Download, AlertTriangle, X, CheckCircle2, Save, User, PawPrint } from 'lucide-react';
import { Animal, Tutor, Atendimento } from '../types';
import { supabase } from '../integrations/supabase/client';
import GerarPDF from './GerarPDF.tsx';

interface EditModalProps {
  animal: Animal;
  tutor: Tutor;
  atendimentos: Atendimento[];
  onCloseParent?: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ animal, tutor, atendimentos, onCloseParent }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estados para Edição
  const [editingType, setEditingType] = useState<'animal' | 'tutor' | null>(null);
  
  // Estado do formulário de Animal
  const [animalForm, setAnimalForm] = useState({
    nome: animal.nome,
    especie: animal.especie,
    raca: animal.raca,
    sexo: animal.sexo,
    peso: animal.peso,
    data_nascimento: animal.data_nascimento
  });

  // Estado do formulário de Tutor
  const [tutorForm, setTutorForm] = useState({
    nome: tutor.nome,
    telefone: tutor.telefone,
    endereco: tutor.endereco || '',
    email: tutor.email || '',
    cpf: tutor.cpf || ''
  });

  const handleUpdateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('animais')
        .update({
          nome: animalForm.nome,
          especie: animalForm.especie,
          raca: animalForm.raca,
          sexo: animalForm.sexo,
          peso: Number(animalForm.peso),
          data_nascimento: animalForm.data_nascimento
        })
        .eq('id', animal.id);

      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEditingType(null);
        // Em vez de reload total, avisamos o usuário que os dados foram persistidos
        // O ideal seria um context update, mas para evitar o "bug" de reset de rota,
        // apenas fechamos a edição e mantemos o modal pai.
      }, 1500);
    } catch (err: any) {
      alert("Erro ao atualizar animal: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tutores')
        .update({
          nome: tutorForm.nome,
          telefone: tutorForm.telefone,
          endereco: tutorForm.endereco,
          email: tutorForm.email,
          cpf: tutorForm.cpf
        })
        .eq('id', tutor.id);

      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEditingType(null);
      }, 1500);
    } catch (err: any) {
      alert("Erro ao atualizar tutor: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnimal = async () => {
    setIsDeleting(true);
    try {
      // Exclui atendimentos primeiro por causa da integridade referencial
      await supabase.from('atendimentos').delete().eq('animal_id', animal.id);
      const { error } = await supabase.from('animais').delete().eq('id', animal.id);
      if (error) throw error;
      
      alert(`O paciente ${animal.nome} foi removido com sucesso.`);
      if (onCloseParent) onCloseParent();
      window.location.reload(); // Para deleção o reload é aceitável pois o recurso sumiu
    } catch (error: any) {
      alert("Erro ao excluir: " + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-slate-100">
      <div className="flex flex-wrap gap-2">
        <GerarPDF animal={animal} tutor={tutor} atendimentos={atendimentos} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setEditingType('animal')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:border-crarar-primary hover:text-crarar-primary transition-all shadow-sm"
        >
          <Edit className="h-4 w-4" />
          Editar Animal
        </button>

        <button 
          onClick={() => setEditingType('tutor')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:border-crarar-primary hover:text-crarar-primary transition-all shadow-sm"
        >
          <Edit className="h-4 w-4" />
          Editar Tutor
        </button>

        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-all shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
          Excluir Registro
        </button>
      </div>

      {/* Modal de Edição de Animal */}
      {editingType === 'animal' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl animate-slide-up border border-slate-100">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Atualizado!</h4>
                <p className="text-sm text-slate-500">Dados do animal salvos com sucesso.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-crarar-primary/10 rounded-xl text-crarar-primary">
                      <PawPrint className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Editar Animal</h4>
                  </div>
                  <button onClick={() => setEditingType(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdateAnimal} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome</label>
                      <input required value={animalForm.nome} onChange={e => setAnimalForm({...animalForm, nome: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Espécie</label>
                      <input required value={animalForm.especie} onChange={e => setAnimalForm({...animalForm, especie: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Raça</label>
                      <input required value={animalForm.raca} onChange={e => setAnimalForm({...animalForm, raca: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (kg)</label>
                      <input type="number" step="0.01" required value={animalForm.peso} onChange={e => setAnimalForm({...animalForm, peso: parseFloat(e.target.value)})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nascimento</label>
                      <input type="date" required value={animalForm.data_nascimento} onChange={e => setAnimalForm({...animalForm, data_nascimento: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                  </div>
                  <button disabled={isLoading} type="submit" className="w-full py-4 mt-4 bg-crarar-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-crarar-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                    {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edição de Tutor */}
      {editingType === 'tutor' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl animate-slide-up border border-slate-100">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Atualizado!</h4>
                <p className="text-sm text-slate-500">Dados do tutor salvos com sucesso.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-crarar-primary/10 rounded-xl text-crarar-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Editar Tutor</h4>
                  </div>
                  <button onClick={() => setEditingType(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdateTutor} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Tutor</label>
                      <input required value={tutorForm.nome} onChange={e => setTutorForm({...tutorForm, nome: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                        <input value={tutorForm.cpf} onChange={e => setTutorForm({...tutorForm, cpf: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" placeholder="000.000.000-00" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                        <input required value={tutorForm.telefone} onChange={e => setTutorForm({...tutorForm, telefone: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" placeholder="(00) 00000-0000" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                      <input type="email" value={tutorForm.email} onChange={e => setTutorForm({...tutorForm, email: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                      <input value={tutorForm.endereco} onChange={e => setTutorForm({...tutorForm, endereco: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 outline-none focus:border-crarar-primary" />
                    </div>
                  </div>
                  <button disabled={isLoading} type="submit" className="w-full py-4 mt-4 bg-crarar-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-crarar-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                    {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-md rounded-[32px] bg-white p-8 shadow-2xl animate-slide-up border border-slate-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2 text-center">⚠️ Confirmar Exclusão</h4>
            <p className="text-sm font-medium text-slate-500 mb-6 text-center leading-relaxed">
              Você tem certeza que deseja excluir <strong>{animal.nome}</strong>?<br/><br/>
              <span className="text-red-600 font-bold">Atenção:</span> Esta ação irá remover também todos os atendimentos relacionados a este animal e não pode ser desfeita.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteAnimal}
                disabled={isDeleting}
                className="flex-1 py-4 rounded-2xl font-bold text-sm bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModal;
