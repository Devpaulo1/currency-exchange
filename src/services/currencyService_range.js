export async function getHistoricalRatesRange(startDate, endDate, base = "BRL", symbols = "") {
  if (!startDate || !endDate) throw new Error("startDate and endDate are required");
  if (base && symbols && base === symbols) return generateMockHistory(startDate, endDate, base, symbols);
  if (!symbols) throw new Error("symbols parameter is required");
  const url = buildUrl(`/${startDate}..${endDate}`, { base, symbols });
  const data = await fetchJson(url);
  return { base: data.base, startDate: data.start_date, endDate: data.end_date, rates: data.rates || {} };
}
