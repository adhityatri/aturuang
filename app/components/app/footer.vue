<template>
    <footer
        class="z-1000 fixed bottom-0 w-full bg-white border-t-[1.5px] border-dark h-17.5 flex items-stretch"
    >
        <nuxt-link
            v-for="(item, index) in navigation"
            :key="item.name"
            :to="item.href"
            class="relative flex flex-col flex-1 items-center justify-center gap-0.5 text-[9px] font-black uppercase tracking-widest transition-colors"
            :class="[
                currentRouter === item.href
                    ? 'bg-accent-blue text-white'
                    : 'bg-white text-dark hover:bg-neutral-100',
                index !== navigation.length - 1
                    ? 'border-r-[1.5px] border-dark'
                    : '',
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
    {
        name: "Transactions",
        icon: "solar:wallet-money-linear",
        href: "/transactions",
    },
    // { name: "Insight", icon: "solar:command-bold-duotone", href: "/insight" },
    { name: "Profile", icon: "solar:user-linear", href: "/profile" },
];

const router = useRouter();
const currentRouter = computed(() => {
    return router.currentRoute.value.path;
});
</script>
