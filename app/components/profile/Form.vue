<template>
    <USlideover
        v-model:open="isOpen"
        :dismissible="false"
        title="General Setting"
        side="bottom"
        :ui="{ content: 'bg-white-smooth rounded-t-4xl' }"
    >
        <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            :ui="{
                base: 'flex justify-between rounded-4xl ring-1 ring-dark bg-white-smooth p-4 text-sm font-black text-dark transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            }"
        >
            <div class="flex items-center gap-4">
                <span
                    class="flex size-12 items-center justify-center rounded-xl bg-accent-green text-dark"
                >
                    <UIcon name="solar:settings-linear" class="text-2xl" />
                </span>

                <span>General Setting</span>
            </div>

            <UIcon name="lucide:chevron-right" class="text-xl text-dark" />
        </UButton>

        <template #header>
            <div class="flex flex-1 items-start justify-between">
                <div>
                    <h1 class="text-xl font-black uppercase text-dark">General Setting</h1>
                    <p class="text-xs font-medium text-dark">Atur nama dan avatar profil kamu.</p>
                </div>

                <UButton icon="lucide:x" color="neutral" variant="ghost" @click="isOpen = false" />
            </div>
        </template>

        <template #body>
            <div class="relative overflow-hidden rounded-[2rem] bg-accent-green p-4">
                <div class="relative z-1">
                    <!-- Current Preview -->
                    <div class="flex mt-4 items-center gap-4 rounded-4xl bg-white-smooth p-4">
                        <div
                            class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-dark bg-white"
                        >
                            <img
                                :src="selectedAvatarUrl"
                                :alt="state.profile_picture || 'profile-picture'"
                                class="size-full object-cover"
                            />
                        </div>

                        <div class="min-w-0 flex-1 relative">
                            <div
                                class="absolute -top-9 right-5 bg-dark py-1 px-4 rounded-full text-white-smooth"
                            >
                                <p class="text-[10px] font-black uppercase tracking-[0.2em]">
                                    Preview
                                </p>
                            </div>
                            <h2 class="truncate text-lg font-black text-dark">
                                {{ state.full_name || getIdentities()?.full_name }}
                            </h2>
                            <p class="truncate text-xs font-medium text-dark">
                                {{ getIdentities()?.email }}
                            </p>
                        </div>
                    </div>

                    <!-- Avatar Picker -->
                    <div class="mt-6">
                        <div class="mb-3 flex items-start justify-between text-dark">
                            <div>
                                <h3 class="text-sm font-black uppercase">Pilih Avatar</h3>
                                <p class="text-xs">
                                    Tap salah satu avatar untuk mengganti foto profil.
                                </p>
                            </div>

                            <span
                                class="rounded-full bg-dark px-3 py-1 text-[10px] font-black text-white-smooth"
                            >
                                {{ profileIcons.length }} Icon
                            </span>
                        </div>

                        <div class="grid grid-cols-4 gap-3">
                            <button
                                v-for="icon in profileIcons"
                                :key="icon"
                                type="button"
                                class="relative overflow-hidden rounded-4xl ring-2 bg-white p-2 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                :class="
                                    state.profile_picture === icon
                                        ? 'ring-dark bg-blue-50'
                                        : 'ring-accent-green'
                                "
                                @click="state.profile_picture = icon"
                            >
                                <img
                                    :src="getAvatarUrl(icon)"
                                    :alt="icon"
                                    class="aspect-square w-full object-cover"
                                />

                                <span
                                    v-if="state.profile_picture === icon"
                                    class="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border border-dark bg-accent-green text-dark"
                                >
                                    <UIcon name="lucide:check" class="text-xs" />
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Form -->
                    <UForm
                        class="z-1 mt-6 w-full"
                        :schema="schema"
                        :state="state"
                        @submit="onSubmit"
                    >
                        <UFormField label="Email" name="email" class="mb-4 w-full">
                            <UInput
                                :value="getIdentities()?.email"
                                size="xl"
                                type="text"
                                :disabled="true"
                                class="w-full"
                                :ui="{
                                    base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-4 font-bold text-dark',
                                }"
                            />
                        </UFormField>

                        <UFormField label="Nama Lengkap" name="full_name" class="mb-4 w-full">
                            <UInput
                                v-model="state.full_name"
                                placeholder="Nama Lengkap"
                                size="xl"
                                type="text"
                                class="w-full"
                                :ui="{
                                    base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-4 font-bold text-dark',
                                }"
                            />
                        </UFormField>

                        <UButton
                            block
                            size="xl"
                            type="submit"
                            :loading="profileStore?.isLoading"
                            :ui="{
                                base: 'mt-6 rounded-2xl ring-1 ring-dark bg-white-smooth px-6 py-4 text-sm font-black uppercase tracking-wide text-dark disabled:bg-neutral-300 disabled:text-secondary',
                            }"
                        >
                            Simpan Perubahan
                        </UButton>
                    </UForm>
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script lang="ts" setup>
import * as valibot from "valibot";

const schema = valibot.object({
    full_name: valibot.pipe(
        valibot.string(),
        valibot.minLength(4, "Must be at least 4 characters"),
    ),
});

const profileIcons = [
    "girl-happy-curly-hair.png",
    "girl-happy-long-hair-without-masker.png",
    "girl-happy-long-hair.png",
    "girl-long-hair-happy-butterfly.png",
    "girl-sad-masker.png",
    "man-long-hair-happy.png",
    "man-short-hair.png",
    "man-tie-short-hair-happy.png",
];

const getAvatarUrl = (icon: string) => {
    return `${useRuntimeConfig().public.supabaseUrl}/storage/v1/object/public/yothro/${icon}`;
};

const state = reactive({
    profile_picture: getIdentities()?.avatar || profileIcons[0],
    full_name: getIdentities()?.full_name || "",
});

const selectedAvatarUrl = computed(() => {
    return getAvatarUrl(state.profile_picture);
});

const isOpen = ref<boolean>(false);
const profileStore = useProfile();

const onSubmit = async () => {
    await profileStore.updateProfile(state.full_name, state.profile_picture);
    isOpen.value = false;
};
</script>
