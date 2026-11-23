<template>
    <USlideover
        v-model:open="walletStore.isMemberOpen"
        :dismissible="false"
        side="bottom"
        :ui="{ content: 'rounded-t-4xl corner-squircle main-bg', header: 'border-0' }"
    >
        <UButton
            icon="solar:add-circle-bold"
            variant="ghost"
            color="neutral"
            class="p-2 rounded-full bg-dark/80 text-white ring-4 ring-accent-green flex items-center justify-center"
            label="Anggota"
            :ui="{ base: 'p-0' }"
            @click="open"
        />

        <template #header>
            <div class="flex flex-1 items-start justify-between my-2">
                <div class="text-dark">
                    <h2 class="text-xl font-bold">Anggota Kantong</h2>
                    <p class="text-lg text-dark/80">Tambah dan kelola akses anggota.</p>
                </div>
                <UButton
                    icon="lucide:x"
                    variant="ghost"
                    color="neutral"
                    @click="walletStore.isMemberOpen = false"
                />
            </div>
        </template>

        <template #body>
            <div class="relative z-1 flex flex-col gap-4">
                <UForm
                    class="w-full flex flex-col gap-3"
                    :schema="schema"
                    :state="state"
                    @submit="onAdd"
                >
                    <UFormField label="Email Anggota" name="email" class="w-full">
                        <UInput
                            v-model="state.email"
                            type="email"
                            size="xl"
                            placeholder="nama@email.com"
                            class="w-full"
                            :ui="{
                                base: 'rounded-2xl bg-white px-4 py-4 font-bold text-dark ring-1 ring-dark',
                            }"
                        />
                    </UFormField>

                    <UFormField label="Role" name="role" class="w-full">
                        <USelect
                            v-model="state.role"
                            :items="roleOptions"
                            size="xl"
                            class="w-full"
                            :ui="{
                                base: 'rounded-2xl px-4 py-4 font-bold text-dark',
                                content: 'rounded-2xl ring-1 ring-dark',
                            }"
                        />
                    </UFormField>

                    <UButton
                        block
                        size="xl"
                        color="primary"
                        type="submit"
                        :loading="isAdding"
                        :ui="{
                            base: 'rounded-2xl bg-dark px-6 py-4 text-sm font-black uppercase tracking-wide text-white',
                        }"
                    >
                        Tambah Anggota
                    </UButton>
                </UForm>

                <USeparator
                    orientation="horizontal"
                    label="Daftar Anggota"
                    :ui="{ border: 'border-dark' }"
                />

                <div v-if="walletStore.isMemberLoading" class="flex flex-col gap-3">
                    <USkeleton v-for="i in 1" :key="i" class="h-16 bg-neutral-300 rounded-2xl" />
                </div>

                <div
                    v-else-if="walletStore.members.length === 0"
                    class="rounded-2xl border-[1.5px] border-dashed border-dark bg-neutral-50 p-6 text-center"
                >
                    <p class="text-xs font-bold text-secondary">Belum ada anggota.</p>
                </div>

                <div v-else class="flex flex-col gap-3">
                    <div
                        v-for="member in walletStore.members"
                        :key="member.id"
                        class="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-dark/10"
                    >
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-bold text-dark">{{ member.email }}</p>
                        </div>

                        <USelect
                            :model-value="member.role"
                            :items="roleOptions"
                            size="sm"
                            class="w-28"
                            :ui="{
                                base: 'rounded-xl font-bold text-dark',
                                content: 'rounded-xl ring-1 ring-dark',
                            }"
                            @update:model-value="onRoleChange(member.id, $event)"
                        />

                        <UButton
                            icon="solar:trash-bin-trash-linear"
                            color="error"
                            variant="ghost"
                            aria-label="Hapus anggota"
                            :loading="removingId === member.id"
                            @click="onRemove(member.id)"
                        />
                    </div>
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import * as valibot from "valibot";
import type { WalletMemberRole } from "~/types/wallets";

const walletStore = useWallets();
const route = useRoute();
const walletId = computed(() => route.query.id as string);

const isAdding = ref(false);
const removingId = ref<string | null>(null);

const roleOptions = [
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
];

const schema = valibot.required(
    valibot.object({
        email: valibot.pipe(valibot.string(), valibot.trim(), valibot.email("Email tidak valid")),
        role: valibot.picklist(["editor", "viewer"], "Pilih role"),
    }),
);

const state = reactive<{ email: string; role: WalletMemberRole }>({ email: "", role: "viewer" });

const open = async () => {
    walletStore.isMemberOpen = true;
    await walletStore.getMembers(walletId.value);
};

const onAdd = async () => {
    if (isAdding.value) return;
    isAdding.value = true;
    try {
        const res = await walletStore.addMember(walletId.value, state.email, state.role);
        if (res.error) {
            const msg =
                res.error.code === "23505" ? "Anggota sudah ada di kantong ini" : res.error.message;
            useToast().add({ title: "Anggota Kantong", description: msg, color: "error" });
            return;
        }
        useToast().add({
            title: "Anggota Kantong",
            description: "Anggota berhasil ditambahkan",
            color: "success",
        });
        state.email = "";
        state.role = "viewer";
    } finally {
        isAdding.value = false;
    }
};

const onRoleChange = async (memberId: string, role: WalletMemberRole) => {
    const res = await walletStore.updateMemberRole(memberId, walletId.value, role);
    if (res.error) {
        useToast().add({
            title: "Anggota Kantong",
            description: res.error.message,
            color: "error",
        });
    }
};

const onRemove = async (memberId: string) => {
    removingId.value = memberId;
    try {
        const res = await walletStore.removeMember(memberId, walletId.value);
        if (res.error) {
            useToast().add({
                title: "Anggota Kantong",
                description: res.error.message,
                color: "error",
            });
            return;
        }
        useToast().add({
            title: "Anggota Kantong",
            description: "Anggota dihapus",
            color: "success",
        });
    } finally {
        removingId.value = null;
    }
};
</script>
