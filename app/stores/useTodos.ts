import type { iTodo } from "~/types/todo";

export const useTodos = defineStore("todos-store", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const todos = ref<iTodo[]>([]);
  const loading = ref(false);

  const getTodosByUserId = async () => {
    if (!user.value?.id) return;

    loading.value = true;
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.value.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      todos.value = data ?? [];
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      loading.value = false;
    }
  };

  const addTodo = async (text: string) => {
    if (!user.value?.id) return;

    const { error } = await supabase
      .from("todos")
      .insert({ text, user_id: user.value.id });

    if (error) throw error;
    await getTodosByUserId();
  };

  const toggleTodo = async (id: string) => {
    if (!user.value?.id) return;

    const todo = todos.value.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ done: !todo.done })
      .eq("id", id)
      .eq("user_id", user.value.id);

    if (error) throw error;
    todo.done = !todo.done;
  };

  const removeTodo = async (id: string) => {
    if (!user.value?.id) return;

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.value.id);

    if (error) throw error;
    todos.value = todos.value.filter((t) => t.id !== id);
  };

  return {
    todos,
    loading,
    getTodosByUserId,
    addTodo,
    toggleTodo,
    removeTodo,
  };
});
