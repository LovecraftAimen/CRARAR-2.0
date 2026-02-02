
import React, { useState } from 'react';
import { Stethoscope, Calendar, User, Save, FileText, Pill, AlertTriangle } from 'lucide-react';
import { Animal, Atendimento, Tutor } from '../types';

interface AtendimentoFormProps {
  animais: Pick<Animal, 'id' | 'nome' | 'especie'>[];
  tutores: Tutor[];
  onSave: (att: Omit<Atendimento, 'id'>) => Promise<string>;
}

const AtendimentoForm: React.FC<AtendimentoFormProps> = ({ animais, tutores, onSave }) => {
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
    obito: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
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
        obito: false
      });
      alert("Atendimento registrado com sucesso.");
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
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Paciente (Pet) *</label>
            <select
              required
              value={formData.animal_id}
              onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-crarar-light dark:bg-slate-950 py-2.5 px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-crarar-primary text-slate-900 dark:text-white"
            >
              <option value="">Selecione o animal</option>
              {animais.map(a => (
                <option key={a.id} value={a.id}>{a.nome} ({a.especie})</option>
              ))}
            </select>
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 transition-all hover:bg-crarar-primary/90 active:scale-95 disabled:opacity-50"
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
