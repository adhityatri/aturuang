<template>
    <div
        class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-[#fffaf0]"
    >
        <!-- Header -->
        <section
            class="relative overflow-hidden rounded-b-[2rem] border-b-[2px] border-dark bg-accent-blue px-4 pb-10 pt-6 text-white shadow-[0_4px_0px_#111111]"
        >
            <!-- Bauhaus Pattern -->
            <div class="absolute inset-0 z-0 custom-bg opacity-40" />
            <div
                class="absolute -left-16 bottom-[-4rem] size-36 rounded-full bg-accent-yellow"
            />
            <div
                class="absolute -right-14 bottom-[-3rem] size-32 rounded-full bg-accent-red"
            />

            <div class="relative z-1 flex justify-end">
                <nuxt-link
                    :to="{ name: 'profile-page' }"
                    class="flex items-center gap-2 rounded-full border-[2px] border-dark bg-white px-5 py-2 text-sm font-black text-primary shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <UIcon name="solar:user-rounded-linear" class="text-lg" />
                    Profil Saya
                    <UIcon
                        name="lucide:chevron-right"
                        class="text-lg text-dark"
                    />
                </nuxt-link>
            </div>

            <div
                class="relative z-1 mt-8 flex flex-col items-center justify-center text-center"
            >
                <div
                    class="rounded-full border-[2px] border-dark bg-white p-1 shadow-[4px_4px_0px_#111111]"
                >
                    <app-avatar>
                        <img
                            :src="`/images/profile_icon/${getIdentities()?.avatar}`"
                            :alt="`${getIdentities()?.full_name}-${getIdentities()?.avatar}`"
                        />
                    </app-avatar>
                </div>

                <div class="mt-5 flex flex-col items-center">
                    <span class="text-xl font-black uppercase tracking-widest">
                        {{ getIdentities()?.full_name }}
                    </span>

                    <span class="mt-2 h-1 w-14 rounded-full bg-accent-yellow" />

                    <small class="mt-3 text-sm font-medium text-white/90">
                        {{ getIdentities()?.email }}
                    </small>
                </div>
            </div>
        </section>

        <!-- Content -->
        <main class="relative z-1 -mt-5 flex flex-1 flex-col px-4 pb-6">
            <div
                class="relative flex-1 overflow-hidden rounded-[2rem] border-[2px] border-dark bg-white p-4 shadow-[4px_4px_0px_#111111]"
            >
                <!-- Content Decoration -->
                <div
                    class="absolute -bottom-10 -left-10 size-24 rounded-full bg-accent-blue"
                />
                <div
                    class="absolute -bottom-12 -right-8 size-24 rounded-full bg-accent-red"
                />
                <div
                    class="absolute bottom-4 right-3 size-8 rounded-full bg-accent-yellow"
                />

                <!-- Invite Card -->
                <button
                    type="button"
                    class="relative z-1 flex w-full items-center gap-4 rounded-2xl border-[2px] border-dark bg-[#fffaf0] p-4 text-left shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <div
                        class="flex size-14 shrink-0 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-yellow text-dark"
                    >
                        <UIcon name="solar:gift-linear" class="text-3xl" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <h4 class="text-lg font-black text-dark">
                            Invite Friends
                        </h4>
                        <p class="mt-1 text-sm leading-5 text-secondary">
                            Share your referral link with friends and earn
                            rewards!
                        </p>
                    </div>

                    <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-yellow text-dark"
                    >
                        <UIcon name="lucide:chevron-right" class="text-xl" />
                    </div>
                </button>

                <!-- Menu -->
                <div class="relative z-1 mt-5 flex flex-col gap-4">
                    <profile-form />

                    <nuxt-link
                        :to="{ name: 'transactions-page' }"
                        class="flex items-center justify-between rounded-2xl border-[2px] border-dark bg-white p-4 text-sm font-black text-dark shadow-[3px_3px_0px_#111111] transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-yellow text-dark"
                            >
                                <UIcon
                                    name="solar:history-linear"
                                    class="text-2xl"
                                />
                            </span>

                            <span>History Transactions</span>
                        </div>

                        <UIcon
                            name="lucide:chevron-right"
                            class="text-xl text-dark"
                        />
                    </nuxt-link>

                    <UButton
                        size="xl"
                        variant="ghost"
                        color="neutral"
                        :ui="{
                            base: 'flex justify-between rounded-2xl border-[2px] border-dark bg-white p-4 text-sm font-black text-dark shadow-[3px_3px_0px_#111111] transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                        @click="handleImprove"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-blue text-white"
                            >
                                <UIcon
                                    name="solar:chat-round-dots-linear"
                                    class="text-2xl"
                                />
                            </span>

                            <span>Help us improve!</span>
                        </div>

                        <UIcon
                            name="lucide:chevron-right"
                            class="text-xl text-dark"
                        />
                    </UButton>

                    <UButton
                        size="xl"
                        variant="ghost"
                        color="error"
                        :ui="{
                            base: 'flex justify-between rounded-2xl border-[2px] border-red-500 bg-red-50 p-4 text-sm font-black text-red-500 shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                        @click="handleLogout"
                    >
                        <div class="flex items-center gap-4">
                            <span
                                class="flex size-12 items-center justify-center rounded-xl bg-accent-red text-white"
                            >
                                <UIcon
                                    name="solar:logout-2-linear"
                                    class="text-2xl"
                                />
                            </span>

                            <span>Logout</span>
                        </div>

                        <UIcon
                            name="lucide:chevron-right"
                            class="text-xl text-accent-red"
                        />
                    </UButton>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const handleLogout = async () => {
    await supabase.auth.signOut();
    await navigateTo({ name: "login-page", replace: true });
};

const handleImprove = async () => {
    await navigateTo({ name: "improve-page", replace: true });
};
</script>
