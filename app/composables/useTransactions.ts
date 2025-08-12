import type { iTransaction } from "~/types/transactions";

export const useTransactions = () => {
  const supabaseClient = useSupabaseClient();

  const getTransactions = async () => {
    const { data, error } = await supabaseClient
      .from("transactions")
      .select(
        `id,
          created_at,
          amount,
          notes,
          categories!inner(name, type)`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    return data as iTransaction[];
  };

  return {
    getTransactions
  }
};
