export const useFeedbackStore = defineStore("feedback-store", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const addFeedback = async (payload: { feedback: string; type: string }) => {
    if (!user.value?.id) {
      return;
    }

    const feedbackPayload = {
      user_id: user.value.id,
      description: payload.feedback,
      type: payload.type,
      status: "requested",
    };

    const { data, error } = await supabase
      .from("feedback")
      .insert([feedbackPayload])
      .select();

    if (error) {
      useToast().add({
        title: "Feedback",
        description: "Failed to add feedback.",
        color: "error",
      });
      throw error;
    }

    useToast().add({
      title: "Feedback",
      description: "Feedback added successfully.",
      color: "success",
    });

    return { data, error };
  };

  return {
    addFeedback,
  };
});
