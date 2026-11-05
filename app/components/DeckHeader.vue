<template>
  <!-- HEADER -->
  <div
    class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-inherit pb-6 mb-6 gap-4 w-full">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-wide title-text leading-tight mb-1">&gt;
        CLIPPER_v1.0</h1>
      <p class="text-[11px] sm:text-xs uppercase tracking-wider font-bold muted-text opacity-90">High-Performance
        Analogue Clipboard Station</p>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-3 self-end sm:self-auto">
      <a
        href="https://ko-fi.com/joaocarlos67"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Donate to support Clipper on Ko-fi"
        class="donation-button btn-action group flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 active:scale-95"
      >
        <span aria-hidden="true" class="text-base leading-none transition-transform group-hover:scale-125 animate-pulse">♥</span>
        <span>SUPPORT THE PROJECT</span>
      </a>

      <button @click="toggleConfig"
        class="px-4 py-2 border-2 border-inherit font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
        :class="isConfigOpen ? 'btn-on shadow-lg' : 'inner-box hover:border-current'">
        <span class="text-base leading-none">{{ isConfigOpen ? '✕' : '☰' }}</span>
        <span>{{ isConfigOpen ? 'CLOSE SETUP' : 'DECK SETUP' }}</span>
      </button>
    </div>
  </div>

  <!-- SETUP DRAWER -->
  <div v-show="isConfigOpen"
    class="border-2 border-inherit p-6 mb-8 inner-box shadow-2xl transition-all duration-300">
    <div
      class="flex justify-between items-center pb-3 mb-4 border-b border-inherit/40 text-xs font-bold uppercase tracking-wider accent-text">
      <span>[ SYSTEM CALIBRATION & ATMOSPHERE ]</span>
      <span class="muted-text text-[10px] hidden sm:inline">SELECT ARCHITECTURE & COLOR MATRIX</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <span class="block text-[11px] font-bold uppercase muted-text mb-2">1. GEOMETRY SHAPE (BORDER RADIUS):</span>
        <div class="flex flex-wrap gap-2">
          <button @click="setRadius('sharp')"
            class="flex-1 py-2 px-3 border border-inherit text-xs font-bold transition-all text-center"
            :class="radius === 'sharp' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">▪ SHARP (0px)</button>
          <button @click="setRadius('smooth')"
            class="flex-1 py-2 px-3 border border-inherit text-xs font-bold transition-all text-center"
            :class="radius === 'smooth' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">◼ SMOOTH (6px)</button>
          <button @click="setRadius('pill')"
            class="flex-1 py-2 px-3 border border-inherit text-xs font-bold transition-all text-center"
            :class="radius === 'pill' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">⬤ PILL (MAX)</button>
        </div>
      </div>

      <div>
        <span class="block text-[11px] font-bold uppercase muted-text mb-2">2. VISUAL ATMOSPHERE (THEME MATRIX):</span>
        <div class="flex flex-wrap gap-2">
          <button @click="setTheme('cyberpunk')"
            class="flex items-center gap-1.5 px-3 py-2 border border-inherit text-xs font-bold transition-all"
            :class="theme === 'cyberpunk' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00ffff] shadow-[0_0_6px_#00ffff]"></span> CYBER
          </button>
          <button @click="setTheme('lofi')"
            class="flex items-center gap-1.5 px-3 py-2 border border-inherit text-xs font-bold transition-all"
            :class="theme === 'lofi' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">
            <span class="w-2.5 h-2.5 rounded-full bg-[#c85a32]"></span> LOFI
          </button>
          <button @click="setTheme('rain')"
            class="flex items-center gap-1.5 px-3 py-2 border border-inherit text-xs font-bold transition-all"
            :class="theme === 'rain' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">
            <span class="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]"></span> RAIN
          </button>
          <button @click="setTheme('puredark')"
            class="flex items-center gap-1.5 px-3 py-2 border border-inherit text-xs font-bold transition-all"
            :class="theme === 'puredark' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00ff66]"></span> DARK
          </button>
          <button @click="setTheme('glass')"
            class="flex items-center gap-1.5 px-3 py-2 border border-inherit text-xs font-bold transition-all"
            :class="theme === 'glass' ? 'btn-on shadow-sm' : 'channel-box hover:opacity-80'">
            <span class="w-2.5 h-2.5 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]"></span> GLASS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme, radius, isConfigOpen, toggleConfig, setTheme, setRadius } = useClipStore()
</script>
