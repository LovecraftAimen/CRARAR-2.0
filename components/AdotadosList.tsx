import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Search, 
  User, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  Info, 
  CheckCircle2, 
  X, 
  MapPin,
  Clock,
  Stethoscope
} from 'lucide-react';
import { Tutor, Animal, Atendimento } from '../types';
import { formatFullAddress } from '../utils/viaCep';

interface AdotadosListProps {
  animais: Animal[];
  tutores: Tutor[];
  atendimentos?: Atendimento[];
}

const ITEMS_PER_PAGE = 20;

export const AdotadosList: React.FC<AdotadosListProps> = ({
  animais,
  tutores,
  atendimentos = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedAnimalForDetails, setSelectedAnimalForDetails] = useState<Animal | null>(null);

  // Map of tutors for quick lookup
  const tutorMap = useMemo(() => {
    const map = new Map<string, Tutor>();
    tutores.forEach(t => map.set(t.id, t));
    return map;
  }, [tutores]);

  // Filter ONLY adopted animals (adotado === true)
  const adoptedAnimais = useMemo(() => {
    return animais.filter(a => Boolean(a.adotado) === true);
  }, [animais]);

  // Search filtering
  const filteredAnimais = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return adoptedAnimais;

    return adoptedAnimais.filter(animal => {
      const tutor = tutorMap.get(animal.tutor_id);
      return (
        animal.nome.toLowerCase().includes(query) ||
        animal.raca.toLowerCase().includes(query) ||
        animal.especie.toLowerCase().includes(query) ||
        (tutor && tutor.nome.toLowerCase().includes(query)) ||
        (tutor && tutor.cpf && tutor.cpf.includes(query)) ||
        (tutor && tutor.telefone && tutor.telefone.includes(query))
      );
    });
  }, [adoptedAnimais, searchQuery, tutorMap]);

  const displayedAnimais = useMemo(() => {
    return filteredAnimais.slice(0, visibleCount);
  }, [filteredAnimais, visibleCount]);

  // Statistics for adopted pets
  const stats = useMemo(() => {
    const total = adoptedAnimais.length;
    const caes = adoptedAnimais.filter(a => a.especie === 'Cão').length;
    const gatos = adoptedAnimais.filter(a => a.especie === 'Gato').length;
    const outros = total - caes - gatos;
    return { total, caes, gatos, outros };
  }, [adoptedAnimais]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
            Clínica &bull; Guarda Responsável
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Animais Adotados
          </h2>
          <p className="text-emerald-100 text-sm font-medium leading-relaxed">
            Listagem completa de todos os pets registrados como adotados no sistema e os dados dos seus tutores responsáveis atuais.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-[120px] flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 leading-tight">Total de Adotados</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-[120px] flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 leading-tight">Cães Adotados</p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{stats.caes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-start gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-[120px] flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 leading-tight">Gatos Adotados</p>
            <p className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">{stats.gatos}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
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
            placeholder="Buscar animal adotado por nome, raça, tutor ou telefone..."
            className="w-full pl-12 pr-10 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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

      {/* Adopted Animals Grid */}
      {displayedAnimais.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAnimais.map((animal) => {
            const tutor = tutorMap.get(animal.tutor_id);

            return (
              <div 
                key={animal.id}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Pet Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-black text-sm uppercase">
                        {animal.nome.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {animal.nome}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400">
                          {animal.especie} &bull; {animal.raca}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> Adotado
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Sexo / Peso</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{animal.sexo || '-'} &bull; {animal.peso ? `${animal.peso} kg` : '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Adesão / Microchip</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {animal.data_adesao ? new Date(animal.data_adesao).toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Tutor Actual */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> Tutor Atual
                      </span>
                      {tutor?.cpf && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          CPF: {tutor.cpf}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {tutor ? tutor.nome : 'Sem tutor associado'}
                    </p>
                    {tutor?.telefone && (
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        {tutor.telefone}
                      </p>
                    )}
                    {formatFullAddress(tutor) && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                        <span className="truncate">{formatFullAddress(tutor)}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setSelectedAnimalForDetails(animal)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all text-xs font-bold"
                >
                  <Info className="h-4 w-4" />
                  Ver Prontuário Clínico
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 text-center border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white">Nenhum animal adotado encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery 
              ? 'Tente ajustar sua busca para encontrar o animal ou tutor desejado.'
              : 'Atualmente não há animais com o status de adoção confirmado no banco de dados.'}
          </p>
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredAnimais.length > visibleCount && (
        <div className="pt-4 text-center space-y-3">
          <button
            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Carregar Mais (+{ITEMS_PER_PAGE})
          </button>
          <p className="text-xs font-bold text-slate-400">
            Exibindo {displayedAnimais.length} de {filteredAnimais.length} animais adotados
          </p>
        </div>
      )}

      {/* Modal Prontuário Clínico */}
      {selectedAnimalForDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-4 backdrop-blur-sm animate-fade-in overflow-hidden">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[40px] bg-white dark:bg-slate-900 shadow-2xl border border-white dark:border-slate-800 flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-slate-900 z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-950 p-2.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    Ficha Clínica de Adotado: <span className="text-emerald-600">{selectedAnimalForDetails.nome}</span>
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-2 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    Status no banco: <span className="text-emerald-600 font-bold uppercase">Adotado</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAnimalForDetails(null)}
                className="rounded-full bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-400 hover:text-red-500 transition-all shadow-sm"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 p-6 md:p-10 space-y-8">
              {/* Pet Details & Tutor Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-6 space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Informações do Animal
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-black text-slate-900 dark:text-white text-base">{selectedAnimalForDetails.nome}</p>
                    <p className="text-slate-600 dark:text-slate-300"><strong>Espécie:</strong> {selectedAnimalForDetails.especie}</p>
                    <p className="text-slate-600 dark:text-slate-300"><strong>Raça:</strong> {selectedAnimalForDetails.raca}</p>
                    <p className="text-slate-600 dark:text-slate-300"><strong>Sexo:</strong> {selectedAnimalForDetails.sexo || 'Não informado'}</p>
                    <p className="text-slate-600 dark:text-slate-300"><strong>Peso:</strong> {selectedAnimalForDetails.peso ? `${selectedAnimalForDetails.peso} kg` : 'Não informado'}</p>
                    <p className="text-slate-600 dark:text-slate-300"><strong>Data de Adesão:</strong> {selectedAnimalForDetails.data_adesao ? new Date(selectedAnimalForDetails.data_adesao).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                  </div>
                </div>

                <div className="rounded-[32px] border border-emerald-100 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/20 p-6 space-y-3">
                  <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Tutor Atual Responsável
                  </h3>
                  {(() => {
                    const tutor = tutorMap.get(selectedAnimalForDetails.tutor_id);
                    if (!tutor) {
                      return <p className="text-sm font-bold text-slate-500">Nenhum tutor associado no momento.</p>;
                    }
                    return (
                      <div className="space-y-2 text-sm">
                        <p className="font-black text-slate-900 dark:text-white text-base">{tutor.nome}</p>
                        <p className="text-slate-600 dark:text-slate-300"><strong>CPF:</strong> {tutor.cpf || 'Não cadastrado'}</p>
                        <p className="text-slate-600 dark:text-slate-300"><strong>Telefone:</strong> {tutor.telefone || 'Não informado'}</p>
                        <p className="text-slate-600 dark:text-slate-300"><strong>Endereço:</strong> {formatFullAddress(tutor) || 'Não informado'}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Atendimentos History if available */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-600" /> Histórico de Atendimentos Clínicos
                </h3>
                {(() => {
                  const animalAts = atendimentos.filter(at => at.animal_id === selectedAnimalForDetails.id);
                  if (animalAts.length === 0) {
                    return (
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                        Nenhum atendimento clínico registrado até o momento para este pet.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-3">
                      {animalAts.map(at => (
                        <div key={at.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-slate-800 dark:text-white">
                              {new Date(at.data).toLocaleDateString('pt-BR')}
                            </span>
                            {at.castracao && (
                              <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                Castração Efetuada
                              </span>
                            )}
                          </div>
                          {at.diagnostico && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              <strong>Diagnóstico:</strong> {at.diagnostico}
                            </p>
                          )}
                          {at.tratamento && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              <strong>Tratamento:</strong> {at.tratamento}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdotadosList;
