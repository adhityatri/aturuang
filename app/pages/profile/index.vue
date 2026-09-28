<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg">
        <!-- Header -->
        <section class="relative overflow-hidden rounded-b-[4rem] px-4 pb-10 pt-6 text-dark">
            <div class="relative z-1 mt-8 flex flex-col items-center justify-center text-center">
                <div class="rounded-full shadow-lg shadow-base-color bg-white-smooth p-1">
                    <app-avatar>
                        <img
                            :src="`/images/profile_icon/${identity?.avatar}`"
                            :alt="`${identity?.full_name}-${identity?.avatar}`"
                        />
                    </app-avatar>
                </div>

                <div class="mt-5 flex flex-col items-center">
                    <span class="text-xl font-black uppercase tracking-widest">
                        {{ identity?.full_name }}
                    </span>

                    <small class="text-sm font-medium text-dark">
                        {{ identity?.email }}
                    </small>
                    <span class="mt-4 h-1 w-14 rounded-full bg-dark" />
                </div>
            </div>
        </section>

        <!-- Content -->
        <div class="flex flex-1 flex-col px-4 pb-6 gap-4">
            <profile-form />

            <UButton
                size="xl"
                variant="ghost"
                color="neutral"
                :ui="{
                    base: 'flex shadow-lg shadow-base-color justify-between corner-based bg-white p-4 text-sm font-black text-dark transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                }"
                @click="handleImprove"
            >
                <div class="flex items-center gap-4">
                    <span
                        class="flex size-10 items-center justify-center rounded-xl bg-accent-green text-dark"
                    >
                        <UIcon name="solar:chat-round-dots-linear" class="text-xl" />
                    </span>

                    <span>Help us improve!</span>
                </div>

                <UIcon name="lucide:chevron-right" class="text-xl text-dark" />
            </UButton>

            <UButton
                size="xl"
                variant="ghost"
                color="error"
                :ui="{
                    base: 'flex justify-between rounded-4xl corner-squircle bg-red-50 p-4 text-sm font-black text-red-500 shadow-xl shadow-base-color transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                }"
                @click="handleLogout"
            >
                <div class="flex items-center gap-4">
                    <span
                        class="flex size-10 items-center justify-center rounded-xl bg-accent-red text-white"
                    >
                        <UIcon name="solar:logout-2-linear" class="text-xl" />
                    </span>

                    <span>Logout</span>
                </div>

                <UIcon name="lucide:chevron-right" class="text-xl text-accent-red" />
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const identity = getIdentities();

const handleLogout = async () => {
    await supabase.auth.signOut();
    await navigateTo({ name: "login-page", replace: true });
};

const handleImprove = async () => {
    await navigateTo({ name: "improve-page", replace: true });
};
</script>
