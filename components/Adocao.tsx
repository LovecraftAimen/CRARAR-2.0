import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ShieldCheck, 
  Phone, 
  FileText, 
  X, 
  ArrowRight, 
  Filter,
  Calendar,
  Weight,
  UserCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Animal, Tutor } from '../types';

interface AdocaoProps {
  animais: Animal[];
  tutores: Tutor[];
  onUpdateAnimal: (id: string, data: Partial<Animal>) => Promise<any>;
}

export const Adocao: React.FC<AdocaoProps> = ({ animais, tutores, onUpdateAnimal }) => {
  // Navigation inside this single component
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  // List View State
  const [searchQuery, setSearchQuery] = useState('');

  // Adoption Form Page State
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [animalSearchText, setAnimalSearchText] = useState('');
  const [showAnimalDropdown, setShowAnimalDropdown] = useState(false);

  // Toggle origin for animal selection in adoption form: 'geral' (fora CRARAR) vs 'crarar'
  const [animalSource, setAnimalSource] = useState<'geral' | 'crarar'>('crarar');

  // Pagination / Load More State (21 items per batch)
  const ITEMS_PER_PAGE = 21;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [tutorSearchText, setTutorSearchText] = useState('');
  const [showTutorDropdown, setShowTutorDropdown] = useState(false);

  // References for click-outside detection
  const animalDropdownRef = useRef<HTMLDivElement>(null);
  const tutorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (animalDropdownRef.current && !animalDropdownRef.current.contains(event.target as Node)) {
        setShowAnimalDropdown(false);
      }
      if (tutorDropdownRef.current && !tutorDropdownRef.current.contains(event.target as Node)) {
        setShowTutorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const [observacoes, setObservacoes] = useState('');
  const [termoAceite, setTermoAceite] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification Banner State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Helper map for Tutor lookup
  const tutorMap = useMemo(() => {
    const map = new Map<string, Tutor>();
    tutores.forEach(t => map.set(t.id, t));
    return map;
  }, [tutores]);

  // Identify CRARAR tutor if exists
  const crararTutor = useMemo(() => {
    return tutores.find(t => t.nome.toUpperCase() === 'CRARAR');
  }, [tutores]);

  // Filtered Animals for Main List - ONLY animals belonging to CRARAR
  const filteredAnimais = useMemo(() => {
    return animais.filter(animal => {
      const currentTutor = tutorMap.get(animal.tutor_id);
      const isCrarar = currentTutor?.nome.toUpperCase() === 'CRARAR' || !animal.tutor_id;
      if (!isCrarar) return false;

      // Text search match within CRARAR animals
      const query = searchQuery.toLowerCase().trim();
      return !query || 
        animal.nome.toLowerCase().includes(query) ||
        animal.raca.toLowerCase().includes(query) ||
        animal.especie.toLowerCase().includes(query);
    });
  }, [animais, searchQuery, tutorMap]);

  // Paginated/Sliced list of 21 animals per batch
  const displayedAnimais = useMemo(() => {
    return filteredAnimais.slice(0, visibleCount);
  }, [filteredAnimais, visibleCount]);

  // Quick stats calculations for CRARAR pets
  const stats = useMemo(() => {
    const crararPets = animais.filter(a => {
      const t = tutorMap.get(a.tutor_id);
      return t?.nome.toUpperCase() === 'CRARAR' || !a.tutor_id;
    });
    const total = crararPets.length;
    const caes = crararPets.filter(a => a.especie === 'Cão').length;
    const gatos = crararPets.filter(a => a.especie === 'Gato').length;

    return { total, caes, gatos };
  }, [animais, tutorMap]);

  // Open Form with clean state
  const handleOpenForm = (animalId?: string) => {
    setFeedback(null);
    setObservacoes('');
    
    if (animalId) {
      setSelectedAnimalId(animalId);
      const pet = animais.find(a => a.id === animalId);
      if (pet) {
        setAnimalSearchText(pet.nome);
        const t = tutorMap.get(pet.tutor_id);
        const isCrarar = t?.nome.toUpperCase() === 'CRARAR' || !pet.tutor_id;
        setAnimalSource(isCrarar ? 'crarar' : 'geral');
      }
    } else {
      setSelectedAnimalId('');
      setAnimalSearchText('');
      setAnimalSource('crarar');
    }

    setSelectedTutorId('');
    setTutorSearchText('');
    setShowAnimalDropdown(false);
    setShowTutorDropdown(false);
    setViewMode('form');
  };

  // Cancel or Go back to List
  const handleBackToList = () => {
    setViewMode('list');
    setFeedback(null);
  };

  // Current Selected Pet Object
  const selectedAnimal = useMemo(() => {
    return animais.find(a => a.id === selectedAnimalId);
  }, [animais, selectedAnimalId]);

  // Current Selected Pet's Current Tutor Object
  const currentTutorOfSelectedAnimal = useMemo(() => {
    if (!selectedAnimal) return null;
    return tutorMap.get(selectedAnimal.tutor_id) || null;
  }, [selectedAnimal, tutorMap]);

  // Display Name for "De (Tutor Atual)"
  const displayCurrentTutorName = useMemo(() => {
    if (selectedAnimal) {
      if (currentTutorOfSelectedAnimal) {
        return currentTutorOfSelectedAnimal.nome;
      }
      return animalSource === 'crarar' ? 'CRARAR' : 'Sem Tutor';
    }
    return animalSource === 'crarar' ? 'CRARAR' : 'A selecionar';
  }, [selectedAnimal, currentTutorOfSelectedAnimal, animalSource]);

  // Selected Target (New) Tutor Object
  const selectedNewTutor = useMemo(() => {
    return tutores.find(t => t.id === selectedTutorId);
  }, [tutores, selectedTutorId]);

  // Filter available tutors for selection (exclude current tutor if already assigned)
  const availableTutorsForSelection = useMemo(() => {
    const query = tutorSearchText.toLowerCase().trim();
    return tutores.filter(t => {
      // Don't list the current tutor as the new tutor choice
      if (selectedAnimal && t.id === selectedAnimal.tutor_id) return false;
      if (!query) return true;
      return t.nome.toLowerCase().includes(query) ||
             (t.cpf && t.cpf.includes(query)) ||
             (t.telefone && t.telefone.includes(query));
    });
  }, [tutores, tutorSearchText, selectedAnimal]);

  // Filter available animals for adoption form search based on toggle selection ('geral' = fuera CRARAR, 'crarar' = do CRARAR)
  const availableAnimalsForSelection = useMemo(() => {
    const query = animalSearchText.toLowerCase().trim();
    return animais.filter(a => {
      const t = tutorMap.get(a.tutor_id);
      const isCrarar = t?.nome.toUpperCase() === 'CRARAR' || !a.tutor_id;
      
      // Filter based on selected origin toggle
      if (animalSource === 'crarar' && !isCrarar) return false;
      if (animalSource === 'geral' && isCrarar) return false;

      if (!query) return true;
      return a.nome.toLowerCase().includes(query) ||
             a.raca.toLowerCase().includes(query) ||
             a.especie.toLowerCase().includes(query) ||
             (t?.nome && t.nome.toLowerCase().includes(query));
    });
  }, [animais, animalSearchText, tutorMap, animalSource]);

  // Handle Transfer / Adoption submission
  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAnimalId) {
      setFeedback({ type: 'error', message: 'Por favor, selecione um animal cadastrado.' });
      return;
    }

    if (!selectedTutorId) {
      setFeedback({ type: 'error', message: 'Por favor, selecione o novo tutor para o animal.' });
      return;
    }

    if (selectedAnimal && selectedAnimal.tutor_id === selectedTutorId) {
      setFeedback({ type: 'error', message: 'O animal já pertence a este tutor.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const isNewTutorCrarar = selectedNewTutor?.nome.toUpperCase() === 'CRARAR';

    try {
      await onUpdateAnimal(selectedAnimalId, {
        tutor_id: selectedTutorId,
        adotado: !isNewTutorCrarar
      });

      const successMsg = isNewTutorCrarar
        ? `${selectedAnimal?.nome} transferido para o CRARAR com sucesso! (Status de adotado removido).`
        : `Adoção/Transferência concluída com sucesso! ${selectedAnimal?.nome} agora pertence a ${selectedNewTutor?.nome}.`;

      // Show success feedback
      setFeedback({
        type: 'success',
        message: successMsg
      });

      // After 1.5s, return to list mode
      setTimeout(() => {
        setViewMode('list');
        setFeedback({
          type: 'success',
          message: successMsg
        });
      }, 1500);

    } catch (err: any) {
      console.error('Erro na adoção:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Ocorreu um erro ao processar a transferência. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* GLOBAL FEEDBACK NOTIFICATION */}
      {feedback && (
        <div 
          className={`flex items-center justify-between p-4 md:p-5 rounded-2xl shadow-md border animate-fade-in ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <p className="text-sm font-bold">{feedback.message}</p>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: LISTA DE ANIMAIS & ADOÇÕES
         ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-700 via-crarar-primary to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
                Módulo de Adoção e Guarda Responsável
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Animais & Transferência de Tutoria
              </h2>
              <p className="text-xs md:text-sm text-emerald-100/90 font-medium">
                Gerencie todos os animais cadastrados, localize pets disponíveis para adoção (CRARAR) e realize a transferência formal de guarda entre tutores.
              </p>
            </div>

            <button
              onClick={() => handleOpenForm()}
              className="relative z-10 flex items-center justify-center gap-2.5 bg-white text-emerald-900 font-extrabold px-6 py-4 rounded-2xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all text-sm shrink-0 w-full md:w-auto"
            >
              <Plus className="h-5 w-5 text-emerald-700" />
              <span>Nova Adoção / Transferência</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-[120px] flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 leading-tight">Pets Para Adoção (CRARAR)</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-[120px] flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 leading-tight">Cães para Adoção</p>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{stats.caes}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <FileText className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-[120px] flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 leading-tight">Gatos para Adoção</p>
                <p className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">{stats.gatos}</p>
              </div>
            </div>
          </div>

          {/* Search Control Only (No owner category or species filters) */}
          <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                placeholder="Buscar pet do CRARAR por nome, raça ou espécie..."
                className="w-full pl-12 pr-10 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Animals Grid Cards */}
          {filteredAnimais.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedAnimais.map((animal) => {
                  const currentTutor = tutorMap.get(animal.tutor_id);
                  const isCrarar = currentTutor?.nome.toUpperCase() === 'CRARAR';

                  return (
                    <div 
                      key={animal.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Top Pet Card Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm uppercase ${
                              animal.especie === 'Cão' 
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : animal.especie === 'Gato'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}>
                              {animal.nome.substring(0, 2)}
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-crarar-primary transition-colors">
                                {animal.nome}
                              </h3>
                              <p className="text-xs font-bold text-slate-400">
                                {animal.especie} • {animal.raca || 'S/R'}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                            isCrarar
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          }`}>
                            {isCrarar ? 'Para Adoção' : 'Com Tutor'}
                          </span>
                        </div>

                        {/* Pet Details Chips */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <span className="font-bold text-slate-400">Sexo:</span>
                            <span className="font-semibold">{animal.sexo || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Weight className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-semibold">{animal.peso ? `${animal.peso} kg` : 'N/I'}</span>
                          </div>
                          {animal.data_nascimento && (
                            <div className="col-span-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>Nasc: {new Date(animal.data_nascimento).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>

                        {/* Current Tutor Info Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-400" />
                            Tutor Atual
                          </p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {currentTutor ? currentTutor.nome : 'Nenhum tutor vinculado'}
                          </p>
                          {currentTutor && (
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                              {currentTutor.cpf && <span>CPF: {currentTutor.cpf}</span>}
                              {currentTutor.telefone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {currentTutor.telefone}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleOpenForm(animal.id)}
                          className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm ${
                            isCrarar
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                              : 'bg-crarar-primary hover:bg-crarar-primary/90 text-white shadow-crarar-primary/20'
                          }`}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>{isCrarar ? 'Adotar este Animal' : 'Transferir Tutoria'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More / Pagination Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  Exibindo <span className="text-slate-900 dark:text-white font-extrabold">{displayedAnimais.length}</span> de <span className="text-slate-900 dark:text-white font-extrabold">{filteredAnimais.length}</span> animais
                </div>

                {filteredAnimais.length > visibleCount && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                      className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-crarar-primary hover:bg-crarar-primary/90 active:scale-95 text-white font-black text-xs shadow-md shadow-crarar-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Carregar Mais (+21)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisibleCount(filteredAnimais.length)}
                      className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors whitespace-nowrap"
                    >
                      Ver Todos ({filteredAnimais.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty Search Results State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="h-10 w-10" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Nenhum animal encontrado</h3>
                <p className="text-xs text-slate-400">
                  Não foi possível localizar nenhum animal com os filtros aplicados. Tente buscar por outros termos.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSpeciesFilter('Todos');
                  setOwnerFilter('Todos');
                }}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Limpar Filtros de Busca
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SUB-PÁGINA DE NOVA ADOÇÃO / TRANSFERÊNCIA (NÃO É MODAL)
         ========================================================================= */}
      {viewMode === 'form' && (
        <div className="space-y-6 animate-slide-up">
          {/* Top Page Header Bar with Back Button */}
          <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <button
              onClick={handleBackToList}
              className="absolute top-6 left-6 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
              title="Voltar para a lista de adoção"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center pt-10 sm:pt-0 sm:px-12">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Nova Adoção & Transferência
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Selecione o animal e o novo tutor para efetuar o vínculo no sistema
              </p>
            </div>
          </div>

          {/* Form Main Body */}
          <form onSubmit={handleSubmitTransfer} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Selections */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: Selecionar Animal */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="text-xs font-black uppercase tracking-wider text-crarar-primary flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-crarar-primary/10 text-crarar-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>{animalSource === 'crarar' ? 'Selecione o Animal do CRARAR *' : 'Selecione o Animal Geral (Fora CRARAR) *'}</span>
                  </label>

                  {/* Toggle Switch: Left = Fora CRARAR (Geral), Right = Do CRARAR */}
                  <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-bold select-none self-start sm:self-auto shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        if (animalSource !== 'geral') {
                          setAnimalSource('geral');
                          setSelectedAnimalId('');
                          setAnimalSearchText('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        animalSource === 'geral'
                          ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${animalSource === 'geral' ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'}`} />
                      <span>Fora do CRARAR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (animalSource !== 'crarar') {
                          setAnimalSource('crarar');
                          setSelectedAnimalId('');
                          setAnimalSearchText('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        animalSource === 'crarar'
                          ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${animalSource === 'crarar' ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'}`} />
                      <span>Do CRARAR</span>
                    </button>
                  </div>
                </div>

                <div className="relative" ref={animalDropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <input
                      type="text"
                      value={animalSearchText}
                      placeholder={animalSource === 'crarar' ? "Pesquise o animal do CRARAR pelo nome..." : "Pesquise o animal (fora CRARAR) por nome, raça ou tutor..."}
                      onFocus={() => setShowAnimalDropdown(true)}
                      onChange={(e) => {
                        setAnimalSearchText(e.target.value);
                        setSelectedAnimalId('');
                        setShowAnimalDropdown(true);
                      }}
                      className="w-full pl-12 pr-10 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all"
                    />
                    {animalSearchText && (
                      <button
                        type="button"
                        onClick={() => {
                          setAnimalSearchText('');
                          setSelectedAnimalId('');
                          setShowAnimalDropdown(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Animal Dropdown Suggestions */}
                  {showAnimalDropdown && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl divide-y divide-slate-100 dark:divide-slate-800">
                      {availableAnimalsForSelection.length > 0 ? (
                        availableAnimalsForSelection.map((animal) => {
                          const t = tutorMap.get(animal.tutor_id);
                          const isCrarar = t?.nome.toUpperCase() === 'CRARAR' || !animal.tutor_id;

                          return (
                            <button
                              key={animal.id}
                              type="button"
                              onClick={() => {
                                setSelectedAnimalId(animal.id);
                                setAnimalSearchText(animal.nome);
                                setShowAnimalDropdown(false);
                              }}
                              className={`w-full p-3.5 text-left transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                selectedAnimalId === animal.id ? 'bg-crarar-primary/10 dark:bg-crarar-primary/20' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0 ${
                                  isCrarar
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                }`}>
                                  {animal.nome.substring(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">{animal.nome}</p>
                                  <p className="text-xs text-slate-400 font-medium">
                                    {animal.especie} • {animal.raca || 'S/R'} {t?.nome && !isCrarar ? `• Tutor: ${t.nome}` : ''}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  isCrarar 
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                  {isCrarar ? 'CRARAR' : 'Fora CRARAR'}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 font-medium">
                          {animalSource === 'crarar' 
                            ? 'Nenhum animal do CRARAR encontrado.' 
                            : 'Nenhum animal fora do CRARAR encontrado.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Animal Preview Card */}
                {selectedAnimal && (
                  <div className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${
                    currentTutorOfSelectedAnimal?.nome.toUpperCase() === 'CRARAR' || !selectedAnimal.tutor_id
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl text-white flex items-center justify-center font-black text-sm uppercase ${
                          currentTutorOfSelectedAnimal?.nome.toUpperCase() === 'CRARAR' || !selectedAnimal.tutor_id
                            ? 'bg-emerald-600'
                            : 'bg-blue-600'
                        }`}>
                          {selectedAnimal.nome.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {selectedAnimal.nome}
                          </h4>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {selectedAnimal.especie} • {selectedAnimal.raca || 'Sem raça definida'} • {selectedAnimal.sexo || 'N/I'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span><strong className="text-slate-500">Tutor Atual:</strong> {displayCurrentTutorName}</span>
                      {selectedAnimal.peso && <span><strong className="text-slate-500">Peso:</strong> {selectedAnimal.peso} kg</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: Selecionar Novo Tutor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-crarar-primary flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-crarar-primary/10 text-crarar-primary flex items-center justify-center text-xs font-bold">2</span>
                    Selecione o Novo Tutor Responsável *
                  </label>
                  {selectedNewTutor && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Selecionado
                    </span>
                  )}
                </div>

                <div className="relative" ref={tutorDropdownRef}>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <input
                      type="text"
                      value={tutorSearchText}
                      placeholder="Pesquise o novo tutor por nome, CPF ou telefone..."
                      onFocus={() => setShowTutorDropdown(true)}
                      onChange={(e) => {
                        setTutorSearchText(e.target.value);
                        setSelectedTutorId('');
                        setShowTutorDropdown(true);
                      }}
                      className="w-full pl-12 pr-10 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all"
                    />
                    {tutorSearchText && (
                      <button
                        type="button"
                        onClick={() => {
                          setTutorSearchText('');
                          setSelectedTutorId('');
                          setShowTutorDropdown(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Tutor Dropdown Suggestions */}
                  {showTutorDropdown && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl divide-y divide-slate-100 dark:divide-slate-800">
                      {availableTutorsForSelection.length > 0 ? (
                        availableTutorsForSelection.map((tutor) => (
                          <button
                            key={tutor.id}
                            type="button"
                            onClick={() => {
                              setSelectedTutorId(tutor.id);
                              setTutorSearchText(tutor.nome);
                              setShowTutorDropdown(false);
                            }}
                            className={`w-full p-3.5 text-left transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              selectedTutorId === tutor.id ? 'bg-crarar-primary/10 dark:bg-crarar-primary/20' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{tutor.nome}</p>
                                <p className="text-xs text-slate-400 font-medium">
                                  {tutor.cpf ? `CPF: ${tutor.cpf}` : 'Sem CPF'} {tutor.telefone ? `• Tel: ${tutor.telefone}` : ''}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 font-medium">
                          Nenhum tutor encontrado. Certifique-se de que o tutor está cadastrado previamente.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Tutor Preview Card */}
                {selectedNewTutor && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {selectedNewTutor.nome}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {selectedNewTutor.cpf ? `CPF: ${selectedNewTutor.cpf}` : 'Sem CPF'} • Tel: {selectedNewTutor.telefone || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {selectedNewTutor.endereco && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-blue-200/60 dark:border-blue-800/60">
                        <strong>Endereço:</strong> {selectedNewTutor.endereco}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: Observações / Termo de Adoção */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <label className="text-xs font-black uppercase tracking-wider text-crarar-primary flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-crarar-primary/10 text-crarar-primary flex items-center justify-center text-xs font-bold">3</span>
                  Observações do Termo de Adoção (Opcional)
                </label>

                <textarea
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Adoção responsável com orientações de vacinação, vermifugação e castração..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all"
                />

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={termoAceite}
                    onChange={(e) => setTermoAceite(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-crarar-primary focus:ring-crarar-primary"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Declaro que a transferência de guarda do animal foi informada e autorizada pelas partes conforme as normas de bem-estar animal.
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column: Confirmation Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 sticky top-24">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  <FileText className="h-5 w-5 text-crarar-primary" />
                  <h3 className="text-lg font-black">Resumo da Transferência</h3>
                </div>

                {/* Flow Diagram */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  {/* Animal Selected */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 uppercase">Pet Selecionado:</span>
                    <span className="font-black text-slate-800 dark:text-white">
                      {selectedAnimal ? selectedAnimal.nome : 'Nenhum'}
                    </span>
                  </div>

                  {/* Transfer Visual Arrow */}
                  <div className="flex items-center justify-between gap-2 py-3 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                    <div className="text-center flex-1 overflow-hidden">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">De (Tutor Atual)</p>
                      <p className="text-slate-700 dark:text-slate-200 font-extrabold truncate">
                        {displayCurrentTutorName}
                      </p>
                    </div>

                    <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />

                    <div className="text-center flex-1 overflow-hidden">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Para (Novo Tutor)</p>
                      <p className="text-emerald-700 dark:text-emerald-400 font-extrabold truncate">
                        {selectedNewTutor?.nome || 'A selecionar'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Notice Callout */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    Atenção à Guarda Responsável
                  </p>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    Ao confirmar, o animal será imediatamente re-vinculado ao novo tutor no banco de dados da clínica.
                  </p>
                </div>

                {/* Action Submit Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedAnimalId || !selectedTutorId || !termoAceite}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Confirmar Adoção / Transferência</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="w-full py-3.5 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    Cancelar e Voltar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Adocao;
