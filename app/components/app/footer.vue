<template>
    <footer
        class="z-1000 fixed ring-2 ring-accent-green bottom-5 left-[50%] rounded-2xl overflow-hidden translate-x-[-50%] w-[80%] h-15 flex items-stretch"
    >
        <nuxt-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="relative flex flex-col flex-1 items-center justify-center gap-0.5 text-[9px] font-black uppercase tracking-widest transition-colors"
            :class="[
                currentRouter === item.href
                    ? 'bg-dark text-white'
                    : 'bg-accent-green text-dark hover:bg-neutral-100',
            ]"
        >
            <UIcon
                :name="item.icon"
                class="size-5 transition-transform"
                :class="currentRouter === item.href ? 'scale-110' : ''"
            />
            <span>{{ item.name }}</span>
        </nuxt-link>
    </footer>
</template>

<script setup lang="ts">
const navigation = [
    { name: "Home", icon: "solar:home-2-linear", href: "/" },
    { name: "Activity", icon: "solar:wallet-money-linear", href: "/activity" },
    // { name: "Insight", icon: "solar:command-bold-duotone", href: "/insight" },
    { name: "Profile", icon: "solar:user-linear", href: "/profile" },
];

const router = useRouter();
const currentRouter = computed(() => {
    return router.currentRoute.value.path;
});
</script>
