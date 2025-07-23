<template>
  <div
    class="relative overflow-hidden ring-1 ring-neutral-100 bg-white flex flex-col h-[200px] rounded-2xl shadow-lg items-start justify-between"
  >
    <div class="px-4 leading-[2rem] flex-1 flex flex-col justify-center">
      <p class="text-gray-500">Saldo Saat Ini</p>
      <h1 class="text-[2rem] font-bold">Rp 150.000.000</h1>
    </div>
    <div class="p-4 h-auto bg-gray-50 w-full flex justify-between">
      <div class="flex flex-col items-center leading-[1.2rem]">
        <small>Pemasukan</small>
        <h2 class="text-[1.2rem] text-green-500">+ 500.000</h2>
      </div>
      <div class="flex flex-col items-center leading-[1.2rem]">
        <small>Pengeluaran</small>
        <h2 class="text-[1.2rem] text-red-500">- 200.000</h2>
      </div>
    </div>
    <!-- <div class="flex gap-4 justify-between">
            <h2 class="text-[1.2rem] text-green-500">+ 500.000</h2>
            <h2 class="text-[1.2rem] text-red-500">- 200.000</h2>
        </div> -->
  </div>
</template>
