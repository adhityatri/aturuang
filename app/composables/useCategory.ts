export const useCategory = () => {
    const supabase = useSupabaseClient();

    const { data: categories } = useAsyncData('categories', async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    });

    return categories || [];
}