
// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Search, PawPrint, User, Stethoscope, ChevronRight, Filter, 
//   ShieldCheck, Heart, ChevronLeft, Clock, X, Download, Edit, 
//   UserPlus, Trash2, Calendar, Weight, Info, MapPin, Phone, CreditCard,
//   Mail, ChevronRight as ChevronRightIcon
// } from 'lucide-react';
// import { Tutor, Animal, Atendimento } from '../types';

// interface SearchResultsProps {
//   tutores: Tutor[];
//   animais: Animal[];
//   atendimentos: Atendimento[];
//   userRole: string;
//   hideTutorFilter?: boolean;
//   forceAnimalList?: boolean;
// }

// const ITEMS_PER_PAGE = 20;

// // Helper function moved outside to be shared by sub-components
// const calculateAge = (birthDate: string) => {
//   if (!birthDate) return 'N/A';
//   const birth = new Date(birthDate);
//   const today = new Date();
//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//     age--;
//   }
//   return age === 0 ? 'Menos de 1' : `${age} ${age > 1 ? 'anos' : 'ano'}`;
// };

// // Sub-component moved outside to fix TypeScript 'key' prop assignment error
// // Added key?: React.Key to the type definition
// const AnimalListItem = ({ 
//   animal, 
//   tutores, 
//   onViewDetails 
// }: { 
//   animal: Animal; 
//   tutores: Tutor[]; 
//   onViewDetails: (animal: Animal) => void;
//   key?: React.Key;
// }) => {
//   const tutor = tutores.find(t => t.id === animal.tutor_id);
//   const isCrarar = animal.categoria === 'crarar' || tutor?.nome?.toUpperCase() === 'CRARAR';

//   return (
//     <div className="group flex flex-col sm:flex-row items-center gap-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:translate-y-[-2px]">
//       <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
//         isCrarar ? 'bg-crarar-primary text-white' : 'bg-green-100 text-green-600'
//       }`}>
//         <PawPrint className="h-8 w-8" />
//       </div>
      
//       <div className="flex-1 text-center sm:text-left overflow-hidden">
//         <div className="flex flex-col sm:flex-row sm:items-center gap-2 overflow-hidden">
//           <h4 className="text-lg font-bold text-slate-800 truncate">{animal.nome}</h4>
//           {isCrarar && (
//             <span className="inline-flex items-center justify-center gap-1 rounded-full bg-crarar-primary px-3 py-1 text-[9px] font-bold uppercase text-white w-fit mx-auto sm:mx-0 shadow-sm">
//               <ShieldCheck className="h-3 w-3" /> CRARAR
//             </span>
//           )}
//         </div>
//         <p className="text-sm text-slate-500 font-medium truncate">{animal.especie} &bull; {animal.raca}</p>
//         <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-slate-400">
//            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
//               <User className="h-3 w-3" />
//               <span className="font-bold text-slate-600 truncate max-w-[150px]">{tutor?.nome || 'Sem tutor'}</span>
//            </div>
//         </div>
//       </div>

//       <div className="shrink-0 w-full sm:w-auto">
//         <button 
//           onClick={() => onViewDetails(animal)}
//           className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold transition-all shadow-sm ${
//             isCrarar 
//               ? 'bg-crarar-primary text-white hover:bg-crarar-primary/90' 
//               : 'bg-white border border-slate-200 text-slate-600 hover:border-crarar-primary hover:text-crarar-primary'
//           }`}
//         >
//           <Info className="h-4 w-4" />
//           Ver Prontuário
//         </button>
//       </div>
//     </div>
//   );
// };

// // Sub-component moved outside to fix TypeScript 'key' prop assignment error
// // Added key?: React.Key to the type definition
// const TutorCard = ({ tutor }: { tutor: Tutor; key?: React.Key }) => {
//   return (
//     <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
//       <div className="mb-6 flex items-center gap-4">
//         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-crarar-primary/10 text-crarar-primary shadow-inner">
//           <User className="h-7 w-7" />
//         </div>
//         <div className="overflow-hidden">
//           <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{tutor.nome}</h4>
//           <p className="text-sm text-slate-400 font-medium">{tutor.telefone}</p>
//         </div>
//       </div>
      
//       <div className="space-y-3 border-t border-slate-50 pt-5">
//         <div className="flex items-center gap-3 text-xs text-slate-500">
//           <div className="p-1.5 bg-slate-50 rounded-lg">
//             <CreditCard className="h-3.5 w-3.5 opacity-60" />
//           </div>
//           <span className="font-medium">CPF: {tutor.cpf || 'Não informado'}</span>
//         </div>
//         <div className="flex items-center gap-3 text-xs text-slate-500">
//            <div className="p-1.5 bg-slate-50 rounded-lg">
//              <Mail className="h-3.5 w-3.5 opacity-60" />
//            </div>
//           <span className="line-clamp-1 font-medium">{tutor.email || 'Sem email cadastrado'}</span>
//         </div>
//         <div className="flex items-center gap-3 text-xs text-slate-500">
//            <div className="p-1.5 bg-slate-50 rounded-lg">
//              <MapPin className="h-3.5 w-3.5 opacity-60" />
//            </div>
//           <span className="line-clamp-1 font-medium">{tutor.endereco || 'Endereço não informado'}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sub-component moved outside to fix TypeScript 'key' prop assignment error
// const AnimalDetailsModal = ({ 
//   animal, 
//   tutores, 
//   atendimentos, 
//   onClose 
// }: { 
//   animal: Animal; 
//   tutores: Tutor[]; 
//   atendimentos: Atendimento[]; 
//   onClose: () => void;
// }) => {
//   const tutor = tutores.find(t => t.id === animal.tutor_id);
//   const animalAtendimentos = atendimentos.filter(at => at.animal_id === animal.id);

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-6 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
//       <div className="h-full max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[40px] bg-white shadow-2xl border border-white flex flex-col relative">
        
//         <div className="bg-white z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 shrink-0">
//           <div className="flex items-start justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="rounded-2xl bg-crarar-primary/10 p-2.5 text-crarar-primary">
//                   <PawPrint className="h-6 w-6" />
//                 </div>
//                 <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
//                   Histórico de <span className="text-crarar-primary">{animal.nome}</span>
//                 </h2>
//               </div>
//               <p className="mt-1 text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-2">
//                 <Clock className="h-3.5 w-3.5" />
//                 Atualizado em {new Date().toLocaleDateString('pt-BR')}
//               </p>
//             </div>
//             <button 
//               onClick={onClose}
//               className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
          
//           <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
//              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Espécie</p>
//                 <p className="text-xs font-bold text-slate-700">{animal.especie}</p>
//              </div>
//              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raça</p>
//                 <p className="text-xs font-bold text-slate-700 truncate">{animal.raca}</p>
//              </div>
//              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idade</p>
//                 <p className="text-xs font-bold text-slate-700">{calculateAge(animal.data_nascimento)}</p>
//              </div>
//              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso</p>
//                 <p className="text-xs font-bold text-slate-700">{animal.peso} kg</p>
//              </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto scrollbar-green p-6 md:p-10 space-y-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="rounded-[32px] border border-slate-100 bg-slate-50/20 p-8 flex flex-col">
//               <h3 className="mb-6 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
//                 <User className="h-4 w-4 text-crarar-primary" /> Tutor Responsável
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-black text-slate-800 text-lg md:text-xl leading-tight">{tutor?.nome || 'Não Informado'}</p>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                     <Phone className="h-4 w-4 text-crarar-primary" />
//                     {tutor?.telefone || 'N/A'}
//                   </div>
//                   <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                     <MapPin className="h-4 w-4 text-crarar-primary" />
//                     <span className="truncate">{tutor?.endereco || 'Endereço não cadastrado'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[32px] border border-slate-100 bg-crarar-primary/[0.03] p-8 flex flex-col justify-center text-center">
//               <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white flex items-center justify-center text-crarar-primary shadow-sm border border-crarar-primary/5">
//                  <Heart className="h-8 w-8" />
//               </div>
//               <h4 className="text-lg font-black text-slate-800">Status Geral</h4>
//               <p className="text-sm font-medium text-slate-500 mt-1">
//                  {animalAtendimentos.length > 0 ? `${animalAtendimentos.length} atendimentos registrados no total.` : 'Início de jornada clínica.'}
//               </p>
//             </div>
//           </div>

//           <div className="space-y-8">
//             <div className="flex items-center gap-4">
//               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
//                 <div className="h-1.5 w-8 bg-crarar-primary rounded-full"></div>
//                 LINHA DO TEMPO CLÍNICA
//               </h3>
//             </div>
            
//             <div className="space-y-6">
//               {animalAtendimentos.map((at, idx) => (
//                 <div key={at.id} className="relative pl-8 md:pl-10">
//                   {idx !== animalAtendimentos.length - 1 && (
//                     <div className="absolute left-3.5 md:left-4.5 top-10 bottom-[-1.5rem] w-px bg-slate-100"></div>
//                   )}
//                   <div className="absolute left-0 top-3 h-7 w-7 md:h-9 md:w-9 rounded-full bg-white border-4 border-crarar-primary shadow-sm flex items-center justify-center z-10">
//                     <div className="h-2 w-2 rounded-full bg-crarar-primary"></div>
//                   </div>

//                   <div className="rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
//                     <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-5">
//                       <div className="flex items-center gap-2 text-sm font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-xl">
//                         <Calendar className="h-4 w-4 text-crarar-primary" /> 
//                         {new Date(at.data).toLocaleDateString('pt-BR')}
//                       </div>
//                       <div className="px-5 py-2 bg-crarar-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-crarar-primary/10">
//                         Dr(a). {at.veterinario}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
//                       <div className="space-y-6">
//                         <div>
//                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Quadro Clínico</p>
//                           <p className="text-slate-700 font-semibold leading-relaxed text-base">{at.sintomas}</p>
//                         </div>
//                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avaliação / Diagnóstico</p>
//                           <p className="text-slate-900 font-black leading-relaxed text-base">{at.diagnostico}</p>
//                         </div>
//                       </div>
//                       <div className="space-y-6">
//                         <div className="bg-crarar-primary/[0.02] p-6 rounded-[24px] border border-crarar-primary/5">
//                           <p className="text-[10px] font-black text-crarar-primary/60 uppercase tracking-widest mb-3 flex items-center gap-2">
//                              <Edit className="h-3 w-3" /> Conduta Terapêutica
//                           </p>
//                           <p className="text-slate-700 font-semibold leading-relaxed mb-6">{at.tratamento}</p>
//                           {at.medicamentos && (
//                             <div className="pt-5 border-t border-crarar-primary/10">
//                                <p className="text-[10px] font-black text-crarar-primary uppercase tracking-widest mb-2">Prescrição</p>
//                                <p className="text-crarar-primary font-black bg-white px-4 py-3 rounded-xl border border-crarar-primary/5 shadow-inner">{at.medicamentos}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SearchResults: React.FC<SearchResultsProps> = ({ 
//   tutores, 
//   animais, 
//   atendimentos, 
//   userRole,
//   hideTutorFilter = false,
//   forceAnimalList = false
// }) => {
//   const [query, setQuery] = useState('');
//   const [filter, setFilter] = useState<'animais' | 'tutores'>(forceAnimalList ? 'animais' : 'animais');
//   const [petSubFilter, setPetSubFilter] = useState<'all' | 'crarar' | 'normal'>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAnimalForDetails, setSelectedAnimalForDetails] = useState<Animal | null>(null);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [query, filter, petSubFilter]);

//   const processedData = useMemo(() => {
//     const lowerQuery = query.toLowerCase().trim();
    
//     let filteredAnimais = animais.filter(a => {
//       const tutor = tutores.find(t => t.id === a.tutor_id);
//       const isInstitutional = a.categoria === 'crarar' || tutor?.nome?.toUpperCase() === 'CRARAR';

//       const animalName = (a.nome || '').toLowerCase();
//       const animalEspecie = (a.especie || '').toLowerCase();
//       const animalRaca = (a.raca || '').toLowerCase();

//       const matchesSearch = !lowerQuery || 
//              animalName.includes(lowerQuery) || 
//              animalEspecie.includes(lowerQuery) ||
//              animalRaca.includes(lowerQuery);
      
//       if (petSubFilter === 'crarar') {
//         return matchesSearch && isInstitutional;
//       } else if (petSubFilter === 'normal') {
//         return matchesSearch && !isInstitutional;
//       } else {
//         return matchesSearch;
//       }
//     });

//     const filteredTutores = tutores.filter(t => {
//       if (forceAnimalList) return false;
//       if (!lowerQuery) return true;
//       const tutorName = (t.nome || '').toLowerCase();
//       const tutorCpf = (t.cpf || '');
//       const tutorTel = (t.telefone || '');

//       return tutorName.includes(lowerQuery) || 
//              tutorCpf.includes(lowerQuery) ||
//              tutorTel.includes(lowerQuery);
//     });

//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const paginatedAnimais = filteredAnimais.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//     const totalPages = Math.ceil(filteredAnimais.length / ITEMS_PER_PAGE);

//     return {
//       animais: paginatedAnimais,
//       totalAnimais: filteredAnimais.length,
//       tutores: filteredTutores,
//       totalPages
//     };
//   }, [query, animais, tutores, petSubFilter, currentPage, forceAnimalList]);

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-6">
//         <div className="relative">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
//           <input
//             type="text"
//             placeholder="Buscar por nome do pet, tutor, espécie, raça ou telefone..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-base font-medium text-slate-700 focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/5 outline-none transition-all placeholder:text-slate-300 shadow-inner"
//           />
//         </div>
        
//         <div className="flex flex-wrap items-center gap-x-12 gap-y-4 px-2">
//           <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
//             <button
//               onClick={() => setFilter('animais')}
//               className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${filter === 'animais' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
//             >
//               Animais
//             </button>
//             {!hideTutorFilter && (
//               <button
//                 onClick={() => setFilter('tutores')}
//                 className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${filter === 'tutores' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
//               >
//                 Tutores
//               </button>
//             )}
//           </div>

//           {(filter === 'animais') && (
//             <div className="flex items-center gap-4 sm:ml-8">
//                <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
//                   <Filter className="h-3 w-3" /> Instituição:
//                </span>
//                <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
//                   <button
//                     onClick={() => setPetSubFilter('all')}
//                     className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${petSubFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
//                   >
//                     Todos
//                   </button>
//                   <button
//                     onClick={() => setPetSubFilter('crarar')}
//                     className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${petSubFilter === 'crarar' ? 'bg-crarar-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
//                   >
//                     <ShieldCheck className="h-3 w-3" /> CRARAR
//                   </button>
//                   <button
//                     onClick={() => setPetSubFilter('normal')}
//                     className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${petSubFilter === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
//                   >
//                     Comum
//                   </button>
//                </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="space-y-10">
//         {(filter === 'animais') && (
//           <div className="space-y-5">
//             <div className="flex items-center justify-between border-b border-slate-200 pb-3 mx-2">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                  <PawPrint className="h-4 w-4 text-crarar-primary" /> 
//                  ANIMAIS ({processedData.totalAnimais})
//               </h3>
//             </div>
//             <div className="grid grid-cols-1 gap-4">
//               {processedData.animais.map(animal => (
//                 <AnimalListItem 
//                   key={animal.id} 
//                   animal={animal} 
//                   tutores={tutores} 
//                   onViewDetails={setSelectedAnimalForDetails}
//                 />
//               ))}
//               {processedData.animais.length === 0 && (
//                 <div className="py-12 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
//                   <p className="text-slate-400 font-bold italic">Nenhum animal encontrado para esta busca.</p>
//                 </div>
//               )}
//             </div>
            
//             {processedData.totalPages > 1 && (
//               <div className="flex items-center justify-center gap-4 pt-8">
//                 <button 
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(p => p - 1)}
//                   className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-crarar-primary hover:text-crarar-primary disabled:opacity-30"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>
//                 <div className="flex items-center px-6 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-black text-slate-500 uppercase tracking-widest">
//                   {currentPage} / {processedData.totalPages}
//                 </div>
//                 <button 
//                   disabled={currentPage === processedData.totalPages}
//                   onClick={() => setCurrentPage(p => p + 1)}
//                   className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-crarar-primary hover:text-crarar-primary disabled:opacity-30"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {(filter === 'tutores') && !forceAnimalList && (
//           <div className="space-y-5 pt-4">
//             <div className="flex items-center border-b border-slate-200 pb-3 mx-2">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                 <User className="h-4 w-4 text-blue-500" />
//                 TUTORES ({processedData.tutores.length})
//               </h3>
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {processedData.tutores.map(tutor => (
//                 <TutorCard key={tutor.id} tutor={tutor} />
//               ))}
//               {processedData.tutores.length === 0 && (
//                 <div className="col-span-full py-12 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
//                   <p className="text-slate-400 font-bold italic">Nenhum tutor encontrado.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedAnimalForDetails && (
//         <AnimalDetailsModal 
//           animal={selectedAnimalForDetails} 
//           tutores={tutores} 
//           atendimentos={atendimentos} 
//           onClose={() => setSelectedAnimalForDetails(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default SearchResults;



import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, PawPrint, User, Stethoscope, ChevronRight, Filter, 
  ShieldCheck, Heart, ChevronLeft, Clock, X, Download, Edit, 
  UserPlus, Trash2, Calendar, Weight, Info, MapPin, Phone, CreditCard,
  Mail, ChevronRight as ChevronRightIcon, Scissors
} from 'lucide-react';
import { Tutor, Animal, Atendimento } from '../types';

interface SearchResultsProps {
  tutores: Tutor[];
  animais: Animal[];
  atendimentos: Atendimento[];
  userRole: string;
  hideTutorFilter?: boolean;
  forceAnimalList?: boolean;
}

const ITEMS_PER_PAGE = 20;

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 'N/A';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age === 0 ? 'Menos de 1' : `${age} ${age > 1 ? 'anos' : 'ano'}`;
};

const AnimalListItem = ({ 
  animal, 
  tutores, 
  onViewDetails 
}: { 
  animal: Animal; 
  tutores: Tutor[]; 
  onViewDetails: (animal: Animal) => void;
  key?: React.Key;
}) => {
  const tutor = tutores.find(t => t.id === animal.tutor_id);
  // Identifica se é CRARAR pelo tutor, já que não temos coluna categoria no banco de animais
  const isCrarar = tutor?.nome?.toUpperCase() === 'CRARAR';

  return (
    <div className="group flex flex-col sm:flex-row items-center gap-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:translate-y-[-2px]">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
        isCrarar ? 'bg-crarar-primary text-white' : 'bg-green-100 text-green-600'
      }`}>
        <PawPrint className="h-8 w-8" />
      </div>
      
      <div className="flex-1 text-center sm:text-left overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 overflow-hidden">
          <h4 className="text-lg font-bold text-slate-800 truncate">{animal.nome}</h4>
          {isCrarar && (
            <span className="inline-flex items-center justify-center gap-1 rounded-full bg-crarar-primary px-3 py-1 text-[9px] font-bold uppercase text-white w-fit mx-auto sm:mx-0 shadow-sm">
              <ShieldCheck className="h-3 w-3" /> CRARAR
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 font-medium truncate">{animal.especie} &bull; {animal.raca}</p>
        <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-slate-400">
           <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <User className="h-3 w-3" />
              <span className="font-bold text-slate-600 truncate max-w-[150px]">{tutor?.nome || 'Sem tutor'}</span>
           </div>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        <button 
          onClick={() => onViewDetails(animal)}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold transition-all shadow-sm ${
            isCrarar 
              ? 'bg-crarar-primary text-white hover:bg-crarar-primary/90' 
              : 'bg-white border border-slate-200 text-slate-600 hover:border-crarar-primary hover:text-crarar-primary'
          }`}
        >
          <Info className="h-4 w-4" />
          Ver Prontuário
        </button>
      </div>
    </div>
  );
};

const TutorCard = ({ tutor }: { tutor: Tutor; key?: React.Key }) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-crarar-primary/10 text-crarar-primary shadow-inner">
          <User className="h-7 w-7" />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{tutor.nome}</h4>
          <p className="text-sm text-slate-400 font-medium">{tutor.telefone}</p>
        </div>
      </div>
      
      <div className="space-y-3 border-t border-slate-50 pt-5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="p-1.5 bg-slate-50 rounded-lg">
            <CreditCard className="h-3.5 w-3.5 opacity-60" />
          </div>
          <span className="font-medium">CPF: {tutor.cpf || 'Não informado'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
           <div className="p-1.5 bg-slate-50 rounded-lg">
             <Mail className="h-3.5 w-3.5 opacity-60" />
           </div>
          <span className="line-clamp-1 font-medium">{tutor.email || 'Sem email cadastrado'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
           <div className="p-1.5 bg-slate-50 rounded-lg">
             <MapPin className="h-3.5 w-3.5 opacity-60" />
           </div>
          <span className="line-clamp-1 font-medium">{tutor.endereco || 'Endereço não informado'}</span>
        </div>
      </div>
    </div>
  );
};

const AnimalDetailsModal = ({ 
  animal, 
  tutores, 
  atendimentos, 
  onClose 
}: { 
  animal: Animal; 
  tutores: Tutor[]; 
  atendimentos: Atendimento[]; 
  onClose: () => void;
}) => {
  const tutor = tutores.find(t => t.id === animal.tutor_id);
  const animalAtendimentos = atendimentos.filter(at => at.animal_id === animal.id);
  
  // Verifica castração no histórico
  const isCastrated = animalAtendimentos.some(at => at.castracao === true);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-6 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
      <div className="h-full max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[40px] bg-white shadow-2xl border border-white flex flex-col relative">
        
        <div className="bg-white z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-crarar-primary/10 p-2.5 text-crarar-primary">
                  <PawPrint className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  Histórico de <span className="text-crarar-primary">{animal.nome}</span>
                </h2>
              </div>
              <p className="mt-1 text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Atualizado em {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
             <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Espécie</p>
                <p className="text-xs font-bold text-slate-700">{animal.especie}</p>
             </div>
             <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raça</p>
                <p className="text-xs font-bold text-slate-700 truncate">{animal.raca}</p>
             </div>
             <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idade</p>
                <p className="text-xs font-bold text-slate-700">{calculateAge(animal.data_nascimento)}</p>
             </div>
             <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso</p>
                <p className="text-xs font-bold text-slate-700">{animal.peso} kg</p>
             </div>
             <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Castrado</p>
                <p className={`text-xs font-bold ${isCastrated ? 'text-emerald-600' : 'text-slate-700'}`}>{isCastrated ? 'Sim' : 'Não'}</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-green p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[32px] border border-slate-100 bg-slate-50/20 p-8 flex flex-col">
              <h3 className="mb-6 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <User className="h-4 w-4 text-crarar-primary" /> Tutor Responsável
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-black text-slate-800 text-lg md:text-xl leading-tight">{tutor?.nome || 'Não Informado'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                    <Phone className="h-4 w-4 text-crarar-primary" />
                    {tutor?.telefone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                    <MapPin className="h-4 w-4 text-crarar-primary" />
                    <span className="truncate">{tutor?.endereco || 'Endereço não cadastrado'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-100 bg-crarar-primary/[0.03] p-8 flex flex-col justify-center text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white flex items-center justify-center text-crarar-primary shadow-sm border border-crarar-primary/5">
                 <Heart className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-black text-slate-800">Status Geral</h4>
              <p className="text-sm font-medium text-slate-500 mt-1">
                 {animalAtendimentos.length > 0 ? `${animalAtendimentos.length} atendimentos registrados no total.` : 'Início de jornada clínica.'}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="h-1.5 w-8 bg-crarar-primary rounded-full"></div>
                LINHA DO TEMPO CLÍNICA
              </h3>
            </div>
            
            <div className="space-y-6">
              {animalAtendimentos.map((at, idx) => (
                <div key={at.id} className="relative pl-8 md:pl-10">
                  {idx !== animalAtendimentos.length - 1 && (
                    <div className="absolute left-3.5 md:left-4.5 top-10 bottom-[-1.5rem] w-px bg-slate-100"></div>
                  )}
                  <div className="absolute left-0 top-3 h-7 w-7 md:h-9 md:w-9 rounded-full bg-white border-4 border-crarar-primary shadow-sm flex items-center justify-center z-10">
                    <div className="h-2 w-2 rounded-full bg-crarar-primary"></div>
                  </div>

                  <div className="rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-5">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-xl">
                        <Calendar className="h-4 w-4 text-crarar-primary" /> 
                        {new Date(at.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="px-5 py-2 bg-crarar-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-crarar-primary/10">
                        Dr(a). {at.veterinario}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Quadro Clínico</p>
                          <p className="text-slate-700 font-semibold leading-relaxed text-base">{at.sintomas}</p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avaliação / Diagnóstico</p>
                          <p className="text-slate-900 font-black leading-relaxed text-base">{at.diagnostico}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-crarar-primary/[0.02] p-6 rounded-[24px] border border-crarar-primary/5">
                          <p className="text-[10px] font-black text-crarar-primary/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Edit className="h-3 w-3" /> Conduta Terapêutica
                          </p>
                          <p className="text-slate-700 font-semibold leading-relaxed mb-6">{at.tratamento}</p>
                          {at.medicamentos && (
                            <div className="pt-5 border-t border-crarar-primary/10">
                               <p className="text-[10px] font-black text-crarar-primary uppercase tracking-widest mb-2">Prescrição</p>
                               <p className="text-crarar-primary font-black bg-white px-4 py-3 rounded-xl border border-crarar-primary/5 shadow-inner">{at.medicamentos}</p>
                            </div>
                          )}
                          {at.castracao && (
                            <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                               <Scissors className="h-3.5 w-3.5" /> Castração Realizada
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults: React.FC<SearchResultsProps> = ({ 
  tutores, 
  animais, 
  atendimentos, 
  userRole,
  hideTutorFilter = false,
  forceAnimalList = false
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'animais' | 'tutores'>(forceAnimalList ? 'animais' : 'animais');
  const [petSubFilter, setPetSubFilter] = useState<'all' | 'crarar' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnimalForDetails, setSelectedAnimalForDetails] = useState<Animal | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, filter, petSubFilter]);

  const processedData = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    
    let filteredAnimais = animais.filter(a => {
      const tutor = tutores.find(t => t.id === a.tutor_id);
      // Identifica institucional pelo tutor
      const isInstitutional = tutor?.nome?.toUpperCase() === 'CRARAR';

      const animalName = (a.nome || '').toLowerCase();
      const animalEspecie = (a.especie || '').toLowerCase();
      const animalRaca = (a.raca || '').toLowerCase();

      const matchesSearch = !lowerQuery || 
             animalName.includes(lowerQuery) || 
             animalEspecie.includes(lowerQuery) ||
             animalRaca.includes(lowerQuery);
      
      if (petSubFilter === 'crarar') {
        return matchesSearch && isInstitutional;
      } else if (petSubFilter === 'normal') {
        return matchesSearch && !isInstitutional;
      } else {
        return matchesSearch;
      }
    });

    const filteredTutores = tutores.filter(t => {
      if (forceAnimalList) return false;
      if (!lowerQuery) return true;
      const tutorName = (t.nome || '').toLowerCase();
      const tutorCpf = (t.cpf || '');
      const tutorTel = (t.telefone || '');

      return tutorName.includes(lowerQuery) || 
             tutorCpf.includes(lowerQuery) ||
             tutorTel.includes(lowerQuery);
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAnimais = filteredAnimais.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredAnimais.length / ITEMS_PER_PAGE);

    return {
      animais: paginatedAnimais,
      totalAnimais: filteredAnimais.length,
      tutores: filteredTutores,
      totalPages
    };
  }, [query, animais, tutores, petSubFilter, currentPage, forceAnimalList]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
          <input
            type="text"
            placeholder="Buscar por nome do pet, tutor, espécie, raça ou telefone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-base font-medium text-slate-700 focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/5 outline-none transition-all placeholder:text-slate-300 shadow-inner"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 px-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setFilter('animais')}
              className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${filter === 'animais' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Animais
            </button>
            {!hideTutorFilter && (
              <button
                onClick={() => setFilter('tutores')}
                className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${filter === 'tutores' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Tutores
              </button>
            )}
          </div>

          {(filter === 'animais') && (
            <div className="flex items-center gap-4 sm:ml-8">
               <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Filter className="h-3 w-3" /> Instituição:
               </span>
               <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                  <button
                    onClick={() => setPetSubFilter('all')}
                    className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${petSubFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setPetSubFilter('crarar')}
                    className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${petSubFilter === 'crarar' ? 'bg-crarar-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <ShieldCheck className="h-3 w-3" /> CRARAR
                  </button>
                  <button
                    onClick={() => setPetSubFilter('normal')}
                    className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${petSubFilter === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Comum
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-10">
        {(filter === 'animais') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mx-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <PawPrint className="h-4 w-4 text-crarar-primary" /> 
                 ANIMAIS ({processedData.totalAnimais})
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {processedData.animais.map(animal => (
                <AnimalListItem 
                  key={animal.id} 
                  animal={animal} 
                  tutores={tutores} 
                  onViewDetails={setSelectedAnimalForDetails}
                />
              ))}
              {processedData.animais.length === 0 && (
                <div className="py-12 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">Nenhum animal encontrado para esta busca.</p>
                </div>
              )}
            </div>
            
            {processedData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-crarar-primary hover:text-crarar-primary disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center px-6 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-black text-slate-500 uppercase tracking-widest">
                  {currentPage} / {processedData.totalPages}
                </div>
                <button 
                  disabled={currentPage === processedData.totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-crarar-primary hover:text-crarar-primary disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {(filter === 'tutores') && !forceAnimalList && (
          <div className="space-y-5 pt-4">
            <div className="flex items-center border-b border-slate-200 pb-3 mx-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                TUTORES ({processedData.tutores.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processedData.tutores.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
              {processedData.tutores.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">Nenhum tutor encontrado.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedAnimalForDetails && (
        <AnimalDetailsModal 
          animal={selectedAnimalForDetails} 
          tutores={tutores} 
          atendimentos={atendimentos} 
          onClose={() => setSelectedAnimalForDetails(null)} 
        />
      )}
    </div>
  );
};

export default SearchResults;
