<template>
    <UModal fullscreen :open="isOpen" :ui="{ content: 'bg-[#fffaf0]' }">
        <template #header>
            <div
                class="relative flex w-full items-center justify-between px-1 py-3"
            >
                <UButton
                    aria-label="Tutup modal transaksi"
                    :ui="{
                        base: 'flex size-11 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-red p-0 text-white shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                    }"
                    @click="emits('close')"
                >
                    <UIcon
                        name="material-symbols:close-rounded"
                        class="text-2xl"
                    />
                </UButton>

                <div
                    class="rounded-2xl border-2 border-dark bg-accent-blue px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#111111]"
                >
                    Add Transaction
                </div>
            </div>
        </template>

        <template #body>
            <div class="relative min-h-full overflow-hidden pb-8">
                <section class="relative z-1 mt-4">
                    <money-tracker-form @close-on-submit="emits('close')" />
                </section>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isOpen?: boolean }>(), { isOpen: false });

const emits = defineEmits<{ close: [] }>();
</script>
