export const useMonthlyStart = (
  startDay: number = Number(useBudgets().budgets?.[0]?.monthly_start)
) => {
  const now = new Date();
  const currentDay = now.getDate();

  const startDate = ref();
  const endDate = ref();

  const getValidDate = (
    year: number,
    month: number,
    day: number,
    isEnd: boolean = false
  ) => {
    const date = new Date(year, month + 1, 0);
    const daysInMonth = date.getDate();
    const validDay = Math.min(day, daysInMonth);

    if (isEnd) {
      return new Date(year, month, validDay, 23, 59, 59, 999);
    }
    return new Date(year, month, validDay, 0, 0, 0, 0);
  };

  if (currentDay >= startDay) {
    // Jika hari ini >= startDay → periode dimulai dari startDay bulan ini
    startDate.value = getValidDate(now.getFullYear(), now.getMonth(), startDay);

    // Akhir periode: startDay - 1 bulan depan
    endDate.value = getValidDate(
      now.getFullYear(),
      now.getMonth() + 1,
      startDay - 1,
      true
    );
  } else {
    // Jika hari ini < startDay → periode dimulai dari startDay bulan lalu
    startDate.value = getValidDate(
      now.getFullYear(),
      now.getMonth() - 1,
      startDay
    );

    // Akhir periode: startDay - 1 bulan ini
    endDate.value = getValidDate(
      now.getFullYear(),
      now.getMonth(),
      startDay - 1,
      true
    );
  }

  return {
    startDate,
    endDate,
  };
};
