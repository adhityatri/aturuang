const getIdentities = () => {
    const supabase = useSupabaseUser();
    const defaultAvatar = 'girl-happy-long-hair.png'
    return {
        full_name: supabase.value?.user_metadata?.full_name,
        email : supabase.value?.email,
        id : supabase.value?.id,
        avatar : supabase.value?.user_metadata?.avatar ?? defaultAvatar,
    }
}

export default getIdentities