
// import React, { useState, useEffect } from 'react';
// import { PawPrint, Calendar, Weight, User, Save, Info, ShieldCheck } from 'lucide-react';
// import { Tutor, Animal } from '../types';

// interface AnimalFormProps {
//   tutores: Tutor[];
//   onSave: (animal: Omit<Animal, 'id' | 'data_adesao'>) => Promise<string>;
// }

// const AnimalForm: React.FC<AnimalFormProps> = ({ tutores, onSave }) => {
//   const [formData, setFormData] = useState({
//     tutor_id: '',
//     nome: '',
//     especie: 'Cão',
//     raca: '',
//     data_nascimento: '',
//     sexo: 'Macho',
//     cor: '',
//     peso: 0,
//     categoria: 'normal' as 'crarar' | 'normal'
//   });
//   const [loading, setLoading] = useState(false);

//   // Monitora a mudança de categoria para automatizar a seleção do tutor institucional
//   useEffect(() => {
//     if (formData.categoria === 'crarar') {
//       const crararTutor = tutores.find(t => t.nome.toUpperCase() === 'CRARAR');
//       if (crararTutor) {
//         setFormData(prev => ({ ...prev, tutor_id: crararTutor.id }));
//       }
//     } else {
//       // Opcional: limpa o tutor se mudar de CRARAR para normal para evitar erros
//       const crararTutor = tutores.find(t => t.nome.toUpperCase() === 'CRARAR');
//       if (formData.tutor_id === crararTutor?.id) {
//         setFormData(prev => ({ ...prev, tutor_id: '' }));
//       }
//     }
//   }, [formData.categoria, tutores]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSave(formData);
//       setFormData({
//         tutor_id: '',
//         nome: '',
//         especie: 'Cão',
//         raca: '',
//         data_nascimento: '',
//         sexo: 'Macho',
//         cor: '',
//         peso: 0,
//         categoria: 'normal'
//       });
//       alert("Animal cadastrado com sucesso!");
//     } catch (err) {
//       alert("Erro ao cadastrar animal.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const speciesList = ['Cão', 'Gato', 'Ave', 'Outro'];

//   return (
//     <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           <div className="rounded-xl bg-green-500/10 p-2">
//             <PawPrint className="h-6 w-6 text-green-600" />
//           </div>
//           <h3 className="text-lg md:text-xl font-bold text-crarar-text">Novo Pet</h3>
//         </div>
        
//         <div className="flex items-center gap-1 rounded-xl bg-gray-50 p-1 ring-1 ring-gray-200">
//           <button
//             type="button"
//             onClick={() => setFormData({ ...formData, categoria: 'normal' })}
//             className={`rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
//               formData.categoria === 'normal' ? 'bg-white text-crarar-text shadow-sm' : 'text-gray-400'
//             }`}
//           >
//             Comum
//           </button>
//           <button
//             type="button"
//             onClick={() => setFormData({ ...formData, categoria: 'crarar' })}
//             className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
//               formData.categoria === 'crarar' ? 'bg-crarar-primary text-white shadow-sm' : 'text-gray-400'
//             }`}
//           >
//             <ShieldCheck className="h-3 w-3" />
//             CRARAR
//           </button>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
//         <div>
//           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//             {formData.categoria === 'crarar' ? 'Responsável Institucional *' : 'Tutor Responsável *'}
//           </label>
//           <div className="relative">
//             <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <select
//               required
//               value={formData.tutor_id}
//               onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
//               disabled={formData.categoria === 'crarar'}
//               className={`w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all ${
//                 formData.categoria === 'crarar' ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               <option value="">Selecione...</option>
//               {tutores.map((t) => (
//                 <option key={t.id} value={t.id}>{t.nome}</option>
//               ))}
//             </select>
//             {formData.categoria === 'crarar' && (
//               <div className="mt-1 text-[10px] text-crarar-primary font-medium flex items-center gap-1">
//                 <ShieldCheck className="h-3 w-3" /> Responsável fixo para categoria CRARAR.
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Pet *</label>
//             <div className="relative">
//               <Info className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="text"
//                 value={formData.nome}
//                 onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="Ex: Rex"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Espécie *</label>
//             <div className="flex flex-wrap gap-2">
//               {speciesList.map((s) => (
//                 <button
//                   key={s}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, especie: s })}
//                   className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all ${
//                     formData.especie === s
//                       ? 'bg-crarar-primary text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Raça *</label>
//             <input
//               required
//               type="text"
//               value={formData.raca}
//               onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
//               className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//               placeholder="Ex: Labrador"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nascimento *</label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="date"
//                 value={formData.data_nascimento}
//                 onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sexo *</label>
//             <div className="flex gap-4 p-2 bg-gray-50 rounded-xl border">
//               <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="sexo"
//                   value="Macho"
//                   checked={formData.sexo === 'Macho'}
//                   onChange={() => setFormData({ ...formData, sexo: 'Macho' })}
//                   className="h-4 w-4 text-crarar-primary focus:ring-crarar-primary"
//                 />
//                 Macho
//               </label>
//               <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="sexo"
//                   value="Fêmea"
//                   checked={formData.sexo === 'Fêmea'}
//                   onChange={() => setFormData({ ...formData, sexo: 'Fêmea' })}
//                   className="h-4 w-4 text-crarar-primary focus:ring-crarar-primary"
//                 />
//                 Fêmea
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Peso (kg) *</label>
//             <div className="relative">
//               <Weight className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="number"
//                 step="0.1"
//                 value={formData.peso}
//                 onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="0.0"
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           disabled={loading || tutores.length === 0}
//           type="submit"
//           className="flex w-full items-center justify-center gap-2 rounded-xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50 mt-4"
//         >
//           {loading ? (
//             <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//           ) : (
//             <>
//               <Save className="h-5 w-5" />
//               Salvar Animal
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import {
  PawPrint,
  Calendar,
  Weight,
  User,
  Save,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Tutor, Animal } from "../types";

interface AnimalFormProps {
  tutores: Tutor[];
  onSave: (animal: Omit<Animal, "id" | "data_adesao">) => Promise<string>;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ tutores, onSave }) => {
  // Estado local para controle da UI (não enviado diretamente para o banco de dados)
  const [uiCategory, setUiCategory] = useState<"normal" | "crarar">("normal");

  const [formData, setFormData] = useState({
    tutor_id: "",
    nome: "",
    especie: "Cão",
    raca: "",
    data_nascimento: "",
    sexo: "Macho",
    peso: 0,
  });
  const [loading, setLoading] = useState(false);

  // Seleciona automaticamente o tutor institucional quando a categoria UI muda
  useEffect(() => {
    if (uiCategory === "crarar") {
      const crararTutor = tutores.find(
        (t) => t.nome.toUpperCase() === "CRARAR",
      );
      if (crararTutor) {
        setFormData((prev) => ({ ...prev, tutor_id: crararTutor.id }));
      }
    } else {
      const crararTutor = tutores.find(
        (t) => t.nome.toUpperCase() === "CRARAR",
      );
      if (formData.tutor_id === crararTutor?.id) {
        setFormData((prev) => ({ ...prev, tutor_id: "" }));
      }
    }
  }, [uiCategory, tutores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tutor_id) {
      alert("Por favor, selecione um tutor ou responsável.");
      return;
    }

    setLoading(true);
    try {
      // Payload limpo contendo os campos necessários.
      // Enviamos 'cor' como string vazia para satisfazer o NOT NULL constraint do banco.
      const payload = {
        tutor_id: formData.tutor_id,
        nome: formData.nome.trim(),
        especie: formData.especie,
        raca: formData.raca.trim(),
        cor: "", // Valor padrão para evitar erro de NOT NULL no banco de dados
        data_nascimento: formData.data_nascimento,
        sexo: formData.sexo,
        peso: isNaN(formData.peso) ? 0 : formData.peso,
      };

      await onSave(payload);

      setFormData({
        tutor_id: "",
        nome: "",
        especie: "Cão",
        raca: "",
        data_nascimento: "",
        sexo: "Macho",
        peso: 0,
      });
      setUiCategory("normal");
      alert("Animal cadastrado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao cadastrar animal:", err);
      alert(
        `Erro ao cadastrar animal: ${err.message || "Verifique os dados e tente novamente."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const speciesList = ["Cão", "Gato", "Ave", "Outro"];

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-500/10 p-2">
            <PawPrint className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-crarar-text">
            Novo Pet
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-gray-50 p-1 ring-1 ring-gray-200">
          <button
            type="button"
            onClick={() => setUiCategory("normal")}
            className={`rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
              uiCategory === "normal"
                ? "bg-white text-crarar-text shadow-sm"
                : "text-gray-400"
            }`}
          >
            Comum
          </button>
          <button
            type="button"
            onClick={() => setUiCategory("crarar")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
              uiCategory === "crarar"
                ? "bg-crarar-primary text-white shadow-sm"
                : "text-gray-400"
            }`}
          >
            <ShieldCheck className="h-3 w-3" />
            CRARAR
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {uiCategory === "crarar"
              ? "Responsável Institucional *"
              : "Tutor Responsável *"}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              required
              value={formData.tutor_id}
              onChange={(e) =>
                setFormData({ ...formData, tutor_id: e.target.value })
              }
              disabled={uiCategory === "crarar"}
              className={`w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all ${
                uiCategory === "crarar" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Selecione...</option>
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
          {/* Nome do Pet na Esquerda */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nome do Pet *
            </label>
            <div className="relative">
              <Info className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="Ex: Rex"
              />
            </div>
          </div>

          {/* Espécie na Direita */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Espécie *
            </label>
            <div className="flex flex-wrap gap-2">
              {speciesList.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, especie: s })}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all ${
                    formData.especie === s
                      ? "bg-crarar-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Raça *
            </label>
            <input
              required
              type="text"
              value={formData.raca}
              onChange={(e) =>
                setFormData({ ...formData, raca: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
              placeholder="Ex: Labrador"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nascimento *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="date"
                value={formData.data_nascimento}
                onChange={(e) =>
                  setFormData({ ...formData, data_nascimento: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Sexo *
            </label>
            <div className="flex gap-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Macho"
                  checked={formData.sexo === "Macho"}
                  onChange={() => setFormData({ ...formData, sexo: "Macho" })}
                  className="h-4 w-4 text-crarar-primary"
                />
                Macho
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Fêmea"
                  checked={formData.sexo === "Fêmea"}
                  onChange={() => setFormData({ ...formData, sexo: "Fêmea" })}
                  className="h-4 w-4 text-crarar-primary"
                />
                Fêmea
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Peso (kg) *
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="number"
                step="0.01"
                value={formData.peso || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFormData({ ...formData, peso: isNaN(val) ? 0 : val });
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading || tutores.length === 0}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Salvar Animal
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnimalForm;
// export default AnimalForm;
