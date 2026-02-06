
// import React from 'react';
// import { jsPDF } from 'jspdf';
// import { Download } from 'lucide-react';
// import { Animal, Tutor, Atendimento } from '../types';

// interface GerarPDFProps {
//   animal: Animal;
//   tutor: Tutor;
//   atendimentos: Atendimento[];
// }

// const GerarPDF: React.FC<GerarPDFProps> = ({ animal, tutor, atendimentos }) => {
//   const calcularIdade = (birthDate: string) => {
//     if (!birthDate) return 'N/A';
//     const birth = new Date(birthDate);
//     const today = new Date();
//     let age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }
//     return age === 0 ? 'Menos de 1 ano' : `${age} ${age > 1 ? 'anos' : 'ano'}`;
//   };

//   const formatDate = (dateString?: string | null) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('pt-BR');
//   };

//   const handleGeneratePDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 20;
//     let yPosition = 30;

//     // Cabeçalho
//     doc.setFontSize(20);
//     doc.setTextColor(59, 122, 87); // Cor do tema (#3B7A57)
//     doc.text('CRARAR - Sistema de Gestão Veterinária', pageWidth / 2, yPosition, { align: 'center' });
    
//     yPosition += 10;
//     doc.setFontSize(14);
//     doc.setTextColor(0, 0, 0);
//     doc.text('Relatório Detalhado do Animal', pageWidth / 2, yPosition, { align: 'center' });
    
//     yPosition += 20;

//     // Dados do Animal
//     doc.setFontSize(14);
//     doc.setTextColor(59, 122, 87);
//     doc.text('DADOS DO ANIMAL', margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     const animalInfo = [
//       `Nome: ${animal.nome}`,
//       `Espécie: ${animal.especie}`,
//       `Raça: ${animal.raca}`,
//       `Sexo: ${animal.sexo}`,
//       `Cor: ${animal.cor}`,
//       `Peso: ${animal.peso} kg`,
//       `Idade: ${calcularIdade(animal.data_nascimento)}`,
//       `Data de Adesão: ${formatDate(animal.data_adesao)}`
//     ];

//     animalInfo.forEach((info, index) => {
//       if (index % 2 === 0) {
//         doc.text(info, margin, yPosition);
//       } else {
//         doc.text(info, pageWidth / 2, yPosition);
//         yPosition += 6;
//       }
//     });

//     if (animalInfo.length % 2 !== 0) yPosition += 6;
//     yPosition += 10;

//     // Dados do Tutor
//     doc.setFontSize(14);
//     doc.setTextColor(59, 122, 87);
//     doc.text('DADOS DO TUTOR', margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     const tutorInfo = [
//       `Nome: ${tutor.nome}`,
//       `CPF: ${tutor.cpf || 'N/A'}`,
//       `Telefone: ${tutor.telefone}`,
//       tutor.email ? `Email: ${tutor.email}` : null,
//     ].filter(Boolean);

//     tutorInfo.forEach((info, index) => {
//       if (info) {
//         if (index % 2 === 0) {
//           doc.text(info, margin, yPosition);
//         } else {
//           doc.text(info, pageWidth / 2, yPosition);
//           yPosition += 6;
//         }
//       }
//     });

//     if (tutorInfo.length % 2 !== 0) yPosition += 6;
//     if (tutor.endereco) {
//       yPosition += 2;
//       doc.text(`Endereço: ${tutor.endereco}`, margin, yPosition);
//       yPosition += 6;
//     }
//     yPosition += 10;

//     // Histórico de Atendimentos
//     doc.setFontSize(14);
//     doc.setTextColor(59, 122, 87);
//     doc.text(`HISTÓRICO DE ATENDIMENTOS (${atendimentos.length})`, margin, yPosition);
//     yPosition += 10;

//     if (atendimentos.length > 0) {
//       atendimentos.forEach((atendimento, index) => {
//         if (yPosition > 250) {
//           doc.addPage();
//           yPosition = 30;
//         }

//         doc.setFontSize(12);
//         doc.setTextColor(59, 122, 87);
//         doc.text(`Atendimento ${index + 1} - ${formatDate(atendimento.data)}`, margin, yPosition);
//         yPosition += 8;

//         doc.setFontSize(10);
//         doc.setTextColor(0, 0, 0);
        
//         const atendimentoInfo = [
//           `Veterinário: ${atendimento.veterinario}`,
//           `Sintomas: ${atendimento.sintomas}`,
//           `Diagnóstico: ${atendimento.diagnostico}`,
//           `Tratamento: ${atendimento.tratamento}`,
//         ];

//         if (atendimento.medicamentos) {
//           atendimentoInfo.push(`Medicamentos: ${atendimento.medicamentos}`);
//         }
//         if (atendimento.observacoes) {
//           atendimentoInfo.push(`Observações: ${atendimento.observacoes}`);
//         }
//         if (atendimento.proximo_retorno) {
//           atendimentoInfo.push(`Próximo retorno: ${formatDate(atendimento.proximo_retorno)}`);
//         }

//         atendimentoInfo.forEach(info => {
//           const lines = doc.splitTextToSize(info, pageWidth - 2 * margin);
//           lines.forEach((line: string) => {
//             if (yPosition > 280) {
//               doc.addPage();
//               yPosition = 30;
//             }
//             doc.text(line, margin, yPosition);
//             yPosition += 5;
//           });
//         });

//         yPosition += 5;
//       });
//     } else {
//       doc.setFontSize(10);
//       doc.setTextColor(128, 128, 128);
//       doc.text('Nenhum atendimento registrado', margin, yPosition);
//     }

//     // Rodapé
//     const now = new Date();
//     doc.setFontSize(8);
//     doc.setTextColor(128, 128, 128);
//     doc.text(`Relatório gerado em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, margin, doc.internal.pageSize.height - 10);

//     // Salvar o PDF
//     doc.save(`Relatorio_${animal.nome}_${now.toISOString().split('T')[0]}.pdf`);
//   };

//   return (
//     <button
//       onClick={handleGeneratePDF}
//       className="flex items-center gap-2 rounded-xl bg-crarar-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-crarar-primary/90 transition-all"
//     >
//       <Download className="h-4 w-4" />
//       Gerar PDF
//     </button>
//   );
// };

// export default GerarPDF;





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
    let yPosition = 15;

      // --- CONFIGURAÇÃO DA MARCA D'ÁGUA ---
            try {
              const imgProps = doc.getImageProperties('CRARAR_logo.png');
              const larguraMarcaAgua = 120; // Tamanho maior para o fundo
              const alturaMarcaAgua = (imgProps.height * larguraMarcaAgua) / imgProps.width;
              
              // 1. Salva o estado atual (para não afetar o texto depois)
              doc.saveGraphicsState(); 
              
              // 2. Define a transparência (0.1 é bem discreto, 1.0 é opaco)
              doc.setGState(new doc.GState({ opacity: 0.08 })); 
              
              // 3. Desenha a imagem no centro da página
              doc.addImage(
                'CRARAR_logo.png',
                'PNG',
                (pageWidth - larguraMarcaAgua) / 2, // Centraliza X
                ((doc.internal.pageSize.height - alturaMarcaAgua) / 2)-40, // Centraliza Y
                larguraMarcaAgua,
                alturaMarcaAgua,
                undefined,
                'FAST' // Melhora performance de renderização
              );
              
              // 4. Restaura a opacidade total para o restante do texto
              doc.restoreGraphicsState(); 
            } catch (e) {
              console.warn("Erro ao inserir marca d'água");
            }
// ------------------------------------


    // Logo Centralizada no Topo
    // try {
    //   // Tenta adicionar a logo. Caso o arquivo não exista no ambiente, o PDF continua sem a imagem para evitar erro fatal.
    //   doc.addImage('CRARAR_logo.png', 'PNG', (pageWidth - 30) / 2, yPosition, 30, 30);
    //   yPosition += 35;
    // } catch (e) {
    //   console.warn("Logo não encontrada no caminho /public/CRARAR_logo.png");
    //   yPosition += 10;
    // }

      try {
      const imgProps = doc.getImageProperties('CRARAR_logo.png');
      const larguraDesejada = 30; // largura que você quer no PDF
      
      // Cálculo da altura proporcional: (Altura Original / Largura Original) * Largura Desejada
      const alturaProporcional = (imgProps.height * larguraDesejada) / imgProps.width;
      
      // Centraliza horizontalmente com a altura calculada
      doc.addImage(
        'CRARAR_logo.png', 
        'PNG', 
        (pageWidth - larguraDesejada) / 2, 
        yPosition, 
        larguraDesejada, 
        alturaProporcional
      );
      
      // Pula a altura da imagem + um respiro (5mm)
      yPosition += alturaProporcional + 10; 
    } catch (e) {
      console.warn("Logo não encontrada ou erro ao calcular dimensões.");
      yPosition += 5;
    }


    // Cabeçalho
    doc.setFontSize(14);
    doc.setTextColor(59, 122, 87); // Cor do tema (#3B7A57)
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE RESGATE, ACOLHIMENTO E REINTEGRAÇÃO DE ANIMAIS DE RUA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('PRONTUÁRIO CLÍNICO INDIVIDUAL', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Dados do Animal
    doc.setFontSize(13);
    doc.setTextColor(59, 122, 87);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', margin, yPosition);
    yPosition += 2;
    doc.setDrawColor(59, 122, 87);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    const animalInfo = [
      `Nome: ${animal.nome}`,
      `Espécie: ${animal.especie}`,
      `Raça: ${animal.raca}`,
      `Sexo: ${animal.sexo}`,
      `Peso: ${animal.peso} kg`,
      `Idade: ${calcularIdade(animal.data_nascimento)}`,
      `Nascimento: ${formatDate(animal.data_nascimento)}`,
      `Adesão: ${formatDate(animal.data_adesao)}`
    ];

    animalInfo.forEach((info, index) => {
      if (index % 2 === 0) {
        doc.text(info, margin, yPosition);
      } else {
        doc.text(info, pageWidth / 2 + 10, yPosition);
        yPosition += 6;
      }
    });

    if (animalInfo.length % 2 !== 0) yPosition += 6;
    yPosition += 6;

    // Dados do Tutor
    doc.setFontSize(13);
    doc.setTextColor(59, 122, 87);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO RESPONSÁVEL', margin, yPosition);
    yPosition += 2;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    const tutorInfo = [
      `Nome: ${tutor.nome}`,
      `Telefone: ${tutor.telefone}`,
      `CPF: ${tutor.cpf || 'N/A'}`,
      `Email: ${tutor.email || 'N/A'}`
    ];

    tutorInfo.forEach((info, index) => {
      if (index % 2 === 0) {
        doc.text(info, margin, yPosition);
      } else {
        doc.text(info, pageWidth / 2 + 10, yPosition);
        yPosition += 6;
      }
    });

    if (tutorInfo.length % 2 !== 0) yPosition += 6;
    if (tutor.endereco) {
      const addrLines = doc.splitTextToSize(`Endereço: ${tutor.endereco}`, pageWidth - 2 * margin);
      doc.text(addrLines, margin, yPosition);
      yPosition += (addrLines.length * 5) + 2;
    }
    
    yPosition += 6;

    // Histórico de Atendimentos
    doc.setFontSize(13);
    doc.setTextColor(59, 122, 87);
    doc.setFont('helvetica', 'bold');
    doc.text(`EVOLUÇÃO CLÍNICA (${atendimentos.length})`, margin, yPosition);
    yPosition += 2;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    let hasObito = false;

    if (atendimentos.length > 0) {
      atendimentos.forEach((atendimento, index) => {
        if (atendimento.obito) hasObito = true;

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(11);
        doc.setTextColor(59, 122, 87);
        doc.setFont('helvetica', 'bold');
        doc.text(`Consulta em ${formatDate(atendimento.data)} - Dr(a). ${atendimento.veterinario}`, margin, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        
        const details = [
          { label: 'Sintomas:', content: atendimento.sintomas },
          { label: 'Diagnóstico:', content: atendimento.diagnostico },
          { label: 'Conduta:', content: atendimento.tratamento }
        ];

        if (atendimento.medicamentos) details.push({ label: 'Prescrição:', content: atendimento.medicamentos });

        details.forEach(detail => {
          doc.setFont('helvetica', 'bold');
          doc.text(detail.label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          
          const textContent = doc.splitTextToSize(detail.content, pageWidth - 2 * margin - 25);
          doc.text(textContent, margin + 25, yPosition);
          yPosition += (textContent.length * 4.5) + 2;

          if (yPosition > 280) {
            doc.addPage();
            yPosition = 30;
          }
        });

        if (atendimento.obito) {
          doc.setTextColor(220, 38, 38);
          doc.setFont('helvetica', 'bold');
          doc.text('● ÓBITO REGISTRADO NESTE ATENDIMENTO', margin, yPosition);
          doc.setTextColor(50, 50, 50);
          yPosition += 6;
        }

        yPosition += 4;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'italic');
      doc.text('Sem histórico de atendimentos registrados.', margin, yPosition);
      yPosition += 10;
    }

    // Destaque de ÓBITO se houver
    if (hasObito) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      yPosition += 5;
      doc.setDrawColor(220, 38, 38);
      doc.setFillColor(254, 242, 242);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 18, 'FD');
      
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ÓBITO CONFIRMADO EM PRONTUÁRIO', pageWidth / 2, yPosition + 11, { align: 'center' });
      yPosition += 25;
    }

    // Rodapé
    const now = new Date();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Documento emitido em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, margin, doc.internal.pageSize.height - 10);
    doc.text(`CRARAR - Centro de Referência Animal`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });

    // Salvar o PDF
    doc.save(`Prontuario_${animal.nome}_${now.toISOString().split('T')[0]}.pdf`);
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
