// ====== SISTEM KABISAT (LEAP YEAR UTILITIES) ======
/**
 * Menghitung apakah tahun tertentu adalah tahun kabisat.
 * Tahun kabisat: habis dibagi 4, tapi jika habis dibagi 100 harus habis dibagi 400.
 */
export function isLeapYear(year: number): boolean {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
}

/**
 * Mendapatkan jumlah hari dalam bulan tertentu pada tahun tertentu (mendukung tahun kabisat untuk Februari).
 */
export function getDaysInMonth(year: number, month: number): number {
  // month: 1 = Januari, 2 = Februari, dst.
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1] || 30;
}

/**
 * Menghitung penyesuaian jadwal pengiriman/produksi jika melewati tahun kabisat.
 */
export function calculateLeapYearAdjustment(startDate: Date, daysToAdd: number): Date {
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + daysToAdd);
  return targetDate;
}
