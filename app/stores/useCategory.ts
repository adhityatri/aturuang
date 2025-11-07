import type { categoryType, iCategory } from "~/types/category";

export const useCategory = defineStore("category-store", () => {
  const categories = ref<iCategory[]>([]);
  const supabase = useSupabaseClient();

  const getCategoryByType = async (type: categoryType) => {
    try {
      let query = supabase
        .from("categories")
        .select()
        .neq("id", "23")
        .neq("id", "24");

      if (type === "all") {
        query = query.in("type", ["income", "expenses"]);
      } else {
        query = query.eq("type", type);
      }
      const { data, error } = await query;

      if (error) throw error;
      categories.value = data || [];
    } catch (error) {
      console.log(error);
    }
  };

  return {
    categories,
    getCategoryByType,
  };
});
