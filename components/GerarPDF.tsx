
import React from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { Animal, Tutor, Atendimento } from '../types';

interface GerarPDFProps {
  animal: Animal;
  tutor: Tutor;
  atendimentos: Atendimento[];
}

const GerarPDF: React.FC<GerarPDFProps> = ({ animal, tutor, atendimentos }) => {
  const calcularIdade = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age === 0 ? 'Menos de 1 ano' : `${age} ${age > 1 ? 'anos' : 'ano'}`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(59, 122, 87); // Cor do tema (#3B7A57)
    doc.text('CRARAR - Sistema de Gestão Veterinária', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório Detalhado do Animal', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Dados do Animal
    doc.setFontSize(14);
    doc.setTextColor(59, 122, 87);
    doc.text('DADOS DO ANIMAL', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const animalInfo = [
      `Nome: ${animal.nome}`,
      `Espécie: ${animal.especie}`,
      `Raça: ${animal.raca}`,
      `Sexo: ${animal.sexo}`,
      `Cor: ${animal.cor}`,
      `Peso: ${animal.peso} kg`,
      `Idade: ${calcularIdade(animal.data_nascimento)}`,
      `Data de Adesão: ${formatDate(animal.data_adesao)}`
    ];

    animalInfo.forEach((info, index) => {
      if (index % 2 === 0) {
        doc.text(info, margin, yPosition);
      } else {
        doc.text(info, pageWidth / 2, yPosition);
        yPosition += 6;
      }
    });

    if (animalInfo.length % 2 !== 0) yPosition += 6;
    yPosition += 10;

    // Dados do Tutor
    doc.setFontSize(14);
    doc.setTextColor(59, 122, 87);
    doc.text('DADOS DO TUTOR', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const tutorInfo = [
      `Nome: ${tutor.nome}`,
      `CPF: ${tutor.cpf || 'N/A'}`,
      `Telefone: ${tutor.telefone}`,
      tutor.email ? `Email: ${tutor.email}` : null,
    ].filter(Boolean);

    tutorInfo.forEach((info, index) => {
      if (info) {
        if (index % 2 === 0) {
          doc.text(info, margin, yPosition);
        } else {
          doc.text(info, pageWidth / 2, yPosition);
          yPosition += 6;
        }
      }
    });

    if (tutorInfo.length % 2 !== 0) yPosition += 6;
    if (tutor.endereco) {
      yPosition += 2;
      doc.text(`Endereço: ${tutor.endereco}`, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 10;

    // Histórico de Atendimentos
    doc.setFontSize(14);
    doc.setTextColor(59, 122, 87);
    doc.text(`HISTÓRICO DE ATENDIMENTOS (${atendimentos.length})`, margin, yPosition);
    yPosition += 10;

    if (atendimentos.length > 0) {
      atendimentos.forEach((atendimento, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(12);
        doc.setTextColor(59, 122, 87);
        doc.text(`Atendimento ${index + 1} - ${formatDate(atendimento.data)}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const atendimentoInfo = [
          `Veterinário: ${atendimento.veterinario}`,
          `Sintomas: ${atendimento.sintomas}`,
          `Diagnóstico: ${atendimento.diagnostico}`,
          `Tratamento: ${atendimento.tratamento}`,
        ];

        if (atendimento.medicamentos) {
          atendimentoInfo.push(`Medicamentos: ${atendimento.medicamentos}`);
        }
        if (atendimento.observacoes) {
          atendimentoInfo.push(`Observações: ${atendimento.observacoes}`);
        }
        if (atendimento.proximo_retorno) {
          atendimentoInfo.push(`Próximo retorno: ${formatDate(atendimento.proximo_retorno)}`);
        }

        atendimentoInfo.forEach(info => {
          const lines = doc.splitTextToSize(info, pageWidth - 2 * margin);
          lines.forEach((line: string) => {
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 30;
            }
            doc.text(line, margin, yPosition);
            yPosition += 5;
          });
        });

        yPosition += 5;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Nenhum atendimento registrado', margin, yPosition);
    }

    // Rodapé
    const now = new Date();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Relatório gerado em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, margin, doc.internal.pageSize.height - 10);

    // Salvar o PDF
    doc.save(`Relatorio_${animal.nome}_${now.toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button
      onClick={handleGeneratePDF}
      className="flex items-center gap-2 rounded-xl bg-crarar-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-crarar-primary/90 transition-all"
    >
      <Download className="h-4 w-4" />
      Gerar PDF
    </button>
  );
};

export default GerarPDF;
