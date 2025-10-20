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

  const updateProfile = async (
    full_name: string,
    profile_picture?: string | null
  ) => {
    try {
      const { data, error } = await client.auth.updateUser({
        data: {
          full_name: full_name,
          avatar: profile_picture,
        },
      });

      if (error) {
        console.error("Error updating profile:", error);
        useToast().add({
          title: "Update Profile",
          description: "Failed to update profile.",
          color: "error",
        });
        throw error;
      }

      useToast().add({
        title: "Update Profile",
        description: "Profile updated successfully.",
      });

      return data;
    } catch (err) {
      console.error("Error in updateProfile:", err);
      useToast().add({
        title: "Update Profile",
        description: "An unexpected error occurred.",
        color: "error",
      });
      return err;
    }
  };

  return {
    detail,
    getProfile,
    updateProfile,
  };
});
