
import React, { useState } from 'react';
import { User, Phone, Mail, Save, CheckCircle2, AlertTriangle, CreditCard } from 'lucide-react';
import { Tutor } from '../types';
import { AddressFields } from './AddressFields';
import { formatCPF, formatPhone, validateCPF, validatePhone } from '../utils/masks';

interface TutorFormProps {
  onSave: (tutor: Omit<Tutor, 'id'>) => Promise<string>;
}

const TutorForm: React.FC<TutorFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressAutoFill = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de CPF (se preenchido, deve ter 11 números)
    const cpfValidation = validateCPF(formData.cpf);
    if (!cpfValidation.valid) {
      setModalStatus({
        type: 'error',
        message: cpfValidation.message || 'CPF inválido.'
      });
      return;
    }

    // Validação de Telefone (deve conter DDD + número completo)
    const phoneValidation = validatePhone(formData.telefone);
    if (!phoneValidation.valid) {
      setModalStatus({
        type: 'error',
        message: phoneValidation.message || 'Telefone inválido.'
      });
      return;
    }

    setLoading(true);
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

      await onSave(payload);
      setFormData({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
      setModalStatus({ type: 'success', message: 'Tutor cadastrado com sucesso no sistema CRARAR.' });
    } catch (err: any) {
      console.error("Erro ao salvar tutor:", err);
      setModalStatus({ 
        type: 'error', 
        message: err.message || 'Verifique se o CPF ou E-mail já estão cadastrados.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 md:p-8 shadow-sm border border-gray-100 relative">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-crarar-primary/10 p-2">
          <User className="h-6 w-6 text-crarar-primary" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-crarar-text">Novo Tutor</h3>
          <p className="text-xs text-slate-400 font-medium">Preencha os dados cadastrais do responsável</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
          {/* Nome */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          {/* CPF com máscara de 11 números (opcional) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              CPF (Opcional - 11 dígitos)
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                maxLength={14}
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-mono focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Telefone com máscara (DDD) 00000-0000 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                required
                type="tel"
                maxLength={15}
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-mono focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
                placeholder="contato@email.com"
              />
            </div>
          </div>
        </div>

        {/* Componente Modular de Campos de Endereço com ViaCEP (Inversa/Direta) e Dropdowns UF/Cidade */}
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

      {/* FEEDBACK MODAL */}
      {modalStatus.type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl animate-slide-up text-center border border-slate-100">
            <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-inner ${
              modalStatus.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
            }`}>
              {modalStatus.type === 'success' ? <CheckCircle2 className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
            </div>
            <h4 className={`text-xl font-black mb-2 ${modalStatus.type === 'success' ? 'text-slate-900' : 'text-red-600'}`}>
              {modalStatus.type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}
            </h4>
            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
              {modalStatus.message}
            </p>
            <button 
              onClick={() => setModalStatus({ type: null, message: '' })}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                modalStatus.type === 'success' 
                  ? 'bg-crarar-primary text-white shadow-crarar-primary/20' 
                  : 'bg-slate-900 text-white'
              }`}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorForm;

