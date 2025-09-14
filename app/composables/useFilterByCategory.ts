export const useFilterByCategory = (data: any, categoryType: string) => {
  return data
    .map((item: { value: any[] }) => {
      // Pastikan 'value' adalah array sebelum melakukan filter
      if (!Array.isArray(item.value)) {
        return { ...item, value: [] }; // Kembalikan item dengan value kosong jika tidak valid
      }

      const filteredValues = item.value.filter(
        (valueItem) => valueItem.category_type === categoryType
      );
      return { ...item, value: filteredValues };
    })
    .filter((item: { value: any[] }) => item.value.length > 0); // Hapus item yang 'value'-nya menjadi kosong
};
