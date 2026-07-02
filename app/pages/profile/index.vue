<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-dark">
        <!-- Header -->
        <section
            class="relative overflow-hidden rounded-b-[2rem] bg-accent-green px-4 pb-10 pt-6 text-dark"
        >
            <!-- Bauhaus Pattern -->

            <div class="relative z-1 flex justify-end">
                <nuxt-link
                    :to="{ name: 'profile-page' }"
                    class="flex items-center gap-2 rounded-full border-[2px] border-dark bg-white px-5 py-2 text-sm font-black text-primary shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <UIcon name="solar:user-rounded-linear" class="text-lg" />
                    Profil Saya
                    <UIcon name="lucide:chevron-right" class="text-lg text-dark" />
                </nuxt-link>
            </div>

            <div class="relative z-1 mt-8 flex flex-col items-center justify-center text-center">
                <div class="rounded-4xl bg-white-smooth p-1 ring-2 ring-dark">
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
        <main class="relative z-1 -mt-5 flex flex-1 flex-col px-4 pb-6">
            <div class="relative overflow-hidden rounded-4xl bg-white-smooth p-4">
                <!-- Invite Card -->
                <button
                    type="button"
                    class="relative z-1 flex w-full items-center gap-4 rounded-4xl bg-accent-green p-4 text-left transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <div
                        class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-dark text-white-smooth"
                    >
                        <UIcon name="solar:gift-linear" class="text-3xl" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <h4 class="text-lg font-black text-dark">Invite Friends</h4>
                        <p class="mt-1 text-sm leading-5 text-dark">
                            Share your referral link with friends and earn rewards!
                        </p>
                    </div>

                    <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-green text-dark"
                    >
                        <UIcon name="lucide:chevron-right" class="text-xl" />
                    </div>
                </button>

                <!-- Menu -->
                <div class="relative z-1 mt-5 flex flex-col gap-4">
                    <profile-form />

                    <nuxt-link
                        :to="{ name: 'transactions-page' }"
                        class="flex ring-1 ring-dark items-center justify-between rounded-4xl bg-white-smooth p-4 text-sm font-black text-dark transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:history-linear" class="text-2xl" />
                            </span>

                            <span>History Transactions</span>
                        </div>

                        <UIcon name="lucide:chevron-right" class="text-xl text-dark" />
                    </nuxt-link>

                    <UButton
                        size="xl"
                        variant="ghost"
                        color="neutral"
                        :ui="{
                            base: 'flex ring-1 ring-dark justify-between rounded-4xl bg-white-smooth p-4 text-sm font-black text-dark transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                        @click="handleImprove"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:chat-round-dots-linear" class="text-2xl" />
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
                            base: 'flex justify-between rounded-4xl ring-1 ring-dark bg-red-50 p-4 text-sm font-black text-red-500 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                        @click="handleLogout"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-red text-white"
                            >
                                <UIcon name="solar:logout-2-linear" class="text-2xl" />
                            </span>

                            <span>Logout</span>
                        </div>

                        <UIcon name="lucide:chevron-right" class="text-xl text-accent-red" />
                    </UButton>
                </div>
            </div>
        </main>
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
