import React, { useState } from 'react';
import { User, Phone, Mail, CreditCard, Save, X, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { Tutor } from '../types';
import { supabase } from '../integrations/supabase/client';
import { formatCep } from '../utils/viaCep';
import { AddressFields } from './AddressFields';
import { formatCPF, formatPhone, validateCPF, validatePhone } from '../utils/masks';

interface EditTutorModalProps {
  tutor: Tutor;
  onClose: () => void;
  onTutorUpdated?: () => void;
}

export const EditTutorModal: React.FC<EditTutorModalProps> = ({ tutor, onClose, onTutorUpdated }) => {
  const [formData, setFormData] = useState({
    nome: tutor.nome || '',
    cpf: tutor.cpf ? formatCPF(tutor.cpf) : '',
    telefone: tutor.telefone ? formatPhone(tutor.telefone) : '',
    email: tutor.email || '',
    cep: tutor.cep ? formatCep(tutor.cep) : '',
    endereco: tutor.endereco || '',
    numero: tutor.numero || '',
    complemento: tutor.complemento || '',
    bairro: tutor.bairro || '',
    cidade: tutor.cidade || '',
    estado: tutor.estado || ''
  });

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressAutoFill = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de CPF
    const cpfValidation = validateCPF(formData.cpf);
    if (!cpfValidation.valid) {
      setErrorMessage(cpfValidation.message || 'CPF inválido.');
      return;
    }

    // Validação de Telefone
    const phoneValidation = validatePhone(formData.telefone);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.message || 'Telefone inválido.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
        cpf: formData.cpf.trim() || null,
        email: formData.email.trim() || null,
        cep: formData.cep.trim() || null,
        endereco: formData.endereco.trim() || null,
        numero: formData.numero.trim() || null,
        complemento: formData.complemento.trim() || null,
        bairro: formData.bairro.trim() || null,
        cidade: formData.cidade.trim() || null,
        estado: formData.estado.trim() || null,
      };

      const { error } = await supabase
        .from('tutores')
        .update(payload)
        .eq('id', tutor.id);

      if (error) throw error;

      setSuccessMessage('Dados do tutor atualizados com sucesso!');
      
      setTimeout(() => {
        if (onTutorUpdated) {
          onTutorUpdated();
        } else {
          window.location.reload();
        }
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Erro ao atualizar tutor:', err);
      setErrorMessage(err.message || 'Erro ao atualizar os dados do tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTutor = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      const { error } = await supabase
        .from('tutores')
        .delete()
        .eq('id', tutor.id);

      if (error) throw error;

      setSuccessMessage('Tutor excluído com sucesso.');
      setTimeout(() => {
        if (onTutorUpdated) {
          onTutorUpdated();
        } else {
          window.location.reload();
        }
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao excluir tutor:', err);
      setErrorMessage('Não foi possível excluir o tutor. Verifique se não há pets cadastrados vinculados a ele.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-fade-in no-print overflow-hidden">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] md:rounded-[40px] bg-white shadow-2xl border border-white flex flex-col relative scrollbar-green">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-20 px-6 md:px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="rounded-2xl bg-crarar-primary/10 p-3 text-crarar-primary shadow-inner">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                Editar Tutor
              </h2>
              <p className="text-xs md:text-sm font-semibold text-slate-400">
                Atualize as informações cadastrais de <span className="text-slate-700 font-bold">{tutor.nome}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">

          {/* Feedback messages */}
          {successMessage && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-bold animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm font-bold animate-fade-in">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Delete Confirmation Box */}
          {showDeleteConfirm ? (
            <div className="rounded-3xl border-2 border-red-200 bg-red-50/50 p-6 space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-red-900 text-base">Confirmar exclusão de tutor?</h4>
                  <p className="text-xs text-red-700 font-medium mt-1 leading-relaxed">
                    Esta ação excluirá permanentemente o cadastro de <strong>{tutor.nome}</strong>. Se houver pets ou atendimentos vinculados, a exclusão poderá ser bloqueada pelo sistema.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-2xl bg-white px-5 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTutor}
                  disabled={isDeleting}
                  className="rounded-2xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all flex items-center gap-2"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Sim, Excluir Tutor
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nome Completo */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      required
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/10 transition-all"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Telefone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      required
                      type="tel"
                      maxLength={15}
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 font-mono outline-none focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/10 transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    CPF (Opcional - 11 dígitos)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      maxLength={14}
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 font-mono outline-none focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/10 transition-all"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/10 transition-all"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                </div>

                {/* Componente Modular de Campos de Endereço com ViaCEP (Inversa/Direta) e Dropdowns UF/Cidade */}
                <div className="md:col-span-2">
                  <AddressFields
                    cep={formData.cep}
                    endereco={formData.endereco}
                    numero={formData.numero}
                    complemento={formData.complemento}
                    bairro={formData.bairro}
                    cidade={formData.cidade}
                    estado={formData.estado}
                    onChange={handleFieldChange}
                    onAddressAutoFill={handleAddressAutoFill}
                  />
                </div>

              </div>

              {/* Actions footer */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Tutor
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none rounded-2xl bg-slate-100 px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl bg-crarar-primary px-7 py-3 text-xs font-black text-white hover:bg-crarar-primary/90 shadow-lg shadow-crarar-primary/20 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditTutorModal;
