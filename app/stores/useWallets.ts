import type { iWallets, iWalletMember, WalletMemberRole } from "~/types/wallets";

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
      const { data: memberRows, error: memberError } = await client
        .from("wallet_member")
        .select("wallet_id")
        .eq("user_id", user.value.id);
      if (memberError) throw memberError;

      const memberIds = [...new Set((memberRows || []).map((r: any) => r.wallet_id))];
      let query = client.from("wallets").select("*");
      query =
        memberIds.length > 0
          ? query.or(`created_by.eq.${user.value.id},id.in.(${memberIds.join(",")})`)
          : query.eq("created_by", user.value.id);

      const { data, error } = await query
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
  const isMemberOpen = shallowRef<boolean>(false);

  const members = ref<iWalletMember[]>([]);
  const isMemberLoading = ref<boolean>(false);

  const getMembers = async (walletId: string) => {
    isMemberLoading.value = true;
    try {
      const { data, error } = await client.rpc("get_wallet_members", {
        p_wallet_id: walletId,
      });
      if (error) throw error;
      members.value = (data as iWalletMember[]) || [];
      return { data: members.value, error: null };
    } catch (error: any) {
      return { data: null, error };
    } finally {
      isMemberLoading.value = false;
    }
  };

  const addMember = async (walletId: string, email: string, role: WalletMemberRole) => {
    try {
      const { data: found, error: findError } = await client.rpc("find_user_by_email", {
        p_email: email.trim().toLowerCase(),
      });
      if (findError) throw findError;

      const user = Array.isArray(found) ? found[0] : found;
      if (!user?.id) {
        return { data: null, error: { message: "Email tidak ditemukan" } };
      }

      const { data, error } = await client
        .from("wallet_member")
        .insert({ wallet_id: walletId, user_id: user.id, role })
        .select()
        .single();

      if (error) throw error;
      await getMembers(walletId);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const updateMemberRole = async (memberId: string, walletId: string, role: WalletMemberRole) => {
    try {
      const { data, error } = await client
        .from("wallet_member")
        .update({ role })
        .eq("id", memberId)
        .select()
        .single();
      if (error) throw error;
      await getMembers(walletId);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const removeMember = async (memberId: string, walletId: string) => {
    try {
      const { error } = await client.from("wallet_member").delete().eq("id", memberId);
      if (error) throw error;
      await getMembers(walletId);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // lifeCycle hooks
  const initialize = async () => {
    await getWallets(true);
    setupRealtime();
  };

  return {
    wallets,
    detailWallet,
    isEditOpen,
    isMemberOpen,
    members,
    isMemberLoading,
    getWallets,
    updateWallet,
    insert,
    getWalletById,
    getMembers,
    addMember,
    updateMemberRole,
    removeMember,
    initialize,
    isFetching,
    lastFetched,
    setupRealtime,
    teardownRealtime,
  };
});

export { useWallets };
