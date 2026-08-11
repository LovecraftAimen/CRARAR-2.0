
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Download, AlertTriangle, X, CheckCircle2, Save, User, PawPrint, ShieldCheck } from 'lucide-react';
import { Animal, Tutor, Atendimento } from '../types';
import { supabase } from '../integrations/supabase/client';
import GerarPDF from './GerarPDF.tsx';
import { formatCPF, formatPhone, validateCPF, validatePhone } from '../utils/masks';

interface EditModalProps {
  animal: Animal;
  tutor: Tutor;
  atendimentos: Atendimento[];
  onCloseParent?: () => void;
  tutores?: Tutor[];
}

const EditModal: React.FC<EditModalProps> = ({ animal, tutor, atendimentos, onCloseParent, tutores }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estados para Edição
  const [editingType, setEditingType] = useState<'animal' | 'tutor' | null>(null);
  
  // Lista de tutores para seleção
  const [tutoresList, setTutoresList] = useState<Tutor[]>(tutores || []);

  useEffect(() => {
    if (tutores && tutores.length > 0) {
      setTutoresList(tutores);
    } else {
      supabase.from('tutores').select('*').then(({ data }) => {
        if (data) setTutoresList(data);
      });
    }
  }, [tutores]);

  // Estados do formulário de Animal
  const [animalForm, setAnimalForm] = useState({
    nome: animal.nome,
    especie: animal.especie,
    raca: animal.raca,
    sexo: animal.sexo,
    peso: animal.peso,
    data_nascimento: animal.data_nascimento
  });

  // Estados do formulário e seleção de Tutor
  const isCurrentCrarar = tutor.nome.toUpperCase() === 'CRARAR';
  const [uiCategory, setUiCategory] = useState<'normal' | 'crarar'>(isCurrentCrarar ? 'crarar' : 'normal');
  const [selectedTutorId, setSelectedTutorId] = useState<string>(tutor.id);
  const [tutorSearch, setTutorSearch] = useState<string>(tutor.nome);
  const [showTutorList, setShowTutorList] = useState<boolean>(false);

  const [tutorForm, setTutorForm] = useState({
    nome: tutor.nome,
    telefone: tutor.telefone,
    endereco: tutor.endereco || '',
    email: tutor.email || '',
    cpf: tutor.cpf || ''
  });

  useEffect(() => {
    if (editingType === 'tutor') {
      const isCrarar = tutor.nome.toUpperCase() === 'CRARAR';
      setUiCategory(isCrarar ? 'crarar' : 'normal');
      setSelectedTutorId(tutor.id);
      setTutorSearch(tutor.nome);
      setShowTutorList(false);
      setTutorForm({
        nome: tutor.nome,
        telefone: tutor.telefone || '',
        endereco: tutor.endereco || '',
        email: tutor.email || '',
        cpf: tutor.cpf || ''
      });
    }
  }, [editingType, tutor]);

  const handleCategoryChange = (cat: 'normal' | 'crarar') => {
    setUiCategory(cat);
    if (cat === 'crarar') {
      const crararTutor = tutoresList.find(t => t.nome.toUpperCase() === 'CRARAR');
      if (crararTutor) {
        setSelectedTutorId(crararTutor.id);
        setTutorSearch(crararTutor.nome);
        setTutorForm({
          nome: crararTutor.nome,
          telefone: crararTutor.telefone || '',
          endereco: crararTutor.endereco || '',
          email: crararTutor.email || '',
          cpf: crararTutor.cpf || ''
        });
      }
      setShowTutorList(false);
    } else {
      if (selectedTutorId) {
        const found = tutoresList.find(t => t.id === selectedTutorId);
        if (found && found.nome.toUpperCase() === 'CRARAR') {
          setSelectedTutorId('');
          setTutorSearch('');
          setTutorForm({
            nome: '',
            telefone: '',
            endereco: '',
            email: '',
            cpf: ''
          });
        }
      }
    }
  };

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
      let targetTutorId = selectedTutorId;

      if (uiCategory === 'crarar') {
        const crararTutor = tutoresList.find(t => t.nome.toUpperCase() === 'CRARAR');
        if (crararTutor) {
          targetTutorId = crararTutor.id;
        }
      }

      if (!targetTutorId) {
        alert("Por favor, selecione um tutor da lista ou escolha a opção CRARAR.");
        setIsLoading(false);
        return;
      }

      // 1. Atualiza vinculo do tutor no animal caso tenha mudado
      if (targetTutorId !== animal.tutor_id) {
        const targetTutorObj = tutoresList.find(t => t.id === targetTutorId);
        const isTargetCrarar = targetTutorObj?.nome.toUpperCase() === 'CRARAR' || uiCategory === 'crarar';

        const { error: animalErr } = await supabase
          .from('animais')
          .update({ 
            tutor_id: targetTutorId,
            adotado: !isTargetCrarar
          })
          .eq('id', animal.id);

        if (animalErr) throw animalErr;
      }

      // 2. Se for tutor comum, atualiza os dados cadastrais do tutor selecionado
      if (uiCategory === 'normal' && targetTutorId) {
        const cpfVal = validateCPF(tutorForm.cpf);
        if (!cpfVal.valid) {
          alert(cpfVal.message);
          setIsLoading(false);
          return;
        }

        const phoneVal = validatePhone(tutorForm.telefone);
        if (!phoneVal.valid) {
          alert(phoneVal.message);
          setIsLoading(false);
          return;
        }

        const { error: tutorErr } = await supabase
          .from('tutores')
          .update({
            nome: tutorForm.nome.trim(),
            telefone: tutorForm.telefone.trim(),
            cpf: tutorForm.cpf.trim() || null,
            email: tutorForm.email.trim() || null,
            endereco: tutorForm.endereco.trim() || null
          })
          .eq('id', targetTutorId);

        if (tutorErr) throw tutorErr;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEditingType(null);
        if (onCloseParent) onCloseParent();
        window.location.reload();
      }, 1200);
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
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 md:p-8 shadow-2xl animate-slide-up border border-slate-100 max-h-[90vh] overflow-y-auto scrollbar-green">
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
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Editar / Selecionar Tutor</h4>
                      <p className="text-xs font-semibold text-slate-400">Paciente: {animal.nome}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingType(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Seleção do Tipo de Tutor (Comum / CRARAR) */}
                <div className="flex items-center justify-between mb-5 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase ml-2">Tipo de Tutor</span>
                  <div className="flex items-center gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('normal')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        uiCategory === "normal"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Comum
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('crarar')}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        uiCategory === "crarar"
                          ? "bg-crarar-primary text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      CRARAR
                    </button>
                  </div>
                </div>

                <form onSubmit={handleUpdateTutor} className="space-y-4">
                  {/* Busca e Seleção do Tutor */}
                  <div className="relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                      {uiCategory === "crarar" ? "Responsável Institucional *" : "Tutor Responsável *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 z-10" />
                      <input
                        type="text"
                        value={tutorSearch}
                        placeholder="Digite o nome do tutor..."
                        disabled={uiCategory === "crarar"}
                        onFocus={() => {
                          if (uiCategory !== "crarar") {
                            setShowTutorList(true);
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTutorSearch(value);
                          setSelectedTutorId("");
                          setTutorForm(prev => ({ ...prev, nome: value }));
                          setShowTutorList(true);
                        }}
                        className={`w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/10 transition-all ${
                          uiCategory === "crarar" ? "opacity-70 cursor-not-allowed bg-slate-100" : ""
                        }`}
                      />

                      {showTutorList && uiCategory !== "crarar" && (
                        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl divide-y divide-slate-50">
                          {tutoresList
                            .filter((t) => {
                              const search = tutorSearch.toLowerCase().trim();
                              if (!search) return true;
                              return t.nome.toLowerCase().includes(search) || (t.cpf && t.cpf.includes(search)) || (t.telefone && t.telefone.includes(search));
                            })
                            .map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  setSelectedTutorId(t.id);
                                  setTutorSearch(t.nome);
                                  setTutorForm({
                                    nome: t.nome,
                                    telefone: t.telefone || '',
                                    endereco: t.endereco || '',
                                    email: t.email || '',
                                    cpf: t.cpf || ''
                                  });
                                  setShowTutorList(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-crarar-primary/10 hover:text-crarar-primary transition-colors flex flex-col gap-0.5"
                              >
                                <span className="font-bold text-slate-900">{t.nome}</span>
                                {(t.cpf || t.telefone) && (
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    {t.cpf ? `CPF: ${t.cpf}` : ''} {t.cpf && t.telefone ? '• ' : ''} {t.telefone ? `Tel: ${t.telefone}` : ''}
                                  </span>
                                )}
                              </button>
                            ))}

                          {tutoresList.filter((t) => {
                            const search = tutorSearch.toLowerCase().trim();
                            if (!search) return true;
                            return t.nome.toLowerCase().includes(search) || (t.cpf && t.cpf.includes(search)) || (t.telefone && t.telefone.includes(search));
                          }).length === 0 && (
                            <div className="px-4 py-4 text-xs text-slate-400 text-center font-medium">
                              Nenhum tutor encontrado.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {uiCategory === 'normal' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF (Opcional - 11 dígitos)</label>
                          <input maxLength={14} value={tutorForm.cpf} onChange={e => setTutorForm({...tutorForm, cpf: formatCPF(e.target.value)})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono font-bold text-slate-700 outline-none focus:border-crarar-primary" placeholder="000.000.000-00" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                          <input required maxLength={15} value={tutorForm.telefone} onChange={e => setTutorForm({...tutorForm, telefone: formatPhone(e.target.value)})} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono font-bold text-slate-700 outline-none focus:border-crarar-primary" placeholder="(00) 00000-0000" />
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
                  )}

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
