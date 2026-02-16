
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { Stethoscope, Calendar, User, Save, FileText, Pill, AlertTriangle, Clock, Search, ChevronDown, CheckCircle2, X } from 'lucide-react';
// import { Animal, Atendimento, Tutor } from '../types';

// interface AtendimentoFormProps {
//   animais: Pick<Animal, 'id' | 'nome' | 'especie' | 'tutor_id'>[];
//   tutores: Tutor[];
//   onSave: (att: Omit<Atendimento, 'id'>) => Promise<string>;
// }

// const AtendimentoForm: React.FC<AtendimentoFormProps> = ({ animais, tutores, onSave }) => {
//   const [formData, setFormData] = useState({
//     animal_id: '',
//     data: new Date().toISOString().split('T')[0],
//     veterinario: '',
//     sintomas: '',
//     diagnostico: '',
//     tratamento: '',
//     medicamentos: '',
//     observacoes: '',
//     proximo_retorno: '',
//     obito: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Fecha o dropdown ao clicar fora
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const filteredAnimais = useMemo(() => {
//     if (!searchTerm.trim()) return animais.slice(0, 10);
//     const lowerQuery = searchTerm.toLowerCase();
//     return animais.filter(animal => {
//       const tutor = tutores.find(t => t.id === animal.tutor_id);
//       return (
//         animal.nome.toLowerCase().includes(lowerQuery) ||
//         animal.especie.toLowerCase().includes(lowerQuery) ||
//         (tutor?.nome && tutor.nome.toLowerCase().includes(lowerQuery))
//       );
//     }).slice(0, 15);
//   }, [searchTerm, animais, tutores]);

//   const selectedAnimal = useMemo(() => 
//     animais.find(a => a.id === formData.animal_id), 
//   [formData.animal_id, animais]);

//   const selectedTutor = useMemo(() => 
//     selectedAnimal ? tutores.find(t => t.id === selectedAnimal.tutor_id) : null,
//   [selectedAnimal, tutores]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.animal_id) {
//       alert("Por favor, selecione um paciente.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         proximo_retorno: formData.proximo_retorno === "" ? null : formData.proximo_retorno,
//         data: formData.data === "" ? new Date().toISOString().split('T')[0] : formData.data
//       };

//       await onSave(payload as any);
      
//       setFormData({
//         animal_id: '',
//         data: new Date().toISOString().split('T')[0],
//         veterinario: '',
//         sintomas: '',
//         diagnostico: '',
//         tratamento: '',
//         medicamentos: '',
//         observacoes: '',
//         proximo_retorno: '',
//         obito: false
//       });
//       setSearchTerm('');
//       alert("Atendimento registrado com sucesso.");
//     } catch (error: any) {
//       console.error("Erro ao salvar atendimento:", error);
//       alert("Erro ao salvar: " + (error.message || "Verifique os dados informados."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-4xl rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
//       <div className="mb-6 flex items-center gap-3">
//         <div className="rounded-xl bg-purple-500/10 p-2">
//           <Stethoscope className="h-6 w-6 text-purple-600" />
//         </div>
//         <h3 className="text-xl font-bold text-crarar-text dark:text-white">Ficha de Atendimento</h3>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* BUSCA DE ANIMAL (CUSTOM SEARCHBAR) */}
//           <div className="md:col-span-1 relative" ref={dropdownRef}>
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Buscar Paciente (Pet) *</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Nome do pet ou tutor..."
//                 value={isDropdownOpen ? searchTerm : (selectedAnimal ? `${selectedAnimal.nome} (${selectedTutor?.nome || 'Sem tutor'})` : searchTerm)}
//                 onFocus={() => {
//                   setIsDropdownOpen(true);
//                   if (selectedAnimal) setSearchTerm('');
//                 }}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//               <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//             </div>

//             {isDropdownOpen && (
//               <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in scrollbar-green">
//                 {filteredAnimais.length > 0 ? (
//                   filteredAnimais.map(a => {
//                     const tutor = tutores.find(t => t.id === a.tutor_id);
//                     return (
//                       <div
//                         key={a.id}
//                         onClick={() => {
//                           setFormData({ ...formData, animal_id: a.id });
//                           setSearchTerm(`${a.nome} (${tutor?.nome || 'Sem tutor'})`);
//                           setIsDropdownOpen(false);
//                         }}
//                         className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-bold text-sm text-slate-900 dark:text-white">{a.nome}</span>
//                           <span className="text-[10px] font-black uppercase text-crarar-primary bg-crarar-primary/5 px-2 py-0.5 rounded-full">{a.especie}</span>
//                         </div>
//                         <span className="text-xs text-slate-500 font-medium">Tutor: {tutor?.nome || 'Não identificado'}</span>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="p-6 text-center text-slate-400 text-sm font-medium italic">
//                     Nenhum paciente encontrado.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Data da Consulta *</label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="date"
//                 value={formData.data}
//                 onChange={(e) => setFormData({ ...formData, data: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Veterinário Responsável *</label>
//             <div className="relative">
//               <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="text"
//                 value={formData.veterinario}
//                 onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                 placeholder="Dr(a). Nome Sobrenome"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Sintomas Relatados *</label>
//             <textarea
//               required
//               rows={3}
//               value={formData.sintomas}
//               onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
//               className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               placeholder="Descreva os sinais clínicos..."
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Diagnóstico &amp; Avaliação *</label>
//             <textarea
//               required
//               rows={3}
//               value={formData.diagnostico}
//               onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
//               className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               placeholder="Conclusão médica..."
//             />
//           </div>

//           <div className="md:col-span-1">
//              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Prescrição &amp; Medicamentos</label>
//              <div className="relative">
//                 <Pill className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <textarea
//                   rows={4}
//                   value={formData.medicamentos}
//                   onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
//                   className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                   placeholder="Liste os remédios e dosagens..."
//                 />
//              </div>
//           </div>

//           <div className="md:col-span-1">
//              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tratamento Recomendado *</label>
//              <div className="relative">
//                 <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <textarea
//                   required
//                   rows={4}
//                   value={formData.tratamento}
//                   onChange={(e) => setFormData({ ...formData, tratamento: e.target.value })}
//                   className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                   placeholder="Orientações de cuidados..."
//                 />
//              </div>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Próximo Retorno (Opcional)</label>
//             <div className="relative">
//               <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="date"
//                 value={formData.proximo_retorno}
//                 onChange={(e) => setFormData({ ...formData, proximo_retorno: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-6 pt-4">
//           <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
//                   <AlertTriangle className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-widest">Registrar Óbito</p>
//                   <p className="text-xs font-medium text-red-700 dark:text-red-300/70">Marque apenas se o óbito for confirmado neste atendimento.</p>
//                 </div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input 
//                   type="checkbox" 
//                   checked={formData.obito}
//                   onChange={(e) => setFormData({ ...formData, obito: e.target.checked })}
//                   className="sr-only peer" 
//                 />
//                 <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
//               </label>
//             </div>
//           </div>

//           <button
//             disabled={loading || animais.length === 0}
//             type="submit"
//             className="flex w-full items-center justify-center gap-2 rounded-2xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50"
//           >
//             {loading ? (
//               <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//             ) : (
//               <>
//                 <Save className="h-5 w-5" />
//                 Finalizar Ficha Clínica
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AtendimentoForm;




// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { Stethoscope, Calendar, User, Save, FileText, Pill, AlertTriangle, Clock, Search, ChevronDown, CheckCircle2, X } from 'lucide-react';
// import { Animal, Atendimento, Tutor } from '../types';

// interface AtendimentoFormProps {
//   animais: Pick<Animal, 'id' | 'nome' | 'especie' | 'tutor_id'>[];
//   tutores: Tutor[];
//   onSave: (att: Omit<Atendimento, 'id'>) => Promise<string>;
// }

// const AtendimentoForm: React.FC<AtendimentoFormProps> = ({ animais, tutores, onSave }) => {
//   const [formData, setFormData] = useState({
//     animal_id: '',
//     data: new Date().toISOString().split('T')[0],
//     veterinario: '',
//     sintomas: '',
//     diagnostico: '',
//     tratamento: '',
//     medicamentos: '',
//     observacoes: '',
//     proximo_retorno: '',
//     obito: false,
//     castracao: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Fecha o dropdown ao clicar fora
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const filteredAnimais = useMemo(() => {
//     if (!searchTerm.trim()) return animais.slice(0, 10);
//     const lowerQuery = searchTerm.toLowerCase();
//     return animais.filter(animal => {
//       const tutor = tutores.find(t => t.id === animal.tutor_id);
//       return (
//         animal.nome.toLowerCase().includes(lowerQuery) ||
//         animal.especie.toLowerCase().includes(lowerQuery) ||
//         (tutor?.nome && tutor.nome.toLowerCase().includes(lowerQuery))
//       );
//     }).slice(0, 15);
//   }, [searchTerm, animais, tutores]);

//   const selectedAnimal = useMemo(() => 
//     animais.find(a => a.id === formData.animal_id), 
//   [formData.animal_id, animais]);

//   const selectedTutor = useMemo(() => 
//     selectedAnimal ? tutores.find(t => t.id === selectedAnimal.tutor_id) : null,
//   [selectedAnimal, tutores]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.animal_id) {
//       alert("Por favor, selecione um paciente.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         proximo_retorno: formData.proximo_retorno === "" ? null : formData.proximo_retorno,
//         data: formData.data === "" ? new Date().toISOString().split('T')[0] : formData.data
//       };

//       await onSave(payload as any);
      
//       setFormData({
//         animal_id: '',
//         data: new Date().toISOString().split('T')[0],
//         veterinario: '',
//         sintomas: '',
//         diagnostico: '',
//         tratamento: '',
//         medicamentos: '',
//         observacoes: '',
//         proximo_retorno: '',
//         obito: false,
//         castracao: false
//       });
//       setSearchTerm('');
//       alert("Atendimento registrado com sucesso.");
//     } catch (error: any) {
//       console.error("Erro ao salvar atendimento:", error);
//       alert("Erro ao salvar: " + (error.message || "Verifique os dados informados."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-4xl rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
//       <div className="mb-6 flex items-center gap-3">
//         <div className="rounded-xl bg-purple-500/10 p-2">
//           <Stethoscope className="h-6 w-6 text-purple-600" />
//         </div>
//         <h3 className="text-xl font-bold text-crarar-text dark:text-white">Ficha de Atendimento</h3>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* BUSCA DE ANIMAL (CUSTOM SEARCHBAR) */}
//           <div className="md:col-span-1 relative" ref={dropdownRef}>
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Buscar Paciente (Pet) *</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Nome do pet ou tutor..."
//                 value={isDropdownOpen ? searchTerm : (selectedAnimal ? `${selectedAnimal.nome} (${selectedTutor?.nome || 'Sem tutor'})` : searchTerm)}
//                 onFocus={() => {
//                   setIsDropdownOpen(true);
//                   if (selectedAnimal) setSearchTerm('');
//                 }}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//               <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//             </div>

//             {isDropdownOpen && (
//               <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in scrollbar-green">
//                 {filteredAnimais.length > 0 ? (
//                   filteredAnimais.map(a => {
//                     const tutor = tutores.find(t => t.id === a.tutor_id);
//                     return (
//                       <div
//                         key={a.id}
//                         onClick={() => {
//                           setFormData({ ...formData, animal_id: a.id });
//                           setSearchTerm(`${a.nome} (${tutor?.nome || 'Sem tutor'})`);
//                           setIsDropdownOpen(false);
//                         }}
//                         className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-bold text-sm text-slate-900 dark:text-white">{a.nome}</span>
//                           <span className="text-[10px] font-black uppercase text-crarar-primary bg-crarar-primary/5 px-2 py-0.5 rounded-full">{a.especie}</span>
//                         </div>
//                         <span className="text-xs text-slate-500 font-medium">Tutor: {tutor?.nome || 'Não identificado'}</span>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="p-6 text-center text-slate-400 text-sm font-medium italic">
//                     Nenhum paciente encontrado.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Data da Consulta *</label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="date"
//                 value={formData.data}
//                 onChange={(e) => setFormData({ ...formData, data: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Veterinário Responsável *</label>
//             <div className="relative">
//               <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="text"
//                 value={formData.veterinario}
//                 onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                 placeholder="Dr(a). Nome Sobrenome"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Sintomas Relatados *</label>
//             <textarea
//               required
//               rows={3}
//               value={formData.sintomas}
//               onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
//               className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               placeholder="Descreva os sinais clínicos..."
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Diagnóstico &amp; Avaliação *</label>
//             <textarea
//               required
//               rows={3}
//               value={formData.diagnostico}
//               onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
//               className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               placeholder="Conclusão médica..."
//             />
//           </div>

//           <div className="md:col-span-1">
//              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Prescrição &amp; Medicamentos</label>
//              <div className="relative">
//                 <Pill className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <textarea
//                   rows={4}
//                   value={formData.medicamentos}
//                   onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
//                   className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                   placeholder="Liste os remédios e dosagens..."
//                 />
//              </div>
//           </div>

//           <div className="md:col-span-1">
//              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tratamento Recomendado *</label>
//              <div className="relative">
//                 <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <textarea
//                   required
//                   rows={4}
//                   value={formData.tratamento}
//                   onChange={(e) => setFormData({ ...formData, tratamento: e.target.value })}
//                   className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//                   placeholder="Orientações de cuidados..."
//                 />
//              </div>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Próximo Retorno (Opcional)</label>
//             <div className="relative">
//               <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="date"
//                 value={formData.proximo_retorno}
//                 onChange={(e) => setFormData({ ...formData, proximo_retorno: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-1 flex items-end pb-1">
//              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 w-full h-[48px]">
//                 <input 
//                   type="checkbox" 
//                   id="checkbox-castracao"
//                   checked={formData.castracao}
//                   onChange={(e) => setFormData({ ...formData, castracao: e.target.checked })}
//                   className="h-5 w-5 rounded border-slate-300 text-crarar-primary focus:ring-crarar-primary transition-all cursor-pointer" 
//                 />
//                 <label htmlFor="checkbox-castracao" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Castrado?</label>
//              </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-6 pt-4">
//           <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
//                   <AlertTriangle className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-widest">Registrar Óbito</p>
//                   <p className="text-xs font-medium text-red-700 dark:text-red-300/70">Marque apenas se o óbito for confirmado neste atendimento.</p>
//                 </div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input 
//                   type="checkbox" 
//                   checked={formData.obito}
//                   onChange={(e) => setFormData({ ...formData, obito: e.target.checked })}
//                   className="sr-only peer" 
//                 />
//                 <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
//               </label>
//             </div>
//           </div>

//           <button
//             disabled={loading || animais.length === 0}
//             type="submit"
//             className="flex w-full items-center justify-center gap-2 rounded-2xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50"
//           >
//             {loading ? (
//               <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//             ) : (
//               <>
//                 <Save className="h-5 w-5" />
//                 Finalizar Ficha Clínica
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AtendimentoForm;



import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Stethoscope, Calendar, User, Save, FileText, Pill, AlertTriangle, Clock, Search, ChevronDown, CheckCircle2, X, Plus, Trash2, Package } from 'lucide-react';
import { Animal, Atendimento, Tutor, Produto, MedicamentoUsado } from '../types';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { supabase } from '../integrations/supabase/client';

interface AtendimentoFormProps {
  animais: Pick<Animal, 'id' | 'nome' | 'especie' | 'tutor_id'>[];
  tutores: Tutor[];
  onSave: (att: Omit<Atendimento, 'id'>) => Promise<string>;
}

const UNIDADES_MEDICAMENTOS = ['g', 'mg', 'mcg', 'ml', 'un', 'comprimido', 'ampola', 'frasco', 'dose', 'gota', 'bisnaga'];

const AtendimentoForm: React.FC<AtendimentoFormProps> = ({ animais, tutores, onSave }) => {
  const { produtos, reloadData } = useSupabaseData();
  const [formData, setFormData] = useState({
    animal_id: '',
    data: new Date().toISOString().split('T')[0],
    veterinario: '',
    sintomas: '',
    diagnostico: '',
    tratamento: '',
    medicamentos: '',
    observacoes: '',
    proximo_retorno: '',
    obito: false,
    castracao: false
  });
  
  const [medicamentosUsados, setMedicamentosUsados] = useState<MedicamentoUsado[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Estados para seleção de medicamentos do inventário
  const [showMedSelector, setShowMedSelector] = useState(false);
  const [medSearch, setMedSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState<Produto | null>(null);
  const [usedQty, setUsedQty] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState('un');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const medSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (medSelectorRef.current && !medSelectorRef.current.contains(event.target as Node)) {
        setShowMedSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAnimais = useMemo(() => {
    if (!searchTerm.trim()) return animais.slice(0, 10);
    const lowerQuery = searchTerm.toLowerCase();
    return animais.filter(animal => {
      const tutor = tutores.find(t => t.id === animal.tutor_id);
      return (
        animal.nome.toLowerCase().includes(lowerQuery) ||
        animal.especie.toLowerCase().includes(lowerQuery) ||
        (tutor?.nome && tutor.nome.toLowerCase().includes(lowerQuery))
      );
    }).slice(0, 15);
  }, [searchTerm, animais, tutores]);

  const filteredProdutos = useMemo(() => {
    const lowerQuery = medSearch.toLowerCase();
    if (!lowerQuery) return produtos.slice(0, 20); // Retorna os primeiros 20 itens se não houver busca
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(lowerQuery) || 
      (p.principio_ativo && p.principio_ativo.toLowerCase().includes(lowerQuery))
    ).slice(0, 20);
  }, [medSearch, produtos]);

  const selectedAnimal = useMemo(() => 
    animais.find(a => a.id === formData.animal_id), 
  [formData.animal_id, animais]);

  const selectedTutor = useMemo(() => 
    selectedAnimal ? tutores.find(t => t.id === selectedAnimal.tutor_id) : null,
  [selectedAnimal, tutores]);

  const handleAddMedicamento = () => {
    if (!selectedMed || usedQty <= 0) return;
    
    const novo: MedicamentoUsado = {
      produto_id: selectedMed.id,
      nome: selectedMed.nome,
      quantidade: usedQty,
      unidade: selectedUnit
    };

    setMedicamentosUsados([...medicamentosUsados, novo]);
    setSelectedMed(null);
    setUsedQty(0);
    setMedSearch('');
    setShowMedSelector(false);
  };

  const removeMedicamento = (idx: number) => {
    setMedicamentosUsados(medicamentosUsados.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animal_id) {
      alert("Por favor, selecione um paciente.");
      return;
    }

    setLoading(true);
    try {
      // 1. Salvar o atendimento usando 'medicamentos_json'
      const payload = {
        ...formData,
        medicamentos_json: medicamentosUsados,
        proximo_retorno: formData.proximo_retorno === "" ? null : formData.proximo_retorno,
        data: formData.data === "" ? new Date().toISOString().split('T')[0] : formData.data
      };

      await onSave(payload as any);
      
      // 2. Subtração certeira: Busca a quantidade ATUAL do banco para cada item antes de subtrair
      for (const med of medicamentosUsados) {
        const { data: currentProduct, error: fetchError } = await supabase
          .from('produtos')
          .select('quantidade')
          .eq('id', med.produto_id)
          .single();

        if (fetchError || !currentProduct) {
          console.warn(`Produto ${med.nome} não encontrado para atualização de estoque.`);
          continue;
        }

        const novaQtd = currentProduct.quantidade - med.quantidade;
        
        await supabase
          .from('produtos')
          .update({ quantidade: Math.max(0, novaQtd) })
          .eq('id', med.produto_id);
      }

      // Sincroniza o estado local do inventário
      await reloadData();

      // Resetar formulário
      setFormData({
        animal_id: '',
        data: new Date().toISOString().split('T')[0],
        veterinario: '',
        sintomas: '',
        diagnostico: '',
        tratamento: '',
        medicamentos: '',
        observacoes: '',
        proximo_retorno: '',
        obito: false,
        castracao: false
      });
      setMedicamentosUsados([]);
      setSearchTerm('');
      alert("Atendimento registrado e estoque atualizado com sucesso.");
    } catch (error: any) {
      console.error("Erro ao salvar atendimento:", error);
      alert("Erro ao salvar: " + (error.message || "Verifique a estrutura das colunas no banco."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/10 p-2">
          <Stethoscope className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-crarar-text dark:text-white">Ficha de Atendimento</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* BUSCA DE ANIMAL */}
          <div className="md:col-span-1 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Buscar Paciente (Pet) *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nome do pet ou tutor..."
                value={isDropdownOpen ? searchTerm : (selectedAnimal ? `${selectedAnimal.nome} (${selectedTutor?.nome || 'Sem tutor'})` : searchTerm)}
                onFocus={() => {
                  setIsDropdownOpen(true);
                  if (selectedAnimal) setSearchTerm('');
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
              />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in scrollbar-green">
                {filteredAnimais.length > 0 ? (
                  filteredAnimais.map(a => {
                    const tutor = tutores.find(t => t.id === a.tutor_id);
                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          setFormData({ ...formData, animal_id: a.id });
                          setSearchTerm(`${a.nome} (${tutor?.nome || 'Sem tutor'})`);
                          setIsDropdownOpen(false);
                        }}
                        className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{a.nome}</span>
                          <span className="text-[10px] font-black uppercase text-crarar-primary bg-crarar-primary/5 px-2 py-0.5 rounded-full">{a.especie}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Tutor: {tutor?.nome || 'Não identificado'}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm font-medium italic">
                    Nenhum paciente encontrado.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Data da Consulta *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Veterinário Responsável *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={formData.veterinario}
                onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
                placeholder="Dr(a). Nome Sobrenome"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Sintomas Relatados *</label>
            <textarea
              required
              rows={3}
              value={formData.sintomas}
              onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
              placeholder="Descreva os sinais clínicos..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Diagnóstico &amp; Avaliação *</label>
            <textarea
              required
              rows={3}
              value={formData.diagnostico}
              onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
              placeholder="Conclusão médica..."
            />
          </div>

          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Prescrição &amp; Medicamentos</label>
             <div className="relative">
                <Pill className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  rows={4}
                  value={formData.medicamentos}
                  onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
                  placeholder="Liste os remédios e dosagens..."
                />
             </div>
          </div>

          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tratamento Recomendado *</label>
             <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  required
                  rows={4}
                  value={formData.tratamento}
                  onChange={(e) => setFormData({ ...formData, tratamento: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 p-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
                  placeholder="Orientações de cuidados..."
                />
             </div>
          </div>
          
          {/* SEÇÃO: MEDICAMENTOS USADOS (COM SUBTRAÇÃO CERTEIRA) */}
          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                   <Package className="h-5 w-5 text-emerald-600" />
                   <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Medicamentos Usados (Inventário)</h4>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setMedSearch('');
                    setSelectedMed(null);
                    setShowMedSelector(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 text-[10px] font-black text-emerald-600 uppercase transition-all hover:bg-emerald-100"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Insumo
                </button>
             </div>

             <div className="space-y-2">
                {medicamentosUsados.length > 0 ? (
                  medicamentosUsados.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-800 animate-fade-in">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{med.nome}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dedução: {med.quantidade} {med.unidade}</span>
                       </div>
                       <button 
                         type="button"
                         onClick={() => removeMedicamento(idx)}
                         className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    Nenhum insumo registrado neste atendimento.
                  </div>
                )}
             </div>

             {showMedSelector && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                 <div ref={medSelectorRef} className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl animate-slide-up border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh]">
                    <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
                       <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Selecionar Insumo</h4>
                       <button onClick={() => { setShowMedSelector(false); setSelectedMed(null); }} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
                    </div>

                    <div className="px-8 pb-8 space-y-4 overflow-hidden flex flex-col">
                       <div className="relative shrink-0">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input 
                            type="text"
                            placeholder="Pesquisar no inventário..."
                            value={medSearch}
                            onChange={(e) => setMedSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 pl-10 pr-4 text-sm font-medium outline-none text-slate-900 dark:text-white"
                          />
                       </div>

                       {/* LISTA DE PRODUTOS DISPONÍVEIS */}
                       {!selectedMed && (
                         <div className="flex-1 overflow-y-auto pr-1 scrollbar-green space-y-1 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50">
                            {filteredProdutos.length > 0 ? (
                              filteredProdutos.map(p => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => { 
                                    setSelectedMed(p); 
                                    setMedSearch(p.nome); 
                                    setSelectedUnit(p.unidade || 'un');
                                  }}
                                  className="flex w-full flex-col px-4 py-3 hover:bg-white dark:hover:bg-slate-900 text-left border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 transition-colors"
                                >
                                   <div className="flex items-center justify-between w-full">
                                      <span className="text-xs font-black text-slate-900 dark:text-white">{p.nome}</span>
                                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.quantidade <= p.minimo ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                        Estoque: {p.quantidade}
                                      </span>
                                   </div>
                                   <span className="text-[10px] text-slate-400 font-medium">{p.principio_ativo || 'Sem princípio ativo listado'} • {p.unidade}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                                Nenhum insumo encontrado no inventário estratégico.
                              </div>
                            )}
                         </div>
                       )}

                       {/* CONFIGURAÇÃO DO ITEM SELECIONADO */}
                       {selectedMed && (
                         <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 space-y-5 animate-fade-in">
                            <div className="flex justify-between items-start">
                               <div>
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Item Selecionado para Uso</p>
                                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedMed.nome}</p>
                                  <p className="text-[10px] text-slate-500 font-medium">Disponível: {selectedMed.quantidade} {selectedMed.unidade}</p>
                               </div>
                               <button onClick={() => setSelectedMed(null)} className="text-slate-400 hover:text-red-500 p-1"><X className="h-5 w-5" /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <div className="flex-1">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Qtd. Utilizada</label>
                                  <input 
                                    type="number"
                                    step="0.01"
                                    autoFocus
                                    value={usedQty === 0 ? '' : usedQty}
                                    onChange={(e) => setUsedQty(parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="0.00"
                                  />
                               </div>
                               <div className="flex-1">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidade</label>
                                  <select
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm font-black text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-emerald-500"
                                  >
                                    {UNIDADES_MEDICAMENTOS.map(u => <option key={u} value={u}>{u}</option>)}
                                  </select>
                               </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddMedicamento}
                              className="w-full py-4 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                            >
                              Vincular ao Atendimento
                            </button>
                         </div>
                       )}
                    </div>
                 </div>
               </div>
             )}
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Próximo Retorno (Opcional)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.proximo_retorno}
                onChange={(e) => setFormData({ ...formData, proximo_retorno: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex items-end pb-1">
             <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 w-full h-[48px]">
                <input 
                  type="checkbox" 
                  id="checkbox-castracao"
                  checked={formData.castracao}
                  onChange={(e) => setFormData({ ...formData, castracao: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-crarar-primary focus:ring-crarar-primary transition-all cursor-pointer" 
                />
                <label htmlFor="checkbox-castracao" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Castrado?</label>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-widest">Registrar Óbito</p>
                  <p className="text-xs font-medium text-red-700 dark:text-red-300/70">Marque apenas se o óbito for confirmado neste atendimento.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.obito}
                  onChange={(e) => setFormData({ ...formData, obito: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>

          <button
            disabled={loading || animais.length === 0}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 transition-all hover:bg-crarar-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Finalizar Ficha Clínica
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AtendimentoForm;
