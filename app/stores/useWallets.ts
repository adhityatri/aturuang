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

  const detailWallet = ref<iWallets>();
  const getWalletById = async (id: string) => {
    try {
      const { data, error } = await client
        .from("wallets")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      return (detailWallet.value = data || []);
    } catch (error) {
      return error;
    }
  };

  const updateWallet = async ({ id, name }: { id: string; name: string }) => {
    try {
      const { data, error } = await client
        .from("wallets")
        .update({ name })
        .eq("id", id)
        .select();

      if (error) throw error;

      detailWallet.value = data ? data[0] : undefined;
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

  const isEditOpen = shallowRef<boolean>(false);

  return {
    wallets,
    detailWallet,
    isEditOpen,
    getWallets,
    updateWallet,
    insert,
    getWalletById,
  };
});

export { useWallets };
