<template>
  <div
    class="mt-12 p-4 border-2 border-inherit flex flex-col sm:flex-row items-center justify-between gap-4 inner-box text-xs font-mono">
    <div class="muted-text text-[11px] text-center sm:text-left">
      [STATUS: RADAR ONLINE] // [MEM: PERSISTENT]
    </div>

    <div
      class="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-inherit/20">
      <button @click="toggleMute"
        class="px-3 py-1 border border-inherit font-bold text-[11px] transition-all flex items-center gap-1.5 shrink-0"
        :class="!isMuted ? 'btn-on shadow-sm' : 'muted-text opacity-70 hover:opacity-100'">
        <span>{{ !isMuted ? '🔊 SFX: ON' : '🔇 SFX: MUTED' }}</span>
      </button>

      <div class="flex items-center gap-2 px-2 py-1 border border-inherit channel-box w-36 sm:w-40"
        :class="{ 'opacity-30 pointer-events-none': isMuted }">
        <span class="text-[10px] muted-text font-bold">VOL</span>
        <input type="range" min="0" max="1" step="0.05" v-model.number="volume"
          aria-label="Volume"
          class="w-full cursor-pointer inner-box border border-inherit">
        <span class="text-[10px] font-bold accent-text w-6 text-right">{{ Math.round(volume * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isMuted, volume, toggleMute } = useClipStore()
</script>
