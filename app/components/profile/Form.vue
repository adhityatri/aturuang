<template>
    <USlideover
        v-model:open="isOpen"
        :dismissible="false"
        title="General Setting"
        side="bottom"
    >
        <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            :ui="{
                base: 'flex justify-between rounded-2xl border-[2px] border-dark bg-white p-4 text-sm font-black text-dark shadow-[3px_3px_0px_#111111] transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            }"
        >
            <div class="flex items-center gap-4">
                <span
                    class="flex size-12 items-center justify-center rounded-xl bg-accent-blue text-white"
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
                    <p
                        class="text-[10px] font-black uppercase tracking-[0.22em] text-primary"
                    >
                        Profile
                    </p>
                    <h1 class="text-xl font-black uppercase text-dark">
                        General Setting
                    </h1>
                    <p class="mt-1 text-xs font-medium text-secondary">
                        Atur nama dan avatar profil kamu.
                    </p>
                </div>

                <UButton
                    icon="lucide:x"
                    color="neutral"
                    variant="ghost"
                    @click="isOpen = false"
                />
            </div>
        </template>

        <template #body>
            <div
                class="relative overflow-hidden rounded-[2rem] border-[2px] border-dark bg-[#fffaf0] p-4 shadow-[4px_4px_0px_#111111]"
            >
                <!-- Bauhaus Decoration -->
                <div
                    class="absolute -right-10 -top-10 size-28 rounded-full bg-accent-yellow"
                />
                <div
                    class="absolute -left-10 bottom-0 size-24 rounded-tr-full bg-accent-blue"
                />
                <div
                    class="absolute -bottom-8 right-8 size-20 rounded-full bg-accent-red"
                />

                <div class="relative z-1">
                    <!-- Current Preview -->
                    <div
                        class="flex items-center gap-4 rounded-2xl border-[2px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
                    >
                        <div
                            class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] border-dark bg-white"
                        >
                            <img
                                :src="selectedAvatarUrl"
                                :alt="
                                    state.profile_picture || 'profile-picture'
                                "
                                class="size-full object-cover"
                            />
                        </div>

                        <div class="min-w-0 flex-1">
                            <p
                                class="text-[10px] font-black uppercase tracking-[0.2em] text-primary"
                            >
                                Preview Profil
                            </p>
                            <h2 class="truncate text-lg font-black text-dark">
                                {{
                                    state.full_name ||
                                    getIdentities()?.full_name
                                }}
                            </h2>
                            <p
                                class="truncate text-xs font-medium text-secondary"
                            >
                                {{ getIdentities()?.email }}
                            </p>
                        </div>
                    </div>

                    <!-- Avatar Picker -->
                    <div class="mt-6">
                        <div class="mb-3 flex items-end justify-between">
                            <div>
                                <h3
                                    class="text-sm font-black uppercase text-dark"
                                >
                                    Pilih Avatar
                                </h3>
                                <p class="text-xs text-secondary">
                                    Tap salah satu avatar untuk mengganti foto
                                    profil.
                                </p>
                            </div>

                            <span
                                class="rounded-full border-[1.5px] border-dark bg-accent-yellow px-3 py-1 text-[10px] font-black text-dark"
                            >
                                {{ profileIcons.length }} Icon
                            </span>
                        </div>

                        <div class="grid grid-cols-4 gap-3">
                            <button
                                v-for="icon in profileIcons"
                                :key="icon"
                                type="button"
                                class="relative overflow-hidden rounded-2xl border-[2px] bg-white p-2 shadow-[2px_2px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                :class="
                                    state.profile_picture === icon
                                        ? 'border-primary bg-blue-50'
                                        : 'border-dark'
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
                                    class="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full border border-dark bg-accent-yellow text-dark"
                                >
                                    <UIcon
                                        name="lucide:check"
                                        class="text-xs"
                                    />
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
                        <UFormField
                            label="Email"
                            name="email"
                            class="mb-4 w-full"
                        >
                            <UInput
                                :value="getIdentities()?.email"
                                size="xl"
                                type="text"
                                :disabled="true"
                                class="w-full"
                                :ui="{
                                    base: 'rounded-2xl border-[2px] border-dark bg-neutral-100 px-4 py-4 font-bold text-secondary',
                                }"
                            />
                        </UFormField>

                        <UFormField
                            label="Nama Lengkap"
                            name="full_name"
                            class="mb-4 w-full"
                        >
                            <UInput
                                v-model="state.full_name"
                                placeholder="Nama Lengkap"
                                size="xl"
                                type="text"
                                class="w-full"
                                :ui="{
                                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 font-bold text-dark shadow-[2px_2px_0px_#111111]',
                                }"
                            />
                        </UFormField>

                        <UButton
                            block
                            size="xl"
                            type="submit"
                            :loading="profileStore.isLoading"
                            :ui="{
                                base: 'mt-6 rounded-2xl border-[2px] border-dark bg-accent-blue px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#111111] disabled:bg-neutral-300 disabled:text-secondary',
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
    return `${
        useRuntimeConfig().public.supabaseUrl
    }/storage/v1/object/public/yothro/${icon}`;
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
