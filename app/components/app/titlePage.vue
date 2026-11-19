<script setup lang="ts">
defineProps({ dark: { type: Boolean, default: false }, back: { type: Boolean, default: false } });
const slot = useSlots();

const hasSubtitle = !!slot.subtitle;
const hasExtra = !!slot.extra;
</script>

<template>
    <div class="relative z-10 flex flex-col gap-4">
        <div
            class="flex items-start gap-3"
            :class="{
                'items-center': !hasSubtitle,
                'items-start': hasSubtitle,
                'justify-between': hasExtra,
                'justify-start': !hasExtra,
            }"
        >
            <div
                class="flex"
                :class="{
                    'text-dark': dark,
                    'text-white': !dark,
                    'flex-col items-start': !back,
                    'gap-2 items-center': back,
                }"
            >
                <UButton
                    v-if="back"
                    variant="ghost"
                    class="text-dark shadow-xl shadow-based-color corner-based ring-1 ring-dark/2"
                    icon="solar:alt-arrow-left-linear"
                    size="xl"
                    @click="useRouter().back()"
                />
                <div class="flex flex-col">
                    <h1 class="font-medium text-xl capitalize">
                        <slot />
                    </h1>
                    <div v-if="hasSubtitle" class="text-sm font-bold text-dark/50">
                        <slot name="subtitle" />
                    </div>
                </div>
            </div>

            <div v-if="hasExtra">
                <slot name="extra" />
            </div>
        </div>
    </div>
</template>
