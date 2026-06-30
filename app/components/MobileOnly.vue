<template>
  <div class="relative flex min-h-screen overflow-hidden bg-[#fffaf0] w-full">
    <div class="absolute inset-0 bg-accent-blue" />
    <div class="absolute inset-0 custom-bg opacity-20" />

    <div class="absolute -left-32 top-20 size-96 rounded-full bg-accent-yellow" />
    <div class="absolute -right-40 bottom-20 size-[500px] rounded-full bg-accent-red" />

    <div class="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-16">
      <div class="grid w-full grid-cols-1 gap-16 items-center">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full border-[2px] border-dark bg-accent-yellow px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-dark">
            <UIcon name="solar:smartphone-2-bold" class="text-base" />
            Yotro - Aplikasi Keuangan Pribadi
          </div>

          <h1 class="mt-6 text-6xl font-black uppercase leading-tight text-white mix-blend-difference">
            Buka di Ponsel Anda
          </h1>

          <p class="mt-6 max-w-xl text-xl leading-9 text-white/90">
            Yotro dirancang khusus untuk perangkat seluler agar
            pengalaman mencatat keuangan menjadi lebih cepat,
            nyaman, dan fokus.
          </p>

        </div>
      </div>
    </div>
  </div>
</template>