<template>
  <div v-if="totalPages > 1"
    class="mt-8 pt-6 border-t border-inherit/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
    <div class="muted-text text-[11px]">
      PAGE NAVIGATION // VIEWING BLOCK {{ currentPage }} OF {{ totalPages }}
    </div>

    <div class="flex items-center gap-2">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
        class="px-4 py-2 border border-inherit font-bold uppercase transition-all disabled:opacity-20 disabled:pointer-events-none"
        :class="currentPage > 1 ? 'channel-box hover:border-current' : 'inner-box'">
        ◄ PREV PAGE
      </button>

      <div class="flex gap-1">
        <button v-for="page in totalPages" :key="page" @click="changePage(page)"
          class="w-8 h-8 border border-inherit font-bold flex items-center justify-center transition-all"
          :class="currentPage === page ? 'btn-on shadow-sm' : 'inner-box muted-text hover:opacity-100'">
          {{ String(page).padStart(2, '0') }}
        </button>
      </div>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="px-4 py-2 border border-inherit font-bold uppercase transition-all disabled:opacity-20 disabled:pointer-events-none"
        :class="currentPage < totalPages ? 'channel-box hover:border-current' : 'inner-box'">
        NEXT PAGE ►
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { totalPages, currentPage, changePage } = useClipStore()
</script>
