
// import React, { useState } from 'react';
// import { User, Phone, Mail, MapPin, CreditCard, Save } from 'lucide-react';
// import { Tutor } from '../types';

// interface TutorFormProps {
//   onSave: (tutor: Omit<Tutor, 'id'>) => Promise<string>;
// }

// const TutorForm: React.FC<TutorFormProps> = ({ onSave }) => {
//   const [formData, setFormData] = useState({
//     nome: '',
//     cpf: '',
//     telefone: '',
//     email: '',
//     endereco: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSave(formData);
//       setFormData({ nome: '', cpf: '', telefone: '', email: '', endereco: '' });
//       alert("Tutor cadastrado com sucesso!");
//     } catch (err) {
//       alert("Erro ao cadastrar tutor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
//       <div className="mb-6 flex items-center gap-3">
//         <div className="rounded-xl bg-crarar-primary/10 p-2">
//           <User className="h-6 w-6 text-crarar-primary" />
//         </div>
//         <h3 className="text-lg md:text-xl font-bold text-crarar-text">Novo Tutor</h3>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
//         <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
//           <div className="sm:col-span-2">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
//             <div className="relative">
//               <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="text"
//                 value={formData.nome}
//                 onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="Ex: João Silva"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF (Opcional)</label>
//             <div className="relative">
//               <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={formData.cpf}
//                 onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="000.000.000-00"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone *</label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 required
//                 type="tel"
//                 value={formData.telefone}
//                 onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="(00) 00000-0000"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="contato@email.com"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço</label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={formData.endereco}
//                 onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
//                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
//                 placeholder="Rua, número, bairro..."
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           disabled={loading}
//           type="submit"
//           className="flex w-full items-center justify-center gap-2 rounded-xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50 mt-4"
//         >
//           {loading ? (
//             <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//           ) : (
//             <>
//               <Save className="h-5 w-5" />
//               Finalizar Cadastro
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TutorForm;

import React, { useState } from "react";
import { User, Phone, Mail, MapPin, CreditCard, Save } from "lucide-react";
import { Tutor } from "../types";

interface TutorFormProps {
  onSave: (tutor: Omit<Tutor, "id">) => Promise<string>;
}

const TutorForm: React.FC<TutorFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Higienização dos dados: Remove espaços e converte vazios para NULL
      // Isso evita erros de duplicidade/UNIQUE no Supabase para campos opcionais
      const payload = {
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
        cpf: formData.cpf.trim() || null,
        email: formData.email.trim() || null,
        endereco: formData.endereco.trim() || null,
      };

      await onSave(payload);
      setFormData({ nome: "", cpf: "", telefone: "", email: "", endereco: "" });
      alert("Tutor cadastrado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar tutor:", err);
      alert(
        `Erro ao cadastrar tutor: ${err.message || "Verifique se o CPF ou E-mail já estão cadastrados."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-crarar-primary/10 p-2">
          <User className="h-6 w-6 text-crarar-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-crarar-text">
          Novo Tutor
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              CPF (Opcional)
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Telefone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="tel"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="contato@email.com"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Endereço
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="Rua, número, bairro..."
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Finalizar Cadastro
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TutorForm;
