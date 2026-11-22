import type { categoryType, iCategory } from "~/types/category";

export const useCategory = defineStore("category-store", () => {
  const categories = ref<iCategory[]>([]);
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const isLoading = ref(false);
  const getCategoryByType = async (type: categoryType) => {
    try {
      isLoading.value = true;

      let query = supabase.from("categories").select().neq("id", "23").neq("id", "24");

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
    } finally {
      isLoading.value = false;
    }
  };

  const selectedCategory = ref<iCategory>();
  const itemList = computed(() =>
    categories.value?.map((item) => {
      return {
        label: item.name,
        icon: item.icon,
        id: item.id,
        category: item.type,
        created_at: item.created_at,
      };
      // return { label: item.name, value: item.id };
    }),
  );
  // ... di dalam return useCategory
  const insert = async (item: { name: string; type: categoryType; icon: string }) => {
    try {
      const payload = { ...item, created_by: user.value };
      const { data, error } = await supabase.from("categories").insert(payload).select().single();
      if (error) throw error;
      categories.value.unshift(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  return { categories, itemList, isLoading, getCategoryByType, selectedCategory, insert };
});
