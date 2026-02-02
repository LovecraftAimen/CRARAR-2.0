
import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { 
  Users, 
  PawPrint, 
  Search, 
  LogOut, 
  Plus, 
  Bell,
  CheckCircle2
} from 'lucide-react';
import TutorForm from './TutorForm';
import AnimalForm from './AnimalForm';
import SearchResults from './SearchResults';

const AtendenteInterface: React.FC = () => {
  const { currentUsuario, logoutUsuario } = useUsuarios();
  const { tutores, animais, atendimentos, saveTutor, saveAnimal } = useSupabaseData();
  const [activeTab, setActiveTab] = useState<'tutor' | 'animal' | 'search'>('search');

  return (
    <div className="min-h-screen bg-crarar-light">
      {/* Reception Header */}
      <header className="bg-crarar-primary text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <PawPrint className="h-6 w-6 md:h-8 md:w-8 text-crarar-secondary" />
            <span className="text-lg md:text-2xl font-bold">CRARAR <span className="text-[10px] md:text-xs font-normal opacity-70">Recepção</span></span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">{currentUsuario?.nome}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-70">Atendente</p>
            </div>
            <button 
              onClick={() => logoutUsuario()}
              className="rounded-full bg-white/10 p-2 md:p-2.5 transition-all hover:bg-white/20"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Navigation - Horizontal scroll on mobile */}
      <div className="bg-white border-b shadow-sm sticky top-16 md:top-20 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'search', label: 'Busca', icon: Search },
              { id: 'tutor', label: 'Tutor', icon: Users },
              { id: 'animal', label: 'Pet', icon: PawPrint },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold transition-all shrink-0 ${
                  activeTab === tab.id 
                  ? 'bg-crarar-primary text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6 rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
             <h2 className="text-xl md:text-2xl font-bold text-crarar-text">Olá, {currentUsuario?.nome}</h2>
             <p className="text-sm text-gray-500">Gestão de atendimentos e cadastros rápidos.</p>
          </div>
          <div className="flex gap-8 md:gap-4 w-full md:w-auto justify-center">
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Tutores</p>
                <p className="text-xl font-bold text-crarar-primary">{tutores.length}</p>
             </div>
             <div className="h-10 w-px bg-gray-100"></div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pacientes</p>
                <p className="text-xl font-bold text-crarar-primary">{animais.length}</p>
             </div>
          </div>
        </div>

        <div className="animate-slide-up max-w-full overflow-hidden">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <h3 className="text-md font-bold text-crarar-text flex items-center gap-2">
                <Search className="h-5 w-5 text-crarar-primary" />
                Buscar Cadastro
              </h3>
              <SearchResults tutores={tutores} animais={animais} atendimentos={atendimentos} userRole="atendente" />
            </div>
          )}
          {activeTab === 'tutor' && <TutorForm onSave={saveTutor} />}
          {activeTab === 'animal' && <AnimalForm tutores={tutores} onSave={saveAnimal} />}
        </div>
      </main>
    </div>
  );
};

export default AtendenteInterface;
