
// import React, { useState, useMemo } from 'react';
// import { 
//   PawPrint, User, ShieldCheck, Clock, X, Info, Phone, Calendar, Search, ChevronLeft, ChevronRight, MapPin
// } from 'lucide-react';
// import { Tutor, Animal, Atendimento } from '../types';

// interface SearchPacientesProps {
//   tutores: Tutor[];
//   animais: Animal[];
//   atendimentos: Atendimento[];
// }

// const ITEMS_PER_PAGE = 20;

// // Helper function to calculate age based on birth date
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

// // Animal List Item component with key prop handling
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
//   const isCrarar = animal.categoria === 'crarar';

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

// // Modal component for viewing animal clinical details
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
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-4 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
//       <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[40px] bg-white shadow-2xl border border-white scrollbar-green flex flex-col">
//         <div className="sticky top-0 bg-white z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 shrink-0">
//           <div className="flex items-start justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="rounded-2xl bg-crarar-primary/10 p-2.5 text-crarar-primary">
//                   <PawPrint className="h-6 w-6" />
//                 </div>
//                 <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
//                   Ficha Clínica: <span className="text-crarar-primary">{animal.nome}</span>
//                 </h2>
//               </div>
//               <p className="mt-1 text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-2">
//                 <Clock className="h-3.5 w-3.5" />
//                 Atualizado em {new Date().toLocaleDateString('pt-BR')}
//               </p>
//             </div>
//             <button onClick={onClose} className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm">
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 p-6 md:p-10 space-y-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="rounded-[32px] border border-slate-100 bg-slate-50/20 p-8 flex flex-col">
//               <h3 className="mb-6 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
//                 <User className="h-4 w-4 text-crarar-primary" /> Tutor Responsável
//               </h3>
//               <div className="space-y-4">
//                 <p className="font-black text-slate-800 text-lg md:text-xl leading-tight">{tutor?.nome || 'Não Informado'}</p>
//                 <div className="flex flex-col gap-2">
//                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                      <Phone className="h-4 w-4 text-crarar-primary" /> {tutor?.telefone || 'N/A'}
//                    </div>
//                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                      <MapPin className="h-4 w-4 text-crarar-primary" /> {tutor?.endereco || 'Endereço não cadastrado'}
//                    </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-8">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
//               <div className="h-1.5 w-8 bg-crarar-primary rounded-full"></div>
//               HISTÓRICO CLÍNICO
//             </h3>
            
//             <div className="space-y-6">
//               {animalAtendimentos.map((at) => (
//                 <div key={at.id} className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
//                   <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-4">
//                     <div className="flex items-center gap-2 text-sm font-black text-slate-900">
//                       <Calendar className="h-4 w-4 text-crarar-primary" /> {new Date(at.data).toLocaleDateString('pt-BR')}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Sintomas</p>
//                       <p className="text-slate-700 font-medium">{at.sintomas}</p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Diagnóstico</p>
//                       <p className="text-slate-900 font-bold">{at.diagnostico}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {animalAtendimentos.length === 0 && (
//                 <p className="text-center text-slate-400 font-medium py-10">Nenhum atendimento registrado.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main component for searching clinical records
// const SearchPacientes: React.FC<SearchPacientesProps> = ({ tutores, animais, atendimentos }) => {
//   const [query, setQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

//   const filtered = useMemo(() => {
//     const q = query.toLowerCase().trim();
//     return animais.filter(a => {
//       const tutor = tutores.find(t => t.id === a.tutor_id);
//       return (a.nome?.toLowerCase().includes(q) || 
//               a.especie?.toLowerCase().includes(q) || 
//               a.raca?.toLowerCase().includes(q) ||
//               tutor?.nome?.toLowerCase().includes(q));
//     });
//   }, [query, animais, tutores]);

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
//         <div className="relative">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
//           <input
//             type="text"
//             placeholder="Buscar por nome do paciente, tutor ou raça..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-base font-medium outline-none focus:bg-white focus:border-crarar-primary transition-all shadow-inner"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         {paginated.map(animal => (
//           <AnimalListItem 
//             key={animal.id} 
//             animal={animal} 
//             tutores={tutores} 
//             onViewDetails={setSelectedAnimal} 
//           />
//         ))}
//         {paginated.length === 0 && (
//           <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
//             <p className="text-slate-400 font-bold italic">Nenhum paciente encontrado.</p>
//           </div>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-4">
//           <button 
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(p => p - 1)}
//             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//           <span className="text-xs font-bold text-slate-500">{currentPage} / {totalPages}</span>
//           <button 
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(p => p + 1)}
//             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//         </div>
//       )}

//       {selectedAnimal && (
//         <AnimalDetailsModal 
//           animal={selectedAnimal} 
//           tutores={tutores} 
//           atendimentos={atendimentos} 
//           onClose={() => setSelectedAnimal(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default SearchPacientes;




// import React, { useState, useMemo } from 'react';
// import { 
//   PawPrint, User, ShieldCheck, Clock, X, Info, Phone, Calendar, Search, ChevronLeft, ChevronRight, MapPin, AlertTriangle, Stethoscope, Pill, FileText, CheckCircle2, Edit, Trash2
// } from 'lucide-react';
// import { Tutor, Animal, Atendimento } from '../types';
// import EditModal from './EditModal.tsx';

// interface SearchPacientesProps {
//   tutores: Tutor[];
//   animais: Animal[];
//   atendimentos: Atendimento[];
// }

// const ITEMS_PER_PAGE = 20;

// // Helper function to calculate age based on birth date
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

// // Animal List Item component with key prop handling
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
//   // Fix: Identify institutional pets by checking the tutor name, as the 'categoria' property is not in the database schema.
//   const isCrarar = tutor?.nome?.toUpperCase() === 'CRARAR';

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

// // Modal component for viewing animal clinical details
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

//   const handleDeleteAtendimento = async (id: string) => {
//     if (!confirm("Tem certeza que deseja excluir este atendimento permanentemente?")) return;
//     try {
//       const { supabase } = await import('../integrations/supabase/client');
//       const { error } = await supabase.from('atendimentos').delete().eq('id', id);
//       if (error) throw error;
//       alert("Atendimento excluído com sucesso.");
//       window.location.reload();
//     } catch (e: any) {
//       alert("Erro ao excluir: " + e.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-4 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
//       <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[40px] bg-white shadow-2xl border border-white scrollbar-green flex flex-col">
//         <div className="sticky top-0 bg-white z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 shrink-0">
//           <div className="flex items-start justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="rounded-2xl bg-crarar-primary/10 p-2.5 text-crarar-primary">
//                   <PawPrint className="h-6 w-6" />
//                 </div>
//                 <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
//                   Ficha Clínica: <span className="text-crarar-primary">{animal.nome}</span>
//                 </h2>
//               </div>
//               <p className="mt-1 text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-2">
//                 <Clock className="h-3.5 w-3.5" />
//                 Atualizado em {new Date().toLocaleDateString('pt-BR')}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={onClose} className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 p-6 md:p-10 space-y-10">
//           {/* Dados do Tutor e Resumo do Animal */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="rounded-[32px] border border-slate-100 bg-slate-50/20 p-8 flex flex-col">
//               <h3 className="mb-6 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
//                 <User className="h-4 w-4 text-crarar-primary" /> Tutor Responsável
//               </h3>
//               <div className="space-y-4">
//                 <p className="font-black text-slate-800 text-lg md:text-xl leading-tight">{tutor?.nome || 'Não Informado'}</p>
//                 <div className="flex flex-col gap-2">
//                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                      <Phone className="h-4 w-4 text-crarar-primary" /> {tutor?.telefone || 'N/A'}
//                    </div>
//                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
//                      <MapPin className="h-4 w-4 text-crarar-primary" /> {tutor?.endereco || 'Endereço não cadastrado'}
//                    </div>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[32px] border border-slate-100 bg-crarar-primary/[0.02] p-8 flex flex-col justify-center">
//               <h3 className="mb-4 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
//                 <Info className="h-4 w-4 text-crarar-primary" /> Perfil do Paciente
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Espécie</p>
//                   <p className="text-sm font-bold text-slate-700">{animal.especie}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Raça</p>
//                   <p className="text-sm font-bold text-slate-700 truncate">{animal.raca}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Idade</p>
//                   <p className="text-sm font-bold text-slate-700">{calculateAge(animal.data_nascimento)}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Peso</p>
//                   <p className="text-sm font-bold text-slate-700">{animal.peso} kg</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-8">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
//               <div className="h-1.5 w-8 bg-crarar-primary rounded-full"></div>
//               HISTÓRICO CLÍNICO DETALHADO
//             </h3>
            
//             <div className="space-y-6">
//               {animalAtendimentos.map((at) => (
//                 <div key={at.id} className="rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md border-l-4 border-l-crarar-primary">
//                   <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
//                     <div className="flex items-center gap-2 text-sm font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-xl">
//                       <Calendar className="h-4 w-4 text-crarar-primary" /> {new Date(at.data).toLocaleDateString('pt-BR')}
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-crarar-primary/5 px-4 py-2 rounded-xl border border-crarar-primary/10">
//                         <Stethoscope className="h-4 w-4 text-crarar-primary" /> Dr(a). {at.veterinario}
//                       </div>
//                       <button 
//                         onClick={() => alert("Função de edição de atendimento será implementada em breve.")}
//                         className="p-2 text-slate-400 hover:text-crarar-primary hover:bg-slate-50 rounded-lg transition-all"
//                         title="Editar"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button 
//                         onClick={() => handleDeleteAtendimento(at.id)}
//                         className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                         title="Excluir"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
//                     <div className="space-y-5">
//                       <div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
//                           <Info className="h-3 w-3" /> Sintomas Relatados
//                         </p>
//                         <p className="text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{at.sintomas}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
//                           <CheckCircle2 className="h-3 w-3" /> Diagnóstico & Avaliação
//                         </p>
//                         <p className="text-slate-900 font-bold leading-relaxed p-3 bg-white rounded-xl border border-slate-100">{at.diagnostico}</p>
//                       </div>
//                     </div>

//                     <div className="space-y-5">
//                       <div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
//                           <FileText className="h-3 w-3" /> Conduta & Tratamento
//                         </p>
//                         <p className="text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{at.tratamento}</p>
//                       </div>
//                       {at.medicamentos && (
//                         <div>
//                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
//                             <Pill className="h-3 w-3" /> Prescrição de Medicamentos
//                           </p>
//                           <p className="text-crarar-primary font-bold bg-crarar-primary/5 px-4 py-3 rounded-xl border border-crarar-primary/10">
//                             {at.medicamentos}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {(at.observacoes || at.proximo_retorno || at.obito) && (
//                     <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap gap-4 items-center">
//                       {at.observacoes && (
//                         <div className="w-full mb-2">
//                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">Observações Adicionais</p>
//                           <p className="text-slate-600 text-sm italic font-medium bg-slate-50/30 p-3 rounded-xl border border-dashed border-slate-100">"{at.observacoes}"</p>
//                         </div>
//                       )}
//                       {at.proximo_retorno && (
//                         <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
//                           <Clock className="h-3.5 w-3.5" /> Retorno: {new Date(at.proximo_retorno).toLocaleDateString('pt-BR')}
//                         </div>
//                       )}
//                       {at.obito && (
//                         <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
//                           <AlertTriangle className="h-3.5 w-3.5" /> Óbito Registrado
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {animalAtendimentos.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
//                   <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
//                     <Stethoscope className="h-8 w-8" />
//                   </div>
//                   <p className="text-slate-400 font-bold italic">Nenhum atendimento registrado para este paciente.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* NOVAS AÇÕES NA BASE DO MODAL */}
//           {tutor && (
//             <EditModal 
//               animal={animal} 
//               tutor={tutor} 
//               atendimentos={animalAtendimentos} 
//               onCloseParent={onClose}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main component for searching clinical records
// const SearchPacientes: React.FC<SearchPacientesProps> = ({ tutores, animais, atendimentos }) => {
//   const [query, setQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

//   const filtered = useMemo(() => {
//     const q = query.toLowerCase().trim();
//     return animais.filter(a => {
//       const tutor = tutores.find(t => t.id === a.tutor_id);
//       return (a.nome?.toLowerCase().includes(q) || 
//               a.especie?.toLowerCase().includes(q) || 
//               a.raca?.toLowerCase().includes(q) ||
//               tutor?.nome?.toLowerCase().includes(q));
//     });
//   }, [query, animais, tutores]);

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
//         <div className="relative">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
//           <input
//             type="text"
//             placeholder="Buscar por nome do paciente, tutor ou raça..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-base font-medium outline-none focus:bg-white focus:border-crarar-primary transition-all shadow-inner"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         {paginated.map(animal => (
//           <AnimalListItem 
//             key={animal.id} 
//             animal={animal} 
//             tutores={tutores} 
//             onViewDetails={setSelectedAnimal} 
//           />
//         ))}
//         {paginated.length === 0 && (
//           <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
//             <p className="text-slate-400 font-bold italic">Nenhum paciente encontrado.</p>
//           </div>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-4">
//           <button 
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(p => p - 1)}
//             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//           <span className="text-xs font-bold text-slate-500">{currentPage} / {totalPages}</span>
//           <button 
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(p => p + 1)}
//             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//         </div>
//       )}

//       {selectedAnimal && (
//         <AnimalDetailsModal 
//           animal={selectedAnimal} 
//           tutores={tutores} 
//           atendimentos={atendimentos} 
//           onClose={() => setSelectedAnimal(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default SearchPacientes;



import React, { useState, useMemo } from 'react';
import { 
  PawPrint, User, ShieldCheck, Clock, X, Info, Phone, Calendar, Search, ChevronLeft, ChevronRight, MapPin, AlertTriangle, Stethoscope, Pill, FileText, CheckCircle2, Edit, Trash2, Scissors
} from 'lucide-react';
import { Tutor, Animal, Atendimento } from '../types';
import EditModal from './EditModal.tsx';

interface SearchPacientesProps {
  tutores: Tutor[];
  animais: Animal[];
  atendimentos: Atendimento[];
}

const ITEMS_PER_PAGE = 20;

// Helper function to calculate age based on birth date
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

// Animal List Item component with key prop handling
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
  // Fix: Identify institutional pets by checking the tutor name, as the 'categoria' property is not in the database schema.
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

// Modal component for viewing animal clinical details
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
  
  // Verifica se o animal foi castrado em algum atendimento
  const isCastrated = animalAtendimentos.some(at => at.castracao === true);

  const handleDeleteAtendimento = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este atendimento permanentemente?")) return;
    try {
      const { supabase } = await import('../integrations/supabase/client');
      const { error } = await supabase.from('atendimentos').delete().eq('id', id);
      if (error) throw error;
      alert("Atendimento excluído com sucesso.");
      window.location.reload();
    } catch (e: any) {
      alert("Erro ao excluir: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-2 md:p-4 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[40px] bg-white shadow-2xl border border-white scrollbar-green flex flex-col">
        <div className="sticky top-0 bg-white z-20 px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-crarar-primary/10 p-2.5 text-crarar-primary">
                  <PawPrint className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  Ficha Clínica: <span className="text-crarar-primary">{animal.nome}</span>
                </h2>
              </div>
              <p className="mt-1 text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Atualizado em {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 space-y-10">
          {/* Dados do Tutor e Resumo do Animal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[32px] border border-slate-100 bg-slate-50/20 p-8 flex flex-col">
              <h3 className="mb-6 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <User className="h-4 w-4 text-crarar-primary" /> Tutor Responsável
              </h3>
              <div className="space-y-4">
                <p className="font-black text-slate-800 text-lg md:text-xl leading-tight">{tutor?.nome || 'Não Informado'}</p>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                     <Phone className="h-4 w-4 text-crarar-primary" /> {tutor?.telefone || 'N/A'}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                     <MapPin className="h-4 w-4 text-crarar-primary" /> {tutor?.endereco || 'Endereço não cadastrado'}
                   </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-100 bg-crarar-primary/[0.02] p-8 flex flex-col justify-center">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <Info className="h-4 w-4 text-crarar-primary" /> Perfil do Paciente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Espécie</p>
                  <p className="text-sm font-bold text-slate-700">{animal.especie}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Raça</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{animal.raca}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Idade</p>
                  <p className="text-sm font-bold text-slate-700">{calculateAge(animal.data_nascimento)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Castrado</p>
                  <p className={`text-sm font-bold ${isCastrated ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {isCastrated ? 'Sim' : 'Não'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="h-1.5 w-8 bg-crarar-primary rounded-full"></div>
              HISTÓRICO CLÍNICO DETALHADO
            </h3>
            
            <div className="space-y-6">
              {animalAtendimentos.map((at) => (
                <div key={at.id} className="rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md border-l-4 border-l-crarar-primary">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-xl">
                      <Calendar className="h-4 w-4 text-crarar-primary" /> {new Date(at.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-crarar-primary/5 px-4 py-2 rounded-xl border border-crarar-primary/10">
                        <Stethoscope className="h-4 w-4 text-crarar-primary" /> Dr(a). {at.veterinario}
                      </div>
                      <button 
                        onClick={() => alert("Função de edição de atendimento será implementada em breve.")}
                        className="p-2 text-slate-400 hover:text-crarar-primary hover:bg-slate-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAtendimento(at.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
                          <Info className="h-3 w-3" /> Sintomas Relatados
                        </p>
                        <p className="text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{at.sintomas}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" /> Diagnóstico & Avaliação
                        </p>
                        <p className="text-slate-900 font-bold leading-relaxed p-3 bg-white rounded-xl border border-slate-100">{at.diagnostico}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
                          <FileText className="h-3 w-3" /> Conduta & Tratamento
                        </p>
                        <p className="text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{at.tratamento}</p>
                      </div>
                      {at.medicamentos && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
                            <Pill className="h-3 w-3" /> Prescrição de Medicamentos
                          </p>
                          <p className="text-crarar-primary font-bold bg-crarar-primary/5 px-4 py-3 rounded-xl border border-crarar-primary/10">
                            {at.medicamentos}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(at.observacoes || at.proximo_retorno || at.obito || at.castracao) && (
                    <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap gap-4 items-center">
                      {at.observacoes && (
                        <div className="w-full mb-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">Observações Adicionais</p>
                          <p className="text-slate-600 text-sm italic font-medium bg-slate-50/30 p-3 rounded-xl border border-dashed border-slate-100">"{at.observacoes}"</p>
                        </div>
                      )}
                      {at.proximo_retorno && (
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                          <Clock className="h-3.5 w-3.5" /> Retorno: {new Date(at.proximo_retorno).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {at.castracao && (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                          <Scissors className="h-3.5 w-3.5" /> Castração Realizada
                        </div>
                      )}
                      {at.obito && (
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                          <AlertTriangle className="h-3.5 w-3.5" /> Óbito Registrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {animalAtendimentos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <p className="text-slate-400 font-bold italic">Nenhum atendimento registrado para este paciente.</p>
                </div>
              )}
            </div>
          </div>

          {/* NOVAS AÇÕES NA BASE DO MODAL */}
          {tutor && (
            <EditModal 
              animal={animal} 
              tutor={tutor} 
              atendimentos={animalAtendimentos} 
              onCloseParent={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main component for searching clinical records
const SearchPacientes: React.FC<SearchPacientesProps> = ({ tutores, animais, atendimentos }) => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return animais.filter(a => {
      const tutor = tutores.find(t => t.id === a.tutor_id);
      return (a.nome?.toLowerCase().includes(q) || 
              a.especie?.toLowerCase().includes(q) || 
              a.raca?.toLowerCase().includes(q) ||
              tutor?.nome?.toLowerCase().includes(q));
    });
  }, [query, animais, tutores]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
          <input
            type="text"
            placeholder="Buscar por nome do paciente, tutor ou raça..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-base font-medium outline-none focus:bg-white focus:border-crarar-primary transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paginated.map(animal => (
          <AnimalListItem 
            key={animal.id} 
            animal={animal} 
            tutores={tutores} 
            onViewDetails={setSelectedAnimal} 
          />
        ))}
        {paginated.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">Nenhum paciente encontrado.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-slate-500">{currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {selectedAnimal && (
        <AnimalDetailsModal 
          animal={selectedAnimal} 
          tutores={tutores} 
          atendimentos={atendimentos} 
          onClose={() => setSelectedAnimal(null)} 
        />
      )}
    </div>
  );
};

export default SearchPacientes;
