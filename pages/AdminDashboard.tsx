
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  Stethoscope, 
  Settings, 
  LogOut, 
  Search,
  Plus,
  Bell,
  ChevronDown,
  ChevronUp,
  PieChart,
  FileText,
  ShieldCheck,
  Package,
  Skull,
  HeartPulse,
  AlertTriangle,
  ClipboardList,
  Trash2,
  X,
  UserPlus,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  Palette,
  BellRing,
  Smartphone,
  Info,
  Tag,
  Calendar,
  DollarSign,
  Activity,
  Filter,
  Save,
  Edit,
  Heart,
  Moon,
  Sun,
  Factory,
  Layers,
  Thermometer,
  Crosshair,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import TutorForm from '../components/TutorForm';
import AnimalForm from '../components/AnimalForm';
import AtendimentoForm from '../components/AtendimentoForm';
import SearchResults from '../components/SearchResults';
import SearchPacientes from '../components/SearchPacientes';
import StatsView from '../components/StatsView';
import { Produto, Animal } from '../types';

const AdminDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { tutores, animais, atendimentos, produtos, saveTutor, saveAnimal, saveAtendimento, saveProduto, updateProduto, deleteProduto } = useSupabaseData();
  const [activeView, setActiveView] = useState<'overview' | 'tutores' | 'animais' | 'atendimentos' | 'search' | 'stats' | 'pacientes' | 'inventario' | 'obituario' | 'settings'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'appearance' | 'notif'>('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('Todas');
  const [invStockStatus, setInvStockStatus] = useState<'Todos' | 'Crítico' | 'Normal'>('Todos');

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = (mode: 'light' | 'dark') => {
    const isDark = mode === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    clinica: true,
    cadastro: false
  });

  const toggleDropdown = (id: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Produto | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const initialProductState: Omit<Produto, 'id' | 'created_at'> = {
    nome: '',
    quantidade: 0,
    minimo: 0,
    unidade: 'unidade',
    categoria: 'Geral',
    id_sku: '',
    principio_ativo: '',
    fabricante: '',
    ponto_pedido: '',
    localizacao: '',
    lote: '',
    validade: '',
    registro_mapa: '',
    receita_especial: false,
    custo: 0,
    preco_venda: 0,
    moeda: 'BRL',
    fornecedor: '',
    equipamento: '',
    ultima_manutencao: '',
    proxima_calibracao: '',
    uso_veterinario: '',
    via_administracao: '',
    status_operacional: 'Ativo'
  };

  const [newProduct, setNewProduct] = useState<Omit<Produto, 'id' | 'created_at'>>(initialProductState);

  const handleOpenEdit = (p: Produto) => {
    setEditingProductId(p.id);
    const { id, created_at, ...rest } = p;
    setNewProduct(rest);
    setShowProductModal(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nome) {
      alert("O nome do item é obrigatório.");
      return;
    }

    const productToSubmit = {
      ...newProduct,
      validade: newProduct.validade === "" ? null : newProduct.validade,
      ultima_manutencao: newProduct.ultima_manutencao === "" ? null : newProduct.ultima_manutencao,
      proxima_calibracao: newProduct.proxima_calibracao === "" ? null : newProduct.proxima_calibracao,
    };

    try {
      if (editingProductId) {
        await updateProduto(editingProductId, productToSubmit);
      } else {
        await saveProduto(productToSubmit);
      }
      setNewProduct(initialProductState);
      setEditingProductId(null);
      setShowProductModal(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto no banco de dados.");
    }
  };

  const filteredProdutos = useMemo(() => {
    return produtos.filter(p => {
      const matchesSearch = p.nome.toLowerCase().includes(invSearch.toLowerCase()) || 
                           (p.id_sku && p.id_sku.toLowerCase().includes(invSearch.toLowerCase()));
      const matchesCategory = invCategory === 'Todas' || p.categoria === invCategory;
      const isCritical = p.quantidade <= p.minimo;
      const matchesStock = invStockStatus === 'Todos' || 
                          (invStockStatus === 'Crítico' && isCritical) ||
                          (invStockStatus === 'Normal' && !isCritical);
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [produtos, invSearch, invCategory, invStockStatus]);

  const criticalProducts = useMemo(() => {
    return produtos.filter(p => p.quantidade <= p.minimo);
  }, [produtos]);

  const categories = useMemo(() => {
    const cats = new Set(produtos.map(p => p.categoria));
    return ['Todas', ...Array.from(cats)];
  }, [produtos]);

  const getObituario = () => {
    return animais.filter(a => {
      return atendimentos.some(at => at.animal_id === a.id && at.obito === true);
    });
  };

  const getPacientesClinica = () => {
    const obituarioIds = getObituario().map(o => o.id);
    return animais.filter(a => 
      atendimentos.some(at => at.animal_id === a.id) && 
      !obituarioIds.includes(a.id)
    );
  };

  const statsData = {
    totalTutores: tutores.length,
    totalAnimais: animais.length,
    totalAtendimentos: atendimentos.length,
    pacientesAtivos: getPacientesClinica().length,
    obitos: getObituario().length,
  };

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'search', label: 'Busca Global', icon: Search },
    { 
      id: 'clinica', 
      label: 'Clínica', 
      icon: Stethoscope, 
      isDropdown: true,
      subItems: [
        { id: 'atendimentos', label: 'Atendimentos', icon: ClipboardList },
        { id: 'pacientes', label: 'Pacientes', icon: HeartPulse },
        { id: 'inventario', label: 'Inventário', icon: Package },
        { id: 'obituario', label: 'Obituário', icon: Skull },
        { id: 'stats', label: 'Estatísticas', icon: PieChart },
      ]
    },
    { 
      id: 'cadastro', 
      label: 'Cadastro', 
      icon: UserPlus, 
      isDropdown: true,
      subItems: [
        { id: 'tutores', label: 'Tutores', icon: Users },
        { id: 'animais', label: 'Animais', icon: PawPrint },
      ]
    },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <>
      <div className={`flex h-20 items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} shrink-0 relative`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <PawPrint className="h-8 w-8 text-crarar-secondary shrink-0" />
          {!isCollapsed && <span className="text-2xl font-bold tracking-tight animate-fade-in text-white">CRARAR</span>}
        </div>
        {!isCollapsed && (
          <button onClick={() => setIsSidebarCollapsed(true)} className="hidden md:flex p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className={`flex-1 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 overflow-y-auto no-scrollbar`}>
        {navItems.map((item) => {
          if (item.isDropdown) {
            const isOpen = openDropdowns[item.id] && !isCollapsed;
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'justify-between'} rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isOpen ? 'text-white bg-white/5' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
                  </div>
                  {!isCollapsed && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                </button>
                {isOpen && !isCollapsed && (
                  <div className="ml-4 space-y-1 animate-fade-in border-l border-white/10 pl-2">
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => { setActiveView(sub.id as any); setIsMobileMenuOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
                          activeView === sub.id ? 'bg-white/20 text-white shadow-inner font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <sub.icon className="h-4 w-4 shrink-0" />
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as any); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeView === item.id ? 'bg-white/20 text-white shadow-inner' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 p-4 shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button onClick={() => signOut()} className={`flex ${isCollapsed ? 'justify-center' : 'w-full items-center gap-3'} rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all`}>
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="animate-fade-in">Sair da Conta</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] dark:bg-slate-950 transition-colors">
      <aside className={`fixed left-0 top-0 hidden h-screen transition-all duration-300 flex-col bg-crarar-primary text-white md:flex z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent isCollapsed={isSidebarCollapsed} />
        {isSidebarCollapsed && (
          <button onClick={() => setIsSidebarCollapsed(false)} className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-crarar-primary text-white flex items-center justify-center border-2 border-[#f1f5f9] dark:border-slate-950 hover:bg-crarar-primary/90 transition-all shadow-md">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="h-full w-64 flex-col bg-crarar-primary text-white flex shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <SidebarContent isCollapsed={false} />
          </aside>
        </div>
      )}

      <main className={`flex-1 transition-all duration-300 w-full overflow-x-hidden`} style={{ marginLeft: !isMobileMenuOpen && window.innerWidth >= 768 ? (isSidebarCollapsed ? '5rem' : '16rem') : '0' }}>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-crarar-text hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-crarar-text dark:text-white uppercase tracking-wider">
              {navItems.flatMap(i => i.isDropdown ? i.subItems || [] : [i]).find(i => i.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 md:pl-6">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-crarar-text dark:text-white">Administrador</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Veterinário Chefe</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-crarar-primary/10 flex items-center justify-center text-crarar-primary font-bold shrink-0 border border-crarar-primary/5">AD</div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 animate-slide-up">
          {activeView === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Tutores', value: statsData.totalTutores, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Pacientes Ativos', value: statsData.pacientesAtivos, icon: HeartPulse, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'Atendimentos', value: statsData.totalAtendimentos, icon: Stethoscope, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                  { label: 'Óbitos Confirmados', value: statsData.obitos, icon: Skull, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800/40' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-white dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <h3 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
                    </div>
                    <div className={`rounded-2xl p-4 ${stat.bg} ${stat.color} shadow-inner`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-[32px] bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm border border-white dark:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consultas Recentes</h3>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden rounded-2xl border border-slate-50 dark:border-slate-800">
                    {atendimentos.slice(0, 5).map((at, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-crarar-primary shrink-0">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 dark:text-white truncate">{animais.find(a => a.id === at.animal_id)?.nome || 'Paciente'}</p>
                            <p className="text-xs text-slate-400 font-medium">{new Date(at.data).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 rounded-[32px] bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm border border-white dark:border-slate-800 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Status de Estoque</h3>
                    {criticalProducts.length > 0 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                        {criticalProducts.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {criticalProducts.length > 0 ? (
                      criticalProducts.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                          <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{p.nome}</p>
                            <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">Qtd: {p.quantidade} {p.unidade}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
                        <div className="h-20 w-20 rounded-full bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-green-500 shadow-inner">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">Estoques em dia</p>
                          <p className="text-xs text-slate-400 font-medium">Todos os itens estão devidamente abastecidos.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {criticalProducts.length > 5 && (
                    <button 
                      onClick={() => setActiveView('inventario')}
                      className="mt-4 text-xs font-bold text-crarar-primary hover:underline text-center"
                    >
                      Ver mais {criticalProducts.length - 5} alertas...
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar de Configurações */}
                <div className="w-full md:w-64 space-y-2">
                  {[
                    { id: 'profile', label: 'Perfil de Admin', icon: User },
                    { id: 'security', label: 'Segurança', icon: ShieldCheck },
                    { id: 'appearance', label: 'Aparência', icon: Palette },
                    { id: 'notif', label: 'Notificações', icon: BellRing },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id as any)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                        settingsTab === tab.id 
                        ? 'bg-crarar-primary text-white shadow-lg shadow-crarar-primary/20' 
                        : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Conteúdo das Abas */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                  {settingsTab === 'profile' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="h-24 w-24 rounded-3xl bg-crarar-primary/10 flex items-center justify-center text-crarar-primary text-3xl font-black">AD</div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Administrador CRARAR</h3>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Veterinário Chefe</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                          <input type="text" readOnly value={user?.email || 'admin@crarar.com'} className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 text-sm font-bold text-slate-700 dark:text-white outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'security' && (
                    <div className="space-y-8 animate-fade-in text-center py-12">
                      <div className="h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mx-auto shadow-inner">
                        <Lock className="h-10 w-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Painel de Segurança</h3>
                        <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto">As opções de autenticação em dois fatores e troca de senha são gerenciadas pela instituição.</p>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'appearance' && (
                    <div className="space-y-8 animate-fade-in">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personalização de Interface</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                          onClick={() => toggleTheme('light')}
                          className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${!isDarkMode ? 'border-crarar-primary bg-crarar-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                        >
                          <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-amber-500">
                            <Sun className="h-8 w-8" />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-slate-900 dark:text-white">Modo Claro</p>
                            <p className="text-xs font-bold text-slate-400">Ideal para ambientes iluminados</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => toggleTheme('dark')}
                          className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${isDarkMode ? 'border-crarar-primary bg-crarar-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                        >
                          <div className="h-16 w-16 rounded-2xl bg-slate-900 shadow-md flex items-center justify-center text-indigo-400">
                            <Moon className="h-8 w-8" />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-slate-900 dark:text-white">Modo Escuro</p>
                            <p className="text-xs font-bold text-slate-400">Conforto visual e economia</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'notif' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">Alertas de Estoque Crítico</p>
                          <p className="text-xs font-bold text-slate-400">Notificar quando um item atingir o mínimo</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-crarar-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === 'inventario' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inventário Estratégico</h3>
                  <p className="text-sm font-medium text-slate-400">Controle rigoroso de ativos e insumos.</p>
                </div>
                <button onClick={() => { setEditingProductId(null); setNewProduct(initialProductState); setShowProductModal(true); }} className="flex items-center justify-center gap-2 rounded-2xl bg-crarar-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 hover:scale-[1.02] transition-all">
                  <Plus className="h-5 w-5" /> Novo Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative col-span-1 lg:col-span-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input type="text" placeholder="Buscar por Nome ou SKU..." value={invSearch} onChange={e => setInvSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select value={invCategory} onChange={e => setInvCategory(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Estoque</label>
                  <select value={invStockStatus} onChange={e => setInvStockStatus(e.target.value as any)} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary transition-all">
                    <option value="Todos">Todos</option>
                    <option value="Crítico">Crítico</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-green">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest">Identificação</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest">Qtd / Status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest">Financeiro</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest">Rastreabilidade</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredProdutos.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                          <td className="px-8 py-5">
                             <div className="flex flex-col cursor-pointer" onClick={() => setSelectedProductForDetails(p)}>
                                <span className="font-bold text-slate-800 dark:text-white text-sm">{p.nome}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-300 font-medium">{p.id_sku || 'Sem SKU'} • {p.categoria}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                   <span className="font-black text-slate-700 dark:text-slate-100 text-sm">{p.quantidade}</span>
                                   <span className="text-[10px] text-slate-400 dark:text-slate-300 font-bold">{p.unidade}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter w-fit ${p.quantidade <= p.minimo ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                                   {p.quantidade <= p.minimo ? 'Crítico' : 'Normal'}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Venda: R$ {p.preco_venda?.toLocaleString('pt-BR')}</span>
                                <span className="text-[10px] text-slate-400">Custo: R$ {p.custo?.toLocaleString('pt-BR')}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col">
                                {p.lote && <span className="text-[10px] text-slate-500 font-bold">Lote: {p.lote}</span>}
                                {p.validade && <span className="text-[10px] text-slate-400">Validade: {new Date(p.validade).toLocaleDateString('pt-BR')}</span>}
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex items-center justify-center gap-1">
                                <button onClick={() => setSelectedProductForDetails(p)} className="p-2 text-slate-300 dark:text-slate-500 hover:text-crarar-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"><Info className="h-4 w-4" /></button>
                                <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-300 dark:text-slate-500 hover:text-crarar-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => deleteProduto(p.id)} className="p-2 text-slate-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-full overflow-hidden">
            {activeView === 'tutores' && <TutorForm onSave={saveTutor} />}
            {activeView === 'animais' && <AnimalForm tutores={tutores} onSave={saveAnimal} />}
            {activeView === 'atendimentos' && <AtendimentoForm animais={animais} tutores={tutores} onSave={saveAtendimento} />}
            {activeView === 'search' && <SearchResults tutores={tutores} animais={animais} atendimentos={atendimentos} userRole="admin" />}
            {activeView === 'pacientes' && <SearchPacientes tutores={tutores} animais={animais} atendimentos={atendimentos} />}
            {activeView === 'stats' && <StatsView tutores={tutores} animais={animais} atendimentos={atendimentos} produtos={produtos} />}
            {activeView === 'obituario' && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="text-center space-y-2 mb-10">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-900 dark:bg-slate-800 text-white shadow-xl mb-4 border border-slate-700">
                    <Skull className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Memorial CRARAR</h3>
                  <p className="text-slate-400 dark:text-slate-300 font-medium max-w-md mx-auto">Pacientes com óbito clínico confirmado em prontuário.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getObituario().map(animal => (
                    <div key={animal.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                      <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-crarar-primary group-hover:text-white transition-all">
                        <Heart className="h-10 w-10" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">{animal.nome}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{animal.especie} • {animal.raca}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL DETALHES PRODUTO */}
      {selectedProductForDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[40px] bg-white dark:bg-slate-900 shadow-2xl border border-white dark:border-slate-800 flex flex-col relative">
             <div className="sticky top-0 bg-white dark:bg-slate-900 z-20 px-8 py-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="rounded-2xl bg-crarar-primary/10 p-3 text-crarar-primary">
                      <Package className="h-7 w-7" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedProductForDetails.nome}</h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedProductForDetails.id_sku || 'Sem SKU'}</span>
                   </div>
                </div>
                <button onClick={() => setSelectedProductForDetails(null)} className="rounded-full bg-slate-50 dark:bg-slate-800 p-2 text-slate-400 dark:text-white hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
             </div>
             
             <div className="p-8 space-y-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantidade</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{selectedProductForDetails.quantidade} {selectedProductForDetails.unidade}</p>
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ponto de Pedido</p>
                      <p className="text-lg font-black text-red-500">{selectedProductForDetails.ponto_pedido || 'N/A'}</p>
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Preço Venda</p>
                      <p className="text-lg font-black text-emerald-600">R$ {selectedProductForDetails.preco_venda?.toLocaleString('pt-BR')}</p>
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lote</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.lote || 'N/A'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-widest flex items-center gap-2">
                        <Info className="h-3 w-3" /> Especificações Clínicas
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Princípio Ativo</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.principio_ativo || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Via Administração</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.via_administracao || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Uso Veterinário</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.uso_veterinario || '-'}</p>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" /> Rastreabilidade & Local
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Registro MAPA</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.registro_mapa || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Localização Física</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.localizacao || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Validade</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{selectedProductForDetails.validade ? new Date(selectedProductForDetails.validade).toLocaleDateString('pt-BR') : '-'}</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULÁRIO PRODUTO */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="h-full max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[40px] bg-white dark:bg-slate-900 shadow-2xl border border-white dark:border-slate-800 flex flex-col relative animate-slide-up">
            <div className="bg-white dark:bg-slate-900 z-20 px-8 py-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {editingProductId ? 'Editar Ficha de Produto' : 'Novo Cadastro Estratégico'}
                  </h2>
                </div>
                <button onClick={() => { setShowProductModal(false); setEditingProductId(null); setNewProduct(initialProductState); }} className="rounded-full bg-slate-50 dark:bg-slate-800 p-2 text-slate-400 dark:text-white hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto scrollbar-green p-8 space-y-12">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Identificação & Fabricação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Comercial *</label>
                    <input required value={newProduct.nome} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-bold outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">SKU / Código Único</label>
                    <input value={newProduct.id_sku} onChange={e => setNewProduct({...newProduct, id_sku: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Categoria</label>
                    <input value={newProduct.categoria} onChange={e => setNewProduct({...newProduct, categoria: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Princípio Ativo</label>
                    <input value={newProduct.principio_ativo} onChange={e => setNewProduct({...newProduct, principio_ativo: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fabricante</label>
                    <input value={newProduct.fabricante} onChange={e => setNewProduct({...newProduct, fabricante: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Estoque & Logística
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Qtd Atual *</label>
                    <input type="number" step="0.1" required value={newProduct.quantidade} onChange={e => setNewProduct({...newProduct, quantidade: parseFloat(e.target.value)})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-black text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mínimo *</label>
                    <input type="number" step="0.1" required value={newProduct.minimo} onChange={e => setNewProduct({...newProduct, minimo: parseFloat(e.target.value)})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-black text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Unidade</label>
                    <input value={newProduct.unidade} onChange={e => setNewProduct({...newProduct, unidade: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Localização</label>
                    <input value={newProduct.localizacao} onChange={e => setNewProduct({...newProduct, localizacao: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Thermometer className="h-3 w-3" /> Rastreabilidade & Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Lote</label>
                    <input value={newProduct.lote} onChange={e => setNewProduct({...newProduct, lote: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data Validade</label>
                    <input type="date" value={newProduct.validade} onChange={e => setNewProduct({...newProduct, validade: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Registro MAPA</label>
                    <input value={newProduct.registro_mapa} onChange={e => setNewProduct({...newProduct, registro_mapa: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Uso Veterinário</label>
                    <input value={newProduct.uso_veterinario} onChange={e => setNewProduct({...newProduct, uso_veterinario: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Via Administração</label>
                    <input value={newProduct.via_administracao} onChange={e => setNewProduct({...newProduct, via_administracao: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100">
                    <input type="checkbox" checked={newProduct.receita_especial} onChange={e => setNewProduct({...newProduct, receita_especial: e.target.checked})} className="h-5 w-5 rounded text-crarar-primary" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Requer Receita</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Financeiro & Ativos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Custo (R$)</label>
                    <input type="number" step="0.01" value={newProduct.custo} onChange={e => setNewProduct({...newProduct, custo: parseFloat(e.target.value)})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-bold text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Venda (R$)</label>
                    <input type="number" step="0.01" value={newProduct.preco_venda} onChange={e => setNewProduct({...newProduct, preco_venda: parseFloat(e.target.value)})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-bold text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-crarar-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity className="h-3 w-3" /> Ativos & Equipamentos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Equipamento</label>
                    <input value={newProduct.equipamento} onChange={e => setNewProduct({...newProduct, equipamento: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Última Manut.</label>
                    <input type="date" value={newProduct.ultima_manutencao} onChange={e => setNewProduct({...newProduct, ultima_manutencao: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Próxima Calib.</label>
                    <input type="date" value={newProduct.proxima_calibracao} onChange={e => setNewProduct({...newProduct, proxima_calibracao: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-4 text-sm outline-none focus:border-crarar-primary text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 py-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-50 dark:border-slate-800">
                 <button type="submit" className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl bg-crarar-primary text-white font-black text-sm shadow-xl shadow-crarar-primary/30 hover:scale-[1.01] transition-all">
                   <Save className="h-5 w-5" /> {editingProductId ? 'Persistir Alterações no Supabase' : 'Cadastrar Item Estratégico'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
