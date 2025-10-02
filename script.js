function baixarSimulacaoPDF(event) {
  if (event) event.preventDefault();
  const resultadoContainer = document.getElementById('resultadoContainer');
  if (!resultadoContainer) return;

  // Extrai os textos dos cards principais
  const cards = resultadoContainer.querySelectorAll('.cardConteudo');
  const cenarios = [];
  cards.forEach(card => {
    let titulo = card.parentElement.querySelector('.cardTitulo')?.textContent?.trim() || '';
    let linhas = Array.from(card.querySelectorAll('p')).map(p => p.textContent.trim());
    cenarios.push({ titulo, linhas });
  });

  // Economia de imposto
  const economiaSpan = resultadoContainer.querySelector('.economia span');
  const economiaTexto = economiaSpan ? economiaSpan.textContent.trim() : '';

  // Quanto falta investir
  const faltaInvestirSpan = resultadoContainer.querySelector('#valorFaltaInvestir');
  const faltaInvestirTexto = faltaInvestirSpan ? faltaInvestirSpan.textContent.trim() : '';

  // Percentual de contribuição
  const barraTexto = resultadoContainer.querySelector('.barra-texto');
  const percentualTexto = barraTexto ? barraTexto.textContent.trim() : '';

  // Monta o PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'A4'
  });

  // Cabeçalho ABNT
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('Simulação de Incentivo Fiscal FUNEPP', 20, 25);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text('Relatório gerado automaticamente pelo Simulador FUNEPP.', 20, 33);

  // Linha divisória
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(20, 37, 190, 37);

  let y = 45;

  // Adiciona cenários
  cenarios.forEach(cenario => {
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(cenario.titulo, 20, y);
    y += 7;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    cenario.linhas.forEach(linha => {
      doc.text(linha, 25, y);
      y += 7;
    });

    // Linha divisória entre cenários
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.2);
    doc.line(22, y, 188, y);
    y += 8;
  });

  // Economia de imposto
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('Economia de Imposto:', 20, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text(`Você pode economizar ${economiaTexto} em Imposto de Renda por ano se investir 12% na FUNEPP.`, 25, y + 7);
  y += 15;

  // Linha divisória
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(22, y, 188, y);
  y += 8;

  // Quanto falta investir
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('Para atingir o benefício fiscal máximo:', 20, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text(`Falta investir ${faltaInvestirTexto} em FUNEPP.`, 25, y + 7);
  y += 15;

  // Linha divisória
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(22, y, 188, y);
  y += 8;

  // Percentual de contribuição
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('Percentual de contribuição na FUNEPP:', 20, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text(percentualTexto, 25, y + 7);
  y += 15;

  // Linha divisória
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(20, 265, 190, 265);

  // Rodapé ABNT
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.text('Os valores apresentados são estimativas e servem apenas para referência. Para informações detalhadas, consulte a FUNEPP.', 20, 273, { maxWidth: 170 });

  // Data da simulação
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const data = new Date().toLocaleDateString();
  doc.text(`Data da simulação: ${data}`, 20, 282);

  // Salva o PDF (não recarrega a página)
  doc.save('Simulacao_FUNEPP.pdf');
}