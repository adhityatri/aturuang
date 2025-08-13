const useIsYesterday = (date: Date): boolean => {
  const today = new Date();
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
};

export default useIsYesterday;