<template>
  <!-- EMPTY STATE -->
  <div v-if="filteredAndSortedItems.length === 0"
    class="p-12 border-2 border-dashed border-inherit text-center my-8 inner-box">
    <span class="text-4xl block mb-3 opacity-50">📡</span>
    <h4 class="text-base font-bold uppercase tracking-widest accent-text mb-1">[ NO MATCHING ASSETS FOUND IN BUFFER ]</h4>
    <p class="text-xs muted-text max-w-sm mx-auto mb-4">
      No snippets match your current filter or search criteria "{{ searchQuery }}". Try clearing your radar input.
    </p>
    <button @click="resetFilters"
      class="px-6 py-2 border border-inherit text-xs font-bold uppercase channel-box hover:border-current">
      RESET ALL FILTERS
    </button>
  </div>

  <!-- CHANNELS GRID -->
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="item in paginatedItems" :key="item.id"
      class="p-5 border-2 border-inherit channel-box flex flex-col justify-between relative group hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
      :class="[
        getTypeBorderClass(item.type),
        item.justCopied ? '!border-green-500 !shadow-[0_0_25px_rgba(34,197,94,0.4)]' : '',
        !item.justCopied && item.type === 'code' ? 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/80' : '',
        !item.justCopied && item.type === 'prompt' ? 'shadow-[0_0_18px_rgba(245,158,11,0.2)] border-amber-500/80' : '',
      ]">

      <!-- Card Header -->
      <div class="flex justify-between items-center pb-3 mb-3 border-b border-inherit/40 text-xs font-bold">
        <span class="font-mono opacity-60">#CH_{{ String(item.displayIndex).padStart(2, '0') }}</span>
        <div
          class="type-badge flex items-center gap-1.5 px-2.5 py-0.5 border border-inherit text-[10px] uppercase font-bold"
          :class="getTypeBadgeClass(item.type)">
          <span v-if="item.type === 'color'"
            class="w-3 h-3 border border-black inline-block rounded-full shrink-0"
            :style="{ backgroundColor: item.content }"></span>
          <span>{{ getTypeLabel(item.type) }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="my-2 flex-grow overflow-x-auto">
        <div v-if="item.type === 'code'"
          class="inner-box border border-blue-500/50 bg-black/80 shadow-[inset_0_0_15px_rgba(59,130,246,0.15)] overflow-hidden">
          <div
            class="terminal-header px-3 py-1.5 bg-blue-950/60 border-b border-blue-500/30 flex items-center justify-between text-[10px] font-mono text-blue-300">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-red-500/80 inline-block"></span>
              <span class="w-2 h-2 rounded-full bg-yellow-500/80 inline-block"></span>
              <span class="w-2 h-2 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <span class="opacity-80 tracking-widest">[ 💻 IDE_TERMINAL // BASH_JS ]</span>
          </div>
          <pre class="p-3 text-xs font-mono leading-relaxed overflow-x-auto text-blue-200"><code class="whitespace-pre">{{ item.content }}</code></pre>
        </div>

        <div v-else-if="item.type === 'prompt'"
          class="inner-box border border-amber-500/60 bg-gradient-to-br from-amber-500/10 via-black/60 to-amber-950/30 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)] overflow-hidden">
          <div
            class="terminal-header px-3 py-1.5 bg-amber-950/60 border-b border-amber-500/30 flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block shadow-[0_0_6px_#fbbf24]"></span>
              <span class="tracking-widest">[ 🧠 NEURAL_LINK // LLM_INSTRUCTION ]</span>
            </div>
            <span class="text-[9px] opacity-70">PRIORITY: HIGH</span>
          </div>
          <div class="p-3.5 border-l-2 border-amber-500/50 m-2 bg-black/40">
            <p class="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-amber-100 opacity-95">{{ item.content }}</p>
          </div>
        </div>

        <div v-else-if="item.type === 'color'"
          class="flex items-center justify-center p-6 inner-box border border-inherit gap-4">
          <div class="w-12 h-12 border-2 border-inherit shadow-md rounded-full shrink-0"
            :style="{ backgroundColor: item.content }"></div>
          <span class="text-xl font-bold font-mono tracking-wider">{{ item.content }}</span>
        </div>

        <p v-else class="text-sm font-sans leading-relaxed opacity-90 p-2 whitespace-pre-wrap">{{ item.content }}</p>
      </div>

      <!-- Card Actions -->
      <div class="flex gap-2 mt-4 pt-3 border-t border-inherit/40">
        <button @click="copyWithFeedback(item)"
          class="flex-1 py-2 text-xs uppercase font-bold border border-inherit transition-all text-center relative overflow-hidden flex items-center justify-center gap-1.5"
          :class="item.justCopied ? '!bg-green-600 !border-green-400 !text-white !shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-copy-punch' : 'inner-box hover:border-current'">
          <span class="text-sm inline-block transition-transform duration-300"
            :class="{ 'scale-125 rotate-12': item.justCopied }">
            {{ item.justCopied ? '✓' : '❐' }}
          </span>
          <span class="tracking-wider">{{ item.justCopied ? 'ASSET COPIED!' : 'COPY ASSET' }}</span>
        </button>

        <button @click="removeItem(item.id)"
          class="px-4 py-2 text-xs font-extrabold tracking-wider uppercase border border-red-500/50 bg-red-950/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] active:scale-90 transition-all flex items-center justify-center gap-1 shrink-0 group/btn"
          title="Purge Asset Immediately">
          <span class="group-hover/btn:rotate-90 transition-transform duration-200">✕</span>
          <span class="hidden sm:inline">PURGE</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  paginatedItems, filteredAndSortedItems, searchQuery,
  copyWithFeedback, removeItem, resetFilters,
  getTypeBadgeClass, getTypeBorderClass, getTypeLabel,
} = useClipStore()
</script>
