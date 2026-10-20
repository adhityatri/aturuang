import type { iWallets } from "~/types/wallets";

const useWallets = defineStore("wallets-store", () => {
  const client = useSupabaseClient();
  const wallets = ref<iWallets[]>([]);
  const user = useSupabaseUser();

  const isFetching = ref<boolean>(false);

  let realtimeChannel: Subscription | null = null;

  const lastFetched = ref<number>(0);
  const CACHE_TTL = 45 * 1000; // 45 seconds
  const isCacheFresh = () => Date.now() - lastFetched.value < CACHE_TTL;

  const getWallets = async (force: boolean = false) => {
    if (!force && isCacheFresh() && wallets.value.length > 0) {
      return wallets.value;
    }

    if (!user.value?.id || isFetching.value) {
      return wallets.value;
    }

    isFetching.value = true;
    try {
      const { data, error } = await client
        .from("wallets")
        .select("*")
        .eq("created_by", user.value.id)
        .order("amount", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;

      wallets.value = data || [];
      lastFetched.value = Date.now();
      return wallets.value || [];
    } catch (err) {
      console.error("Error Fetching Wallets : ", err);
      return wallets.value;
    } finally {
      isFetching.value = false;
    }
  };

  const setupRealtime = () => {
    if (!user.value?.id || realtimeChannel) return;

    realtimeChannel = client
      .channel("wallet-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallets",
          filter: `created_by=eq.${user.value.id}`,
        },
        () => {
          lastFetched.value = 0;
          getWallets(true).catch(() => {});
        },
      )
      .subscribe();

    return realtimeChannel;
  };

  // cleanup realtime
  const teardownRealtime = () => {
    if (realtimeChannel) {
      client.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  };

  const detailWallet = ref<iWallets>();
  const getWalletById = async (id: string) => {
    try {
      const { data, error } = await client.from("wallets").select("*").eq("id", id).single();
      if (error) throw error;

      return (detailWallet.value = data || []);
    } catch (error) {
      return error;
    }
  };

  const updateWallet = async ({
    id,
    name,
    amount,
  }: {
    id: string;
    name: string;
    amount: number;
  }) => {
    try {
      const { data, error } = await client
        .from("wallets")
        .update({ name, amount })
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

      lastFetched.value = 0;
      await getWallets(true);
      // wallets.value = data || [];
      return { data, error };
    } catch (err) {
      return err;
    }
  };

  const isEditOpen = shallowRef<boolean>(false);

  // lifeCycle hooks
  const initialize = async () => {
    await getWallets(true);
    setupRealtime();
  };

  return {
    wallets,
    detailWallet,
    isEditOpen,
    getWallets,
    updateWallet,
    insert,
    getWalletById,
    initialize,
    isFetching,
    lastFetched,
    setupRealtime,
    teardownRealtime,
  };
});

export { useWallets };
