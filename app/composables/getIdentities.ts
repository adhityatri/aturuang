const getIdentities = () => {
    const supabase = useSupabaseUser();
    return {
        full_name: supabase.value?.user_metadata?.full_name,
        email : supabase.value?.email,
        id : supabase.value?.id
    }
}

export default getIdentities