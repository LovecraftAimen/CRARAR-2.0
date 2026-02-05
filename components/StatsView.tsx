

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  PawPrint, 
  Stethoscope, 
  Users, 
  Package, 
  Filter,
  Clock,
  FileText,
  Download,
  X,
  ShieldCheck,
  Heart,
  Edit,
  AlertTriangle,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Atendimento, Animal, Produto, Tutor } from '../types.ts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface StatsViewProps {
  atendimentos: Atendimento[];
  animais: Animal[];
  produtos: Produto[];
  tutores: Tutor[];
}

type Period = 'Mes' | 'Trimestre' | 'Semestre' | 'Ano';

const StatsView: React.FC<StatsViewProps> = ({ atendimentos, animais, produtos, tutores }) => {
  const [period, setPeriod] = useState<Period>('Mes');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDates, setReportDates] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const reportRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para ajustar a escala da folha A4 dinamicamente na visualização
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth;
        const a4WidthInPx = 794; // Aproximadamente 210mm em 96dpi
        const padding = 32;
        const availableWidth = containerWidth - padding;
        
        if (availableWidth < a4WidthInPx) {
          setPreviewScale(availableWidth / a4WidthInPx);
        } else {
          setPreviewScale(1);
        }
      }
    };

    if (showReportModal) {
      updateScale();
      window.addEventListener('resize', updateScale);
    }
    return () => window.removeEventListener('resize', updateScale);
  }, [showReportModal]);

  const getBrasiliaDate = () => {
    const now = new Date();
    const brOffset = -3;
    const brTime = new Date(now.getTime() + (brOffset * 60 * 60 * 1000));
    return brTime;
  };

  const filteredData = useMemo(() => {
    const brNow = getBrasiliaDate();
    let startDate = new Date(brNow);
    
    if (period === 'Mes') startDate.setMonth(brNow.getMonth() - 1);
    else if (period === 'Trimestre') startDate.setMonth(brNow.getMonth() - 3);
    else if (period === 'Semestre') startDate.setMonth(brNow.getMonth() - 6);
    else if (period === 'Ano') startDate.setFullYear(brNow.getFullYear() - 1);

    return {
      atendimentos: atendimentos.filter(a => new Date(a.data) >= startDate),
      animais: animais.filter(a => a.created_at ? new Date(a.created_at) >= startDate : true),
      tutores: tutores.filter(t => t.created_at ? new Date(t.created_at) >= startDate : true),
    };
  }, [period, atendimentos, animais, tutores]);

  const last7DaysData = useMemo(() => {
    const days = [];
    const now = getBrasiliaDate();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      
      const count = atendimentos.filter(at => at.data === dateStr).length;
      days.push({ label, count, date: dateStr });
    }
    
    const maxCount = Math.max(...days.map(d => d.count), 1);
    return { days, maxCount };
  }, [atendimentos]);

  const reportData = useMemo(() => {
    const start = new Date(reportDates.start);
    const end = new Date(reportDates.end);
    end.setHours(23, 59, 59);

    const periodAtendimentos = atendimentos.filter(a => {
      const d = new Date(a.data);
      return d >= start && d <= end;
    });

    const periodAnimais = animais.filter(a => {
      if (!a.created_at) return false;
      const d = new Date(a.created_at);
      return d >= start && d <= end;
    });

    const crararTutorIds = tutores.filter(t => t.nome.toUpperCase() === 'CRARAR').map(t => t.id);
    const scopeAnimais = animais.filter(a => a.created_at ? new Date(a.created_at) <= end : true);
    
    const totalCrarar = scopeAnimais.filter(a => crararTutorIds.includes(a.tutor_id)).length;
    const totalNormal = scopeAnimais.length - totalCrarar;

    const castracoes = periodAtendimentos.filter(at => 
      at.tratamento.toLowerCase().includes('castra') || 
      at.diagnostico.toLowerCase().includes('castra')
    );

    const cirurgiasGerais = periodAtendimentos.filter(at => 
      at.tratamento.toLowerCase().includes('cirurgia') ||
      at.diagnostico.toLowerCase().includes('cirurgia')
    );

    const castracoesComunitarios = castracoes.filter(at => {
      const animal = animais.find(a => a.id === at.animal_id);
      return animal && crararTutorIds.includes(animal.tutor_id);
    });

    const counts: Record<string, number> = { 'Caninos': 0, 'Felinos': 0, 'Aves': 0, 'Exóticos': 0 };
    scopeAnimais.forEach(a => {
      const esp = (a.especie || '').toLowerCase();
      if (esp.includes('cão') || esp.includes('cachorro') || esp.includes('canino')) counts['Caninos']++;
      else if (esp.includes('gato') || esp.includes('felino')) counts['Felinos']++;
      else if (esp.includes('ave') || esp.includes('pássaro')) counts['Aves']++;
      else counts['Exóticos']++;
    });

    const totalScope = scopeAnimais.length || 1;
    const reportSpecies = Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percent: (value / totalScope) * 100
    }));

    return {
      stats: {
        totalAnimais: scopeAnimais.length,
        totalCrarar,
        totalNormal,
        totalAtendimentos: periodAtendimentos.length,
        animaisCadastradosPeriodo: periodAnimais.length,
        animaisAtendidosPeriodo: new Set(periodAtendimentos.map(at => at.animal_id)).size,
        obitosPeriodo: periodAtendimentos.filter(at => at.obito).length,
        totalTutores: tutores.length,
        castracoes: castracoes.length,
        cirurgiasGerais: cirurgiasGerais.length,
        castracoesComunitarios: castracoesComunitarios.length
      },
      species: reportSpecies
    };
  }, [reportDates, atendimentos, animais, tutores]);

  // Função de geração robusta que garante o mesmo PDF independente do dispositivo
  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    
    try {
      // Configuramos o html2canvas para ignorar o viewport atual e usar dimensões A4 fixas
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, // Resolução 2x para nitidez sem lentidão excessiva no mobile
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // Largura A4 padrão em pixels (96dpi)
        height: 1123, // Altura A4 padrão em pixels (96dpi)
        windowWidth: 794, // Força o layout como se estivesse em uma tela de 210mm
        onclone: (clonedDoc) => {
          // Garantimos que no clone usado para captura, o elemento não tenha transforms
          const element = clonedDoc.querySelector('[data-report-container]');
          if (element) {
            (element as HTMLElement).style.transform = 'none';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Mapeamento direto para as dimensões milimétricas do A4
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`Relatorio_CRARAR_${reportDates.start}_ate_${reportDates.end}.pdf`);
    } catch (err) {
      console.error("Erro na exportação do PDF:", err);
      alert("Não foi possível gerar o PDF. Tente novamente em instantes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const crararTutorIds = tutores.filter(t => t.nome.toUpperCase() === 'CRARAR').map(t => t.id);
  const institutionalAnimalsCount = animais.filter(a => crararTutorIds.includes(a.tutor_id)).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Análise de Dados Veterinários</h3>
          <p className="text-sm font-medium text-slate-400">Visão estatística da operação clínica e institucional.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-crarar-primary text-white px-5 py-2.5 text-xs font-bold hover:bg-crarar-primary/90 transition-all shadow-lg shadow-crarar-primary/20"
          >
            <FileText className="h-4 w-4" /> Gerar Relatório A4
          </button>

          
          {/* <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
            {(['Mes', 'Trimestre', 'Semestre', 'Ano'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  period === p ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div> */}

          
          <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm hover:border-crarar-primary transition-all group">
  <Filter className="h-3.5 w-3.5 text-slate-400 mr-2 group-hover:text-crarar-primary transition-colors" />
  <select
    value={period}
    onChange={(e) => setPeriod(e.target.value as Period)}
    className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-6"
  >
    <option value="Mes">Mensal</option>
    <option value="Trimestre">Trimestral</option>
    <option value="Semestre">Semestral</option>
    <option value="Ano">Anual</option>
  </select>
  {/* Ícone de seta posicionado à direita */}
  <div className="pointer-events-none absolute right-2 flex items-center text-slate-400">
    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
  </div>
</div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Consultas', value: filteredData.atendimentos.length, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Novos Pets', value: filteredData.animais.length, icon: PawPrint, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Novos Tutores', value: filteredData.tutores.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pets CRARAR', value: institutionalAnimalsCount, icon: ShieldCheck, color: 'text-crarar-primary', bg: 'bg-crarar-primary/5' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-black ${stat.color} uppercase tracking-widest`}>{stat.label}</span>
             </div>
             <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
             <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Base Histórica</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-crarar-primary" /> Distribuição de Espécies
            </h4>
            <div className="space-y-6">
               {reportData.species.map((sp) => (
                 <div key={sp.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                       <span>{sp.label}</span>
                       <span>{Math.round(sp.percent)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                       <div 
                         className="h-full bg-crarar-primary rounded-full transition-all duration-1000" 
                         style={{ width: `${sp.percent}%` }}
                       ></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-crarar-primary" /> Atendimentos (Últimos 7 dias)
            </h4>
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
               {last7DaysData.days.map((day, idx) => (
                 <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex flex-col items-center">
                       <div 
                         className="w-full max-w-[40px] bg-crarar-primary/10 dark:bg-crarar-primary/5 rounded-t-xl group-hover:bg-crarar-primary/20 transition-all duration-500 relative flex items-end overflow-hidden border border-transparent group-hover:border-crarar-primary/10"
                         style={{ height: '160px' }}
                       >
                          <div 
                            className="w-full bg-crarar-primary rounded-t-lg transition-all duration-1000 shadow-lg shadow-crarar-primary/20"
                            style={{ height: `${(day.count / last7DaysData.maxCount) * 100}%` }}
                          ></div>
                       </div>
                       <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap">
                         {day.count} atend.
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{day.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/80 backdrop-blur-md p-0 md:p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-[900px] bg-slate-100 dark:bg-slate-950 min-h-screen md:min-h-0 md:rounded-[40px] shadow-2xl border-x md:border border-white dark:border-slate-800 flex flex-col relative mb-0 md:mb-12">
             
             <div className="sticky top-0 z-[110] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 rounded-2xl bg-crarar-primary/10 text-crarar-primary">
                      <FileText className="h-5 w-5" />
                   </div>
                   <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Relatório Executivo A4</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualização Prévia</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={generatePDF}
                     disabled={isGenerating}
                     className="flex items-center gap-2 rounded-xl bg-crarar-primary text-white px-4 py-2 text-xs font-black hover:bg-crarar-primary/90 transition-all shadow-md disabled:opacity-50"
                   >
                     {isGenerating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <><Download className="h-4 w-4" /> Baixar PDF</>}
                   </button>
                   <button onClick={() => setShowReportModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
                </div>
             </div>

             <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-end">
                <div className="space-y-1 flex-1 min-w-[140px]">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Início</label>
                   <input type="date" value={reportDates.start} onChange={e => setReportDates({...reportDates, start: e.target.value})} className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none" />
                </div>
                <div className="space-y-1 flex-1 min-w-[140px]">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Fim</label>
                   <input type="date" value={reportDates.end} onChange={e => setReportDates({...reportDates, end: e.target.value})} className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none" />
                </div>
                <div className="hidden lg:flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 max-w-xs">
                   <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                   <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-tight">O PDF final manterá as proporções exatas do papel A4, independente do seu dispositivo.</p>
                </div>
             </div>
             
             <div 
               ref={previewContainerRef}
               className="flex-1 p-4 md:p-8 flex justify-center bg-slate-200/50 dark:bg-slate-950/50 overflow-x-hidden overflow-y-visible"
             >
                <div 
                  data-report-container
                  className="origin-top shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white transition-transform duration-300 ease-out"
                  style={{ 
                    transform: `scale(${previewScale})`,
                    marginBottom: `calc(297mm * ${previewScale} - 297mm)`
                  }}
                >
                   <div 
                     ref={reportRef} 
                     className="w-[210mm] min-h-[297mm] bg-white p-[20mm] space-y-10 text-slate-900 font-sans relative"
                   >
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
                        <PawPrint className="w-[400px] h-[400px] rotate-12" />
                      </div>

                      {/* <div className="flex items-center justify-between border-b-4 border-crarar-primary pb-8 relative z-10">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <img src="/CRARAR_logo.png" alt="CRARAR Logo" className="h-8 w-8 text-crarar-primary" />
                               <h1 className="text-3xl font-black tracking-tight text-slate-900">RELATÓRIO EXECUTIVO</h1>
                            </div>
                            <p className="text-sm font-bold text-crarar-primary uppercase tracking-[0.2em]">Centro de Referência Animal - CRARAR</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PERÍODO DE COMPETÊNCIA</p>
                            <p className="text-sm font-black">{new Date(reportDates.start).toLocaleDateString('pt-BR')} — {new Date(reportDates.end).toLocaleDateString('pt-BR')}</p>
                            <p className="text-[9px] text-slate-400 mt-1">EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</p>
                         </div>
                      </div> */}




                     
                     <div className="text-center mb-8">
                          <img src="/CRARAR_logo.png" alt="CRARAR Logo" className="mx-auto w-32 h-auto" />
                      </div>
                      
                      <div className="flex items-center justify-between border-b-4 border-crarar-primary pb-8 relative z-10">
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <h1 className="text-4xl font-black tracking-tight text-slate-900">RELATÓRIO EXECUTIVO</h1>
                              </div>
                              <p className="text-sm font-bold text-crarar-primary uppercase tracking-[0.2em]">Centro de Referência Animal - CRARAR</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PERÍODO DE COMPETÊNCIA</p>
                              <p className="text-sm font-black">{new Date(reportDates.start).toLocaleDateString('pt-BR')} — {new Date(reportDates.end).toLocaleDateString('pt-BR')}</p>
                              <p className="text-[9px] text-slate-400 mt-1">EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</p>
                          </div>
                      </div>




                     
                      <div className="grid grid-cols-2 gap-8 relative z-10">
                         <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-crarar-primary pl-3">EFICIÊNCIA DE ATENDIMENTO</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="bg-slate-50 p-6 rounded-[24px]">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Consultas Realizadas</p>
                                  <p className="text-3xl font-black text-slate-900">{reportData.stats.totalAtendimentos}</p>
                               </div>
                               <div className="bg-slate-50 p-6 rounded-[24px]">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Óbitos Confirmados</p>
                                  <p className="text-3xl font-black text-red-500">{reportData.stats.obitosPeriodo}</p>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-crarar-primary pl-3">PROCEDIMENTOS CLÍNICOS</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="bg-slate-50 p-6 rounded-[24px]">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Total de Castrações</p>
                                  <p className="text-3xl font-black text-emerald-600">{reportData.stats.castracoes}</p>
                               </div>
                               <div className="bg-slate-50 p-6 rounded-[24px]">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cirurgias Gerais</p>
                                  <p className="text-3xl font-black text-blue-600">{reportData.stats.cirurgiasGerais}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-crarar-primary pl-3">CENSO POPULACIONAL (COMPOSIÇÃO)</h3>
                         <div className="grid grid-cols-4 gap-6">
                            {reportData.species.map(s => (
                              <div key={s.label} className="border border-slate-100 p-6 rounded-[24px]">
                                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{s.label}</p>
                                 <p className="text-2xl font-black text-slate-800">{s.value}</p>
                                 <p className="text-[9px] font-bold text-crarar-primary">{Math.round(s.percent)}% da base</p>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-crarar-primary/5 p-10 rounded-[32px] border border-crarar-primary/10 relative z-10">
                         <div className="flex items-center gap-6 mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-crarar-primary text-white flex items-center justify-center shadow-lg shadow-crarar-primary/20">
                               <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-slate-900">Impacto Institucional CRARAR</h3>
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Atuação Social e Comunitária</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-3 gap-8">
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pets Institucionais</p>
                               <p className="text-3xl font-black text-crarar-primary">{reportData.stats.totalCrarar}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Castrações Sociais</p>
                               <p className="text-3xl font-black text-emerald-600">{reportData.stats.castracoesComunitarios}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Responsáveis Ativos</p>
                               <p className="text-3xl font-black text-slate-900">{reportData.stats.totalTutores}</p>
                            </div>
                         </div>
                      </div>

                      <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] pt-10 text-center border-t border-slate-100 z-10">
                         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Documento gerado eletronicamente pelo Sistema CRARAR em {new Date().toLocaleTimeString('pt-BR')}</p>
                         <p className="text-[8px] text-slate-300 mt-1">A integridade deste relatório é garantida pelos registros digitais criptografados.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsView;
