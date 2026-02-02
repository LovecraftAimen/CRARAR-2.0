import React, { useState, useMemo, useRef } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  PawPrint,
  Stethoscope,
  Users,
  Package,
  Syringe,
  ShoppingCart,
  Bed,
  Filter,
  ChevronDown,
  Clock,
  FileText,
  Download,
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Edit,
} from "lucide-react";
import { Atendimento, Animal, Produto, Tutor } from "../types";
// Importações dinâmicas via ESM para PDF
import html2canvas from "https://esm.sh/html2canvas";
import { jsPDF } from "https://esm.sh/jspdf";

interface StatsViewProps {
  atendimentos: Atendimento[];
  animais: Animal[];
  produtos: Produto[];
  tutores: Tutor[];
}

type Period = "Mes" | "Trimestre" | "Semestre" | "Ano";

const StatsView: React.FC<StatsViewProps> = ({
  atendimentos,
  animais,
  produtos,
  tutores,
}) => {
  const [period, setPeriod] = useState<Period>("Mes");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDates, setReportDates] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Lógica de Horário de Brasília (UTC-3)
  const getBrasiliaDate = () => {
    const now = new Date();
    const brOffset = -3;
    const brTime = new Date(now.getTime() + brOffset * 60 * 60 * 1000);
    return brTime;
  };

  const filteredData = useMemo(() => {
    const brNow = getBrasiliaDate();
    let startDate = new Date(brNow);

    if (period === "Mes") startDate.setMonth(brNow.getMonth() - 1);
    else if (period === "Trimestre") startDate.setMonth(brNow.getMonth() - 3);
    else if (period === "Semestre") startDate.setMonth(brNow.getMonth() - 6);
    else if (period === "Ano") startDate.setFullYear(brNow.getFullYear() - 1);

    return {
      atendimentos: atendimentos.filter((a) => new Date(a.data) >= startDate),
      animais: animais.filter((a) =>
        a.created_at ? new Date(a.created_at) >= startDate : true,
      ),
      tutores: tutores.filter((t) =>
        t.created_at ? new Date(t.created_at) >= startDate : true,
      ),
    };
  }, [period, atendimentos, animais, tutores]);

  // Cálculos específicos para o Relatório PDF baseados no range escolhido
  const reportData = useMemo(() => {
    const start = new Date(reportDates.start);
    const end = new Date(reportDates.end);
    end.setHours(23, 59, 59);

    const periodAtendimentos = atendimentos.filter((a) => {
      const d = new Date(a.data);
      return d >= start && d <= end;
    });

    const periodAnimais = animais.filter((a) => {
      if (!a.created_at) return false;
      const d = new Date(a.created_at);
      return d >= start && d <= end;
    });

    // Identificação de Tutor Institucional
    const crararTutorIds = tutores
      .filter((t) => t.nome.toUpperCase() === "CRARAR")
      .map((t) => t.id);

    // Animais considerados no escopo do relatório (cadastrados até a data fim)
    const scopeAnimais = animais.filter((a) =>
      a.created_at ? new Date(a.created_at) <= end : true,
    );

    const totalCrarar = scopeAnimais.filter(
      (a) => a.categoria === "crarar" || crararTutorIds.includes(a.tutor_id),
    ).length;
    const totalNormal = scopeAnimais.length - totalCrarar;

    // Procedimentos no Período
    const castracoes = periodAtendimentos.filter(
      (at) =>
        at.tratamento.toLowerCase().includes("castra") ||
        at.diagnostico.toLowerCase().includes("castra"),
    );

    const cirurgiasGerais = periodAtendimentos.filter(
      (at) =>
        at.tratamento.toLowerCase().includes("cirurgia") ||
        at.diagnostico.toLowerCase().includes("cirurgia"),
    );

    const castracoesComunitarios = castracoes.filter((at) => {
      const animal = animais.find((a) => a.id === at.animal_id);
      return (
        animal?.categoria === "crarar" ||
        (animal && crararTutorIds.includes(animal.tutor_id))
      );
    });

    // Distribuição por espécie baseada nos animais do escopo do relatório
    const counts: Record<string, number> = {
      Caninos: 0,
      Felinos: 0,
      Aves: 0,
      Exóticos: 0,
    };
    scopeAnimais.forEach((a) => {
      const esp = (a.especie || "").toLowerCase();
      if (
        esp.includes("cão") ||
        esp.includes("cachorro") ||
        esp.includes("canino")
      )
        counts["Caninos"]++;
      else if (esp.includes("gato") || esp.includes("felino"))
        counts["Felinos"]++;
      else if (esp.includes("ave") || esp.includes("pássaro")) counts["Aves"]++;
      else counts["Exóticos"]++;
    });

    const totalScope = scopeAnimais.length || 1;
    const reportSpecies = Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percent: (value / totalScope) * 100,
    }));

    return {
      stats: {
        totalAnimais: scopeAnimais.length,
        totalCrarar,
        totalNormal,
        totalAtendimentos: atendimentos.length, // Total histórico acumulado
        animaisCadastradosPeriodo: periodAnimais.length,
        animaisAtendidosPeriodo: new Set(
          periodAtendimentos.map((at) => at.animal_id),
        ).size,
        obitosPeriodo: periodAtendimentos.filter((at) => at.obito).length,
        totalTutores: tutores.length,
        castracoes: castracoes.length,
        cirurgiasGerais: cirurgiasGerais.length,
        castracoesComunitarios: castracoesComunitarios.length,
      },
      species: reportSpecies,
    };
  }, [reportDates, atendimentos, animais, tutores]);

  const stats = useMemo(() => {
    const brToday = getBrasiliaDate().toISOString().split("T")[0];

    return {
      internados: animais.filter(
        (a) => a.categoria === "crarar" && a.status !== "obito",
      ).length,
      cirurgiasHoje: atendimentos.filter((a) => {
        const isToday = a.data === brToday;
        const isSurgery =
          a.tratamento.toLowerCase().includes("cirurgia") ||
          a.diagnostico.toLowerCase().includes("cirurgia");
        return isToday && isSurgery;
      }).length,
      itensReposicao: produtos.filter((p) => p.quantidade <= p.minimo).length,
      totalAtendimentosPeriodo: filteredData.atendimentos.length,
    };
  }, [animais, atendimentos, produtos, filteredData]);

  const speciesData = useMemo(() => {
    const counts: Record<string, number> = {
      Caninos: 0,
      Felinos: 0,
      Aves: 0,
      Exóticos: 0,
    };
    filteredData.animais.forEach((a) => {
      const esp = (a.especie || "").toLowerCase();
      if (
        esp.includes("cão") ||
        esp.includes("cachorro") ||
        esp.includes("canino")
      )
        counts["Caninos"]++;
      else if (esp.includes("gato") || esp.includes("felino"))
        counts["Felinos"]++;
      else if (esp.includes("ave") || esp.includes("pássaro")) counts["Aves"]++;
      else counts["Exóticos"]++;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percent: (value / total) * 100,
    }));
  }, [filteredData.animais]);

  const weeklyData = useMemo(() => {
    const daysShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const result = [];
    const brNow = getBrasiliaDate();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(brNow);
      d.setDate(brNow.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = daysShort[d.getDay()];

      const count = atendimentos.filter((at) => at.data === dateStr).length;
      result.push({ day: dayName, value: count, fullDate: dateStr });
    }

    return result;
  }, [atendimentos]);

  const colors = {
    teal: "#006D77",
    mint: "#83C5BE",
    gold: "#FFCC70",
    coral: "#E29578",
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Relatorio_Gerencial_CRARAR_${reportDates.start}_a_${reportDates.end}.pdf`,
      );
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o arquivo PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const yAxisMax = 10;
  const ySteps = [10, 8, 6, 4, 2, 0];
  const chartHeight = 250;
  const chartWidth = 600;
  const chartScale = chartHeight / yAxisMax;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center md:text-left">
            Estatísticas Operacionais
          </h2>
          <p className="text-sm font-medium text-slate-400 flex items-center justify-center md:justify-start gap-2">
            <Clock className="h-4 w-4" />
            Atualizado às 19:00 (Brasília) •{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {(["Mes", "Trimestre", "Semestre", "Ano"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  period === p
                    ? "bg-crarar-primary text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
          >
            <FileText className="h-4 w-4" /> Relatório PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border-l-[6px] border-[#006D77] flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-full bg-[#006D77]/5 flex items-center justify-center text-[#006D77] group-hover:scale-110 transition-transform">
            <Bed className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.internados.toString().padStart(2, "0")}
            </h3>
            <p className="text-sm font-bold text-slate-400">
              Animais Internados
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border-l-[6px] border-[#FFCC70] flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-full bg-[#FFCC70]/5 flex items-center justify-center text-[#FFCC70] group-hover:scale-110 transition-transform">
            <Syringe className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.cirurgiasHoje.toString().padStart(2, "0")}
            </h3>
            <p className="text-sm font-bold text-slate-400">Cirurgias Hoje</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border-l-[6px] border-[#ef4444] flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.itensReposicao.toString().padStart(2, "0")}
            </h3>
            <p className="text-sm font-bold text-slate-400">
              Itens p/ Reposição
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE RELATÓRIO */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-5xl my-8 bg-white dark:bg-slate-950 rounded-[40px] shadow-2xl border border-white dark:border-slate-800 flex flex-col relative overflow-hidden h-[95vh]">
            <div className="sticky top-0 z-30 bg-white dark:bg-slate-950 px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-crarar-primary/10 flex items-center justify-center text-crarar-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Gerador de Relatórios
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-full bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-400 hover:text-red-500 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-green bg-slate-100 dark:bg-slate-900">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={reportDates.start}
                    onChange={(e) =>
                      setReportDates({ ...reportDates, start: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={reportDates.end}
                    onChange={(e) =>
                      setReportDates({ ...reportDates, end: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-crarar-primary"
                  />
                </div>
              </div>

              <div className="flex justify-center mb-12">
                <div
                  ref={reportRef}
                  className="w-[210mm] bg-white text-slate-900 shadow-xl p-[15mm] flex flex-col min-h-[297mm] overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center mb-6 gap-2">
                    <img
                      src="CRARAR_logo.png"
                      alt="Logo CRARAR"
                      className="h-16 w-auto mb-2"
                    />
                    {/* <div className="h-12 w-12 bg-crarar-primary rounded-2xl flex items-center justify-center text-white shadow-md">
                      <PawPrint className="h-7 w-7" />
                    </div> */}
                    {/* <h1 className="text-2xl font-black tracking-tight text-crarar-primary">
                      CRARAR
                    </h1> */}
                    <div className="h-0.5 w-12 bg-crarar-primary/10 rounded-full"></div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-[0.2em]">
                      Relatório Gerencial
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Emissão: {new Date().toLocaleDateString("pt-BR")} •
                      Período:{" "}
                      {new Date(reportDates.start).toLocaleDateString("pt-BR")}{" "}
                      a {new Date(reportDates.end).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="mb-6 border-t border-slate-100 pt-5">
                    <h3 className="text-[9px] font-black text-crarar-primary uppercase tracking-[0.2em] mb-3">
                      Métricas Operacionais
                    </h3>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                      {[
                        {
                          label: "Animais Cadastrados (Total no Escopo)",
                          value: reportData.stats.totalAnimais,
                        },
                        {
                          label: "Pets Institucionais (CRARAR)",
                          value: reportData.stats.totalCrarar,
                          color: "text-crarar-primary",
                        },
                        {
                          label: "Pets Comuns (Não CRARAR)",
                          value: reportData.stats.totalNormal,
                        },
                        {
                          label: "Animais Atendidos (Total Histórico)",
                          value: reportData.stats.totalAtendimentos,
                        },
                        {
                          label: "Registros no Período Escolhido",
                          value: reportData.stats.animaisCadastradosPeriodo,
                        },
                        {
                          label: "Pacientes Atendidos no Período",
                          value: reportData.stats.animaisAtendidosPeriodo,
                        },
                        {
                          label: "Número de Óbitos no Período",
                          value: reportData.stats.obitosPeriodo,
                          color: "text-red-500",
                        },
                        {
                          label: "Base de Tutores (Total)",
                          value: reportData.stats.totalTutores,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1.5 border-b border-slate-50"
                        >
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                            {item.label}
                          </span>
                          <span
                            className={`text-xs font-black ${item.color || "text-slate-900"}`}
                          >
                            {item.value.toString().padStart(2, "0")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8 bg-slate-50/50 p-5 rounded-[24px] border border-slate-100">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                      Atividades e Procedimentos (No Período)
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between py-1.5 border-b border-white">
                        <span className="text-[10px] font-bold text-slate-600">
                          Castrações Efetuadas
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {reportData.stats.castracoes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-white">
                        <span className="text-[10px] font-bold text-slate-600">
                          Cirurgias Gerais
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {reportData.stats.cirurgiasGerais}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 text-crarar-primary">
                        <span className="text-[10px] font-black uppercase">
                          Castrações Comunitários (CRARAR)
                        </span>
                        <span className="text-xs font-black">
                          {reportData.stats.castracoesComunitarios}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-slate-100 pt-6 flex-1">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
                      Distribuição Geográfica por Espécie (Até{" "}
                      {new Date(reportDates.end).toLocaleDateString("pt-BR")})
                    </h3>
                    <div className="grid grid-cols-2 items-center gap-10 px-6">
                      <div className="relative aspect-square w-full max-w-[150px] mx-auto flex items-center justify-center">
                        <svg
                          viewBox="0 0 100 100"
                          className="h-full w-full -rotate-90 overflow-visible"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#f1f5f9"
                            strokeWidth="14"
                          />
                          {
                            reportData.species.reduce(
                              (acc, item, i) => {
                                const colorsArr = [
                                  colors.teal,
                                  colors.mint,
                                  colors.gold,
                                  colors.coral,
                                ];
                                const startPercent = acc.total;
                                const strokeDasharray = `${item.percent} 100`;
                                const strokeDashoffset = `-${startPercent}`;
                                acc.elements.push(
                                  <circle
                                    key={i}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke={colorsArr[i % colorsArr.length]}
                                    strokeWidth="14"
                                    pathLength="100"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                  />,
                                );
                                acc.total += item.percent;
                                return acc;
                              },
                              { total: 0, elements: [] as any },
                            ).elements
                          }
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-black text-slate-900 leading-none">
                            {reportData.stats.totalAnimais}
                          </span>
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Total Animais
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {reportData.species.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-xl border border-slate-100/50"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: [
                                    colors.teal,
                                    colors.mint,
                                    colors.gold,
                                    colors.coral,
                                  ][i],
                                }}
                              ></div>
                              <span className="text-[9px] font-bold text-slate-600">
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-900">
                                {item.value.toString().padStart(2, "0")}
                              </span>
                              <span className="text-[10px] font-bold text-slate-200">
                                |
                              </span>
                              <span className="text-[10px] font-black text-crarar-primary">
                                {Math.round(item.percent)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[7px] font-bold text-slate-300 uppercase">
                      Gerado em {new Date().toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">
                      CRARAR • Painel de Gestão Estratégica
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-30 bg-white dark:bg-slate-950 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="flex items-center justify-center gap-3 rounded-2xl bg-crarar-primary text-white px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-crarar-primary/10 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Exportar Relatório
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-12 text-center leading-relaxed">
            Distribuição de Pacientes por
            <br />
            Espécie (No Período Ativo)
          </h4>

          <div className="relative aspect-square w-full max-w-[260px] mb-10 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full -rotate-90 overflow-visible"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="16"
                className="dark:stroke-slate-800"
              />
              {
                speciesData.reduce(
                  (acc, item, i) => {
                    const colorsArr = [
                      colors.teal,
                      colors.mint,
                      colors.gold,
                      colors.coral,
                    ];
                    const startPercent = acc.total;
                    const strokeDasharray = `${item.percent} 100`;
                    const strokeDashoffset = `-${startPercent}`;
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={colorsArr[i % colorsArr.length]}
                        strokeWidth="16"
                        pathLength="100"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                      />,
                    );
                    acc.total += item.percent;
                    return acc;
                  },
                  { total: 0, elements: [] as any },
                ).elements
              }
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="white"
                className="dark:fill-slate-900"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                {filteredData.animais.length}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Pets
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-5 w-full px-6">
            {speciesData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full shadow-sm"
                    style={{
                      backgroundColor: [
                        colors.teal,
                        colors.mint,
                        colors.gold,
                        colors.coral,
                      ][i],
                    }}
                  ></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] font-black text-slate-400 tracking-tighter w-8 text-right">
                  {Math.round(item.percent)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Fluxo de Atendimento Semanal
            </h4>
            <div className="px-4 py-1.5 bg-[#f8fafc] dark:bg-slate-950 rounded-xl text-[10px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm">
              Total: {weeklyData.reduce((a, b) => a + b.value, 0)} Atendimentos
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col relative group">
            <div className="flex flex-1 w-full">
              <div className="flex flex-col justify-between py-0 text-right pr-4 h-[250px] w-8">
                {ySteps.map((val) => (
                  <span
                    key={val}
                    className="text-[11px] font-black text-slate-300 dark:text-slate-600 leading-none"
                  >
                    {val}
                  </span>
                ))}
              </div>

              <div className="flex-1 h-[250px] relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="gradientFlow"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={colors.teal}
                        stopOpacity="0.12"
                      />
                      <stop
                        offset="100%"
                        stopColor={colors.teal}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {ySteps.map((val) => (
                    <line
                      key={val}
                      x1="0"
                      y1={chartHeight - val * chartScale}
                      x2={chartWidth}
                      y2={chartHeight - val * chartScale}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeOpacity="0.1"
                      className="text-slate-400 dark:text-slate-700"
                    />
                  ))}

                  <path
                    d={`M 0,${chartHeight - weeklyData[0].value * chartScale} 
                       ${weeklyData.map((d, i) => `L ${i * (chartWidth / 6)},${chartHeight - d.value * chartScale}`).join(" ")} 
                       V ${chartHeight} H 0 Z`}
                    fill="url(#gradientFlow)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  <path
                    d={`M 0,${chartHeight - weeklyData[0].value * chartScale} 
                       ${weeklyData.map((d, i) => `L ${i * (chartWidth / 6)},${chartHeight - d.value * chartScale}`).join(" ")}`}
                    fill="none"
                    stroke={colors.teal}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {weeklyData.map((d, i) => {
                    const x = i * (chartWidth / 6);
                    const y = chartHeight - d.value * chartScale;
                    return (
                      <g key={i}>
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          className="text-[12px] font-black fill-slate-900 dark:fill-white transition-all duration-1000"
                        >
                          {d.value}
                        </text>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill="white"
                          stroke={colors.teal}
                          strokeWidth="3"
                          className="transition-all duration-1000 shadow-sm dark:fill-slate-900"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="flex w-full pl-12 mt-4">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-0.5 tracking-tight uppercase">
                    {d.day}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600">
                    {d.fullDate.split("-").slice(1).reverse().join("/")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Novos Tutores",
            value: filteredData.tutores.length,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-900/10",
          },
          {
            label: "Consultas no Período",
            value: filteredData.atendimentos.length,
            icon: Stethoscope,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/10",
          },
          {
            label: "Pets Registrados",
            value: filteredData.animais.length,
            icon: PawPrint,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/10",
          },
          {
            label: "Taxa de Retorno",
            value: `${atendimentos.length > 0 ? Math.round((atendimentos.filter((a) => !!a.proximo_retorno).length / atendimentos.length) * 100) : 0}%`,
            icon: TrendingUp,
            color: "text-pink-600",
            bg: "bg-pink-50 dark:bg-pink-900/10",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:translate-y-[-2px] transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {item.value}
              </h4>
            </div>
            <div
              className={`h-12 w-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}
            >
              <item.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsView;
