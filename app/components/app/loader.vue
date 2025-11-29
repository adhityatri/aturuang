<template>
  <div class="finance-loader">
    <div class="wallet">
      <div class="wallet-body">
        <div class="wallet-mouth"></div>
        <div
          class="z-10 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src="/images/brand-light.png" alt="brand-light" />
        </div>
      </div>
      <div class="wallet-outline"></div>
    </div>
    <p class="loading-text">{{ props.title ?? "Loading..." }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
// Tidak ada logika JavaScript diperlukan
</script>

<style scoped>
.finance-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.wallet {
  position: relative;
  width: 80px;
  height: 60px;
  animation: float 2s ease-in-out infinite;
}

.wallet-body {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--ui-primary),
    var(--ui-primary-darken)
  );
  border-radius: 12px 12px 20px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}

.wallet-mouth {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 12px;
  background: #1e293b;
  border-radius: 8px 8px 0 0;
}

.wallet-outline {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 12px 12px 20px 20px;
  pointer-events: none;
  animation: outline-pulse 1.5s ease-in-out infinite;
}

.loading-text {
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #334155;
  text-align: center;
  letter-spacing: 0.5px;
  margin-top: 16px;
  opacity: 0.8;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes outline-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes stack-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-4px);
  }
}
</style>
