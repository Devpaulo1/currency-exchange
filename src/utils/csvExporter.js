function formatDateForCSV(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatRateForCSV(rate) {
  return rate.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function exportToCSV(data, baseCurrency, targetCurrency) {
  if (!data || data.length === 0) {
    console.warn('exportToCSV: Nenhum dado para exportar');
    return false;
  }

  const headers = ['Data', 'Moeda Origem', 'Moeda Destino', 'Cotação'];

  const rows = data.map(item => [
    formatDateForCSV(item.date),
    baseCurrency,
    targetCurrency,
    formatRateForCSV(item.rate),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const filename = `cotacao_${baseCurrency}_${targetCurrency}_${today}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}