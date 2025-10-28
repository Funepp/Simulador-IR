function baixarSimulacaoPDF(event) {
  if (event) event.preventDefault();
  const resultadoContainer = document.getElementById('resultadoContainer');
  if (!resultadoContainer) return;

  // Extrai dados dos cards principais
  const cards = resultadoContainer.querySelectorAll('.cardResultado-Um, .cardResultado-Dois');
  const cenarios = [];
  cards.forEach(card => {
    let titulo = card.querySelector('.cardTitulo')?.textContent?.trim() || '';
    let linhas = Array.from(card.querySelectorAll('.cardConteudo p')).map(p => p.textContent.trim());
    cenarios.push({ titulo, linhas });
  });

  // Economia de imposto - remove emojis e limpa texto
  const economiaEl = resultadoContainer.querySelector('.rowEconomiaTotal p');
  let economiaTexto = economiaEl ? economiaEl.textContent.trim() : '';
  // Remove emojis e caracteres especiais
  economiaTexto = economiaTexto.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|💡|Ø=Ü¡/gu, '').trim();

  // Quanto falta investir
  const faltaInvestirSpan = resultadoContainer.querySelector('#valorFaltaInvestir');
  const faltaInvestirTexto = faltaInvestirSpan ? faltaInvestirSpan.textContent.trim() : '';

  // Percentual de contribuição
  const barraTexto = resultadoContainer.querySelector('.barra-texto');
  const percentualTexto = barraTexto ? barraTexto.textContent.trim() : '';

  // Verifica se atingiu 12%
  const mensagemSucesso = resultadoContainer.querySelector('.mensagem-sucesso');
  const jaAtingiu12 = !!mensagemSucesso;

  // Informações de contribuição voluntária simulada
  const investidoExtraInput = document.getElementById('investidoExtra');
  const valorSimulado = investidoExtraInput ? investidoExtraInput.value.trim() : '';

  const irAtualizadoEl = document.getElementById('irAtualizadoSimulado');
  const irAtualizadoTexto = irAtualizadoEl && irAtualizadoEl.style.display !== 'none' 
    ? irAtualizadoEl.textContent.trim() 
    : '';

  // Monta o PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margemEsq = 20;
  const margemDir = 190;
  const larguraUtil = margemDir - margemEsq;
  let y = 20;

  // ===== CABEÇALHO =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(37, 132, 198); // azul FUNEPP
  doc.text('Simulação de Incentivo Fiscal FUNEPP', margemEsq, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const dataHora = new Date().toLocaleString('pt-BR');
  doc.text(`Gerado em: ${dataHora}`, margemEsq, y);
  y += 3;

  // Linha divisória
  doc.setDrawColor(37, 132, 198);
  doc.setLineWidth(0.5);
  doc.line(margemEsq, y, margemDir, y);
  y += 10;

  // ===== SEÇÃO: CENÁRIOS =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 132, 198);
  doc.text('Cenários Simulados', margemEsq, y);
  y += 8;

  cenarios.forEach((cenario, idx) => {
    // Verifica se precisa de nova página
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`${idx + 1}. ${cenario.titulo}`, margemEsq, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);

    cenario.linhas.forEach(linha => {
      // Quebra de linha automática se necessário
      const linhasQuebradas = doc.splitTextToSize(linha, larguraUtil - 5);
      linhasQuebradas.forEach(l => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(l, margemEsq + 5, y);
        y += 5;
      });
    });

    y += 3;
    // Linha divisória entre cenários
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margemEsq, y, margemDir, y);
    y += 6;
  });

  // ===== SEÇÃO: ECONOMIA DE IMPOSTO =====
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 132, 198);
  doc.text('Economia de Imposto de Renda', margemEsq, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const economiaSplit = doc.splitTextToSize(economiaTexto, larguraUtil);
  economiaSplit.forEach(l => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(l, margemEsq, y);
    y += 5;
  });
  y += 5;

  // ===== SEÇÃO: CONTRIBUIÇÃO FUNEPP =====
  if (!jaAtingiu12) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 132, 198);
    doc.text('Próximos Passos para o Benefício Máximo', margemEsq, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);

    if (faltaInvestirTexto) {
      const faltaTexto = `Falta investir ${faltaInvestirTexto} em FUNEPP para alcançar o benefício fiscal máximo de 12%.`;
      const faltaSplit = doc.splitTextToSize(faltaTexto, larguraUtil);
      faltaSplit.forEach(l => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(l, margemEsq, y);
        y += 5;
      });
      y += 3;
    }

    if (percentualTexto) {
      doc.text(`Percentual atual de contribuição: ${percentualTexto}`, margemEsq, y);
      y += 8;
    }

    // Se há simulação de aporte extra
    if (valorSimulado && irAtualizadoTexto) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 132, 198);
      doc.text('Simulação de Contribuição Voluntária Adicional', margemEsq, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`Valor simulado: ${valorSimulado}`, margemEsq, y);
      y += 5;

      const irSplit = doc.splitTextToSize(irAtualizadoTexto, larguraUtil);
      irSplit.forEach(l => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(l, margemEsq, y);
        y += 5;
      });
      y += 5;
    }
  } else {
    // Mensagem de sucesso para quem já atingiu 12%
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 132, 198);
    doc.text('Parabéns! Benefício Fiscal Máximo Atingido', margemEsq, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    const sucessoTexto = 'Sua contribuição mensal de 12% na FUNEPP está garantindo o máximo de dedução no Imposto de Renda. Você está aproveitando todo o benefício fiscal disponível e construindo um futuro financeiro sólido!';
    const sucessoSplit = doc.splitTextToSize(sucessoTexto, larguraUtil);
    sucessoSplit.forEach(l => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(l, margemEsq, y);
      y += 5;
    });
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(37, 132, 198);
    doc.text('Quer ir além?', margemEsq, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    const alemTexto = 'A Contribuição Voluntária é uma contribuição extra que você pode fazer quando desejar e no valor que quiser investir. Acesse a Área do Participante para mais informações.';
    const alemSplit = doc.splitTextToSize(alemTexto, larguraUtil);
    alemSplit.forEach(l => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(l, margemEsq, y);
      y += 5;
    });
    y += 5;
  }

  // ===== RODAPÉ =====
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    
    // Linha divisória no rodapé
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(margemEsq, 280, margemDir, 280);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Os valores apresentados são estimativas e servem apenas para referência.', margemEsq, 285);
    
    // Número da página
    doc.setFont('helvetica', 'normal');
    doc.text(`Página ${i} de ${totalPaginas}`, margemDir - 20, 289);
  }

  // Salva o PDF
  const nomeArquivo = `Simulacao_FUNEPP_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nomeArquivo);
}
