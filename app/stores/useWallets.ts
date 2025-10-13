import type { iWallets } from "~/types/wallets";

const useWallets = defineStore("wallets-store", () => {
  const client = useSupabaseClient();
  const wallets = ref<iWallets[]>([]);
  const getWallets = async () => {
    try {
      const { data, error } = await client
        .from("wallets")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;

      wallets.value = data || [];
      return wallets.value || [];
    } catch (err) {
      return err;
    }
  };

  const updateWallet = async ({ id, name, amount }: any) => {
    try {
      const { data, error } = await client
        .from("wallets")
        .update({
          name: name,
          amount: amount,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      wallets.value = data || [];
      return { data, error };
    } catch (err) {
      return err;
    }
  };

  const insert = async ({ name, amount }: { name: string; amount: number }) => {
    try {
      const { data, error } = await client
        .from("wallets")
        .insert({ name: name, amount: amount })
        .select();

      if (error) throw error;

      wallets.value = data || [];
      return { data, error };
    } catch (err) {
      return err;
    }
  };

  return {
    wallets,
    getWallets,
    updateWallet,
    insert,
  };
});

export { useWallets };
