import type { iWishlist, iWishlistContribution } from "~/types/wishlist";

const useWishlist = defineStore("wishlist-store", () => {
    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const wishlists = ref<iWishlist[]>([]);
    const detailWishlist = ref<iWishlist | null>(null);
    const contributions = ref<iWishlistContribution[]>([]);

    const getWishlists = async () => {
        if (!user.value?.id) return [];
        try {
            const { data, error } = await client.from("wishlist").select("*").eq("user_id", user.value.id);
            if (error) throw error;
            wishlists.value = (data as iWishlist[]) || [];
            return wishlists.value;
        } catch (err) {
            console.error("Error Fetching Wishlists : ", err);
            return [];
        }
    };

    const addWishlist = async ({ name, target_amount, wallet_id, notes }: { name: string; target_amount: number; wallet_id?: string; notes?: string }) => {
        if (!user.value?.id) return { error: { message: "User not found" } };
        try {
            const { data, error } = await client.from("wishlist").insert({
                user_id: user.value.id,
                wallet_id: wallet_id || null,
                name,
                target_amount,
                current_amount: 0,
                notes: notes || null,
            }).select().single();
            if (error) throw error;
            await getWishlists();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const getWishlistById = async (id: string) => {
        try {
            const { data, error } = await client.from("wishlist").select("*").eq("id", id).single();
            if (error) throw error;
            detailWishlist.value = data as iWishlist;
            return detailWishlist.value;
        } catch (err) {
            return null;
        }
    };

    const getContributions = async (wishlistId: string) => {
        try {
            const { data, error } = await client
                .from("wishlist_contributions")
                .select("*")
                .eq("wishlist_id", wishlistId)
                .order("created_at", { ascending: false });
            if (error) throw error;
            contributions.value = (data as iWishlistContribution[]) || [];
            return contributions.value;
        } catch (err) {
            return [];
        }
    };

    const updateWishlist = async (
        id: string,
        payload: Partial<{ name: string; target_amount: number; wallet_id: string | null; notes: string | null }>,
    ) => {
        try {
            const { data, error } = await client
                .from("wishlist")
                .update(payload)
                .eq("id", id)
                .select()
                .single();
            if (error) throw error;
            detailWishlist.value = data as iWishlist;
            await getWishlists();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const addContribution = async (wishlistId: string, amount: number, note?: string) => {
        if (!user.value?.id) return { error: { message: "User not found" } };
        try {
            const { error: insErr } = await client.from("wishlist_contributions").insert({
                wishlist_id: wishlistId,
                user_id: user.value.id,
                amount,
                note: note || null,
            });
            if (insErr) throw insErr;

            await Promise.all([getWishlistById(wishlistId), getContributions(wishlistId), getWishlists()]);
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    const deleteContribution = async (contributionId: string, wishlistId: string, amount: number) => {
        if (!user.value?.id) return { error: { message: "User not found" } };
        try {
            const { error: delErr } = await client
                .from("wishlist_contributions")
                .delete()
                .eq("id", contributionId);
            if (delErr) throw delErr;

            await Promise.all([getWishlistById(wishlistId), getContributions(wishlistId), getWishlists()]);
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    const updateContribution = async (contributionId: string, wishlistId: string, newAmount: number) => {
        if (!user.value?.id) return { error: { message: "User not found" } };
        try {
            const { error: updErr } = await client
                .from("wishlist_contributions")
                .update({ amount: newAmount })
                .eq("id", contributionId);
            if (updErr) throw updErr;

            await Promise.all([getWishlistById(wishlistId), getContributions(wishlistId), getWishlists()]);
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    return {
        wishlists,
        detailWishlist,
        contributions,
        getWishlists,
        getWishlistById,
        getContributions,
        addWishlist,
        updateWishlist,
        addContribution,
        deleteContribution,
        updateContribution,
    };
});

export { useWishlist };
