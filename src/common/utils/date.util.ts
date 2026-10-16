// ==========================================================
// Utilidad simple de fechas usada para expiracion de tokens.
// ==========================================================
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
