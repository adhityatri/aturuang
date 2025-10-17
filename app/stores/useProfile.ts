export const useProfile = defineStore("profile-store", () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  const detail = ref();
  const getProfile = async () => {
    try {
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("id", user.value?.id || "");
      if (error) throw error;

      detail.value = data || [];
      return detail.value || [];
    } catch (err) {
      return err;
    }
  };

  const updateProfile = async (payload: string) => {
    try {
      const { data, error } = await client.auth.updateUser({
        data: {
          full_name: payload,
        },
      });

      if (error) throw error;

      useToast().add({
        title: "Update Kantong",
        description: "Kantong berhasil diupdate",
      });

      return data;
    } catch (err) {
      return err;
    }
  };

  return {
    detail,
    getProfile,
    updateProfile,
  };
});
