import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, Check, AlertCircle, X, Navigation } from 'lucide-react';
import { 
  ESTADOS_BRASIL, 
  fetchCitiesByUf, 
  fetchAddressByCep, 
  searchCepByAddress, 
  formatCep, 
  ViaCepResponse 
} from '../utils/viaCep';

interface AddressFieldsProps {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  onChange: (field: string, value: string) => void;
  onAddressAutoFill: (data: Partial<{
    cep: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento: string;
  }>) => void;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  cep,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  onChange,
  onAddressAutoFill
}) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [cidadesList, setCidadesList] = useState<string[]>([]);
  const [loadingInverseCep, setLoadingInverseCep] = useState(false);
  const [multipleResults, setMultipleResults] = useState<ViaCepResponse[] | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Searchable dropdown states
  const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState('');
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);
  const [cidadeSearch, setCidadeSearch] = useState('');

  // Carregar cidades sempre que o Estado (UF) mudar
  useEffect(() => {
    if (estado && estado.length === 2) {
      let isMounted = true;
      setLoadingCidades(true);
      fetchCitiesByUf(estado).then(cityNames => {
        if (isMounted) {
          setCidadesList(cityNames);
          setLoadingCidades(false);
        }
      });
      return () => { isMounted = false; };
    } else {
      setCidadesList([]);
    }
  }, [estado]);

  // Handler para mudança direta no CEP (8 dígitos)
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    onChange('cep', formatted);

    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      setFeedbackMessage(null);
      const address = await fetchAddressByCep(clean);
      setLoadingCep(false);

      if (address) {
        const updates: any = {};
        if (address.logradouro) updates.endereco = address.logradouro;
        if (address.bairro) updates.bairro = address.bairro;
        if (address.localidade) updates.cidade = address.localidade;
        if (address.uf) updates.estado = address.uf;
        if (address.complemento) updates.complemento = address.complemento;

        onAddressAutoFill(updates);

        if (address.uf) {
          fetchCitiesByUf(address.uf).then(cities => setCidadesList(cities));
        }

        setFeedbackMessage({
          type: 'success',
          text: `Endereço encontrado: ${address.localidade}/${address.uf}`
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: 'CEP não encontrado. Verifique o número ou preencha manualmente.'
        });
      }
    }
  };

  // Handler para mudança na UF
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUf = e.target.value;
    onChange('estado', newUf);
    onChange('cidade', ''); // reseta a cidade ao trocar o estado
  };

  // Handler da Busca Inversa de CEP (UF + Cidade + Logradouro)
  const handleInverseCepSearch = async () => {
    const cleanUf = estado.trim().toUpperCase();
    const cleanCidade = cidade.trim();
    const cleanLogradouro = endereco.trim();

    if (cleanUf.length !== 2) {
      setFeedbackMessage({ type: 'error', text: 'Selecione o Estado (UF).' });
      return;
    }
    if (cleanCidade.length < 3) {
      setFeedbackMessage({ type: 'error', text: 'Informe uma Cidade válida (mínimo 3 caracteres).' });
      return;
    }
    if (cleanLogradouro.length < 3) {
      setFeedbackMessage({ type: 'error', text: 'Informe a Rua/Logradouro (mínimo 3 caracteres).' });
      return;
    }

    setLoadingInverseCep(true);
    setFeedbackMessage(null);

    const results = await searchCepByAddress(cleanUf, cleanCidade, cleanLogradouro);
    setLoadingInverseCep(false);

    if (results.length === 0) {
      setFeedbackMessage({
        type: 'error',
        text: `Nenhum CEP foi localizado para "${cleanLogradouro}" em ${cleanCidade}/${cleanUf}. Tente informar apenas a palavra principal do nome da rua.`
      });
    } else if (results.length === 1) {
      const item = results[0];
      const updates: any = {};
      if (item.cep) updates.cep = formatCep(item.cep);
      if (item.bairro) updates.bairro = item.bairro;
      if (item.logradouro) updates.endereco = item.logradouro;
      if (item.complemento) updates.complemento = item.complemento;

      onAddressAutoFill(updates);

      setFeedbackMessage({
        type: 'success',
        text: `CEP localizado com sucesso: ${formatCep(item.cep || '')}`
      });
    } else {
      // Múltiplos CEPs encontrados
      setMultipleResults(results);
    }
  };

  const selectSingleResult = (item: ViaCepResponse) => {
    const updates: any = {};
    if (item.cep) updates.cep = formatCep(item.cep);
    if (item.bairro) updates.bairro = item.bairro;
    if (item.logradouro) updates.endereco = item.logradouro;
    if (item.complemento) updates.complemento = item.complemento;
    if (item.localidade) updates.cidade = item.localidade;
    if (item.uf) updates.estado = item.uf;

    onAddressAutoFill(updates);
    setMultipleResults(null);
    setFeedbackMessage({
      type: 'success',
      text: `CEP selecionado: ${formatCep(item.cep || '')}`
    });
  };

  const canSearchInverse = estado.length === 2 && cidade.trim().length >= 3 && endereco.trim().length >= 3;

  return (
    <div className="space-y-4">
      {/* Título da Seção */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-crarar-primary" />
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Endereço Residencial
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
          Busca por CEP ou Busca Inversa por Endereço
        </span>
      </div>

      {/* Mensagem de Feedback */}
      {feedbackMessage && (
        <div className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between gap-2 transition-all ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : feedbackMessage.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado (UF) - Searchable Dropdown */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            Estado (UF) *
          </label>
          <div 
            onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm font-semibold text-slate-800 dark:text-white cursor-pointer flex items-center justify-between select-none"
          >
            <span>
              {estado ? `${ESTADOS_BRASIL.find(e => e.uf === estado)?.nome || estado} (${estado})` : 'Selecione o Estado'}
            </span>
            <Search className="h-4 w-4 text-slate-400" />
          </div>

          {showEstadoDropdown && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar estado..."
                  value={estadoSearch}
                  onChange={(e) => setEstadoSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary"
                />
              </div>
              <div className="max-h-52 overflow-y-auto space-y-1">
                <div
                  onClick={() => {
                    onChange('estado', '');
                    onChange('cidade', '');
                    setShowEstadoDropdown(false);
                    setEstadoSearch('');
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Selecione o Estado
                </div>
                {ESTADOS_BRASIL
                  .filter(item => item.nome.toLowerCase().includes(estadoSearch.toLowerCase()) || item.uf.toLowerCase().includes(estadoSearch.toLowerCase()))
                  .map((item) => (
                    <div
                      key={item.uf}
                      onClick={() => {
                        onChange('estado', item.uf);
                        onChange('cidade', '');
                        setShowEstadoDropdown(false);
                        setEstadoSearch('');
                      }}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        estado === item.uf 
                          ? 'bg-crarar-primary text-white' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white'
                      }`}
                    >
                      <span>{item.nome} ({item.uf})</span>
                      {estado === item.uf && <Check className="h-3.5 w-3.5" />}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Cidade - Searchable Dropdown */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1 flex items-center justify-between">
            <span>Cidade *</span>
            {loadingCidades && <Loader2 className="h-3 w-3 animate-spin text-crarar-primary" />}
          </label>
          <div 
            onClick={() => {
              if (estado && !loadingCidades) {
                setShowCidadeDropdown(!showCidadeDropdown);
              }
            }}
            className={`w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-between select-none ${
              !estado || loadingCidades ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <span className="truncate">
              {!estado
                ? 'Selecione a UF primeiro'
                : loadingCidades
                  ? 'Carregando cidades...'
                  : cidade || 'Selecione a Cidade'}
            </span>
            <Search className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </div>

          {showCidadeDropdown && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar cidade..."
                  value={cidadeSearch}
                  onChange={(e) => setCidadeSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary"
                />
              </div>
              <div className="max-h-52 overflow-y-auto space-y-1">
                {/* Se a cidade atual não estiver na lista */}
                {cidade && !cidadesList.includes(cidade) && (
                  <div
                    onClick={() => {
                      onChange('cidade', cidade);
                      setShowCidadeDropdown(false);
                      setCidadeSearch('');
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-crarar-primary text-white cursor-pointer flex items-center justify-between"
                  >
                    <span>{cidade}</span>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
                {cidadesList
                  .filter(m => m.toLowerCase().includes(cidadeSearch.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m}
                      onClick={() => {
                        onChange('cidade', m);
                        setShowCidadeDropdown(false);
                        setCidadeSearch('');
                      }}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        cidade === m 
                          ? 'bg-crarar-primary text-white' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white'
                      }`}
                    >
                      <span>{m}</span>
                      {cidade === m && <Check className="h-3.5 w-3.5" />}
                    </div>
                  ))}
                {cidadesList.filter(m => m.toLowerCase().includes(cidadeSearch.toLowerCase())).length === 0 && (
                  <div className="py-4 text-center text-xs text-slate-400 font-medium">
                    Nenhuma cidade encontrada
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CEP com Busca Direta */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            CEP
          </label>
          <div className="relative">
            {loadingCep ? (
              <Loader2 className="absolute left-3 top-2.5 h-5 w-5 text-crarar-primary animate-spin" />
            ) : (
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-slate-400" />
            )}
            <input
              type="text"
              maxLength={9}
              value={cep}
              onChange={handleCepChange}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 pl-10 pr-4 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
              placeholder="00000-000"
            />
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            Bairro
          </label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => onChange('bairro', e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
            placeholder="Ex: Centro"
          />
        </div>

        {/* Logradouro / Nome da Rua */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            Endereço (Rua / Logradouro)
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => onChange('endereco', e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
            placeholder="Rua, Avenida, Praça... (mín. 3 caracteres para busca de CEP)"
          />
        </div>

        {/* Botão para Busca Inversa de CEP (Ativo quando UF, Cidade e Rua têm tamanho mínimo) */}
        <div className="md:col-span-2">
          <button
            type="button"
            disabled={!canSearchInverse || loadingInverseCep}
            onClick={handleInverseCepSearch}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              canSearchInverse
                ? 'bg-crarar-primary/10 dark:bg-crarar-primary/20 border-crarar-primary/30 text-crarar-primary hover:bg-crarar-primary hover:text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            {loadingInverseCep ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Consultando por Endereço...</span>
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                <span>
                  {canSearchInverse
                    ? 'Buscar CEP Inverso por Endereço (UF + Cidade + Rua)'
                    : 'Preencha UF, Cidade e Rua para Buscar o CEP automaticamente'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Número e Complemento */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            Número
          </label>
          <input
            type="text"
            value={numero}
            onChange={(e) => onChange('numero', e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
            placeholder="Ex: 123"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
            Complemento
          </label>
          <input
            type="text"
            value={complemento}
            onChange={(e) => onChange('complemento', e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-crarar-primary outline-none transition-all"
            placeholder="Apto 101, Bloco B..."
          />
        </div>
      </div>

      {/* Modal para seleção quando a Busca Inversa do ViaCEP retorna múltiplos CEPs */}
      {multipleResults && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-slide-up border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Vários CEPs Encontrados</h4>
                <p className="text-xs text-slate-500">
                  A API do ViaCEP retornou {multipleResults.length} resultados para este endereço. Selecione o correto:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMultipleResults(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {multipleResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSingleResult(item)}
                  className="w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-crarar-primary bg-slate-50 hover:bg-crarar-primary/5 transition-all group flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-crarar-primary text-white">
                        {formatCep(item.cep || '')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {item.logradouro}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Bairro: {item.bairro || 'N/A'} - {item.localidade}/{item.uf}
                      {item.complemento && ` (${item.complemento})`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-crarar-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Selecionar
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMultipleResults(null)}
              className="mt-4 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
