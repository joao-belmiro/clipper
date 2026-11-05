<template>
  <!-- TOOLBAR -->
  <div
    class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-inherit pb-4 mb-6 text-xs uppercase tracking-widest font-bold gap-3">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="muted-text">SHORT-TERM MEMORY:</span>
      <span class="px-2 py-0.5 border border-inherit inner-box accent-text">
        {{ filteredAndSortedItems.length }} ASSETS
      </span>
      <span v-if="selectedFilter !== 'all' && !isFilterOpen"
        class="text-[10px] text-amber-400 font-mono px-2 py-0.5 border border-amber-500/40 bg-amber-500/10 flex items-center gap-1 animate-pulse">
        <span>FILTER ACTIVE:</span>
        <span class="underline">{{ selectedFilter.toUpperCase() }}</span>
      </span>
    </div>

    <button @click="toggleFilter"
      class="px-4 py-2 border-2 border-inherit font-bold text-xs tracking-wider flex items-center gap-2 transition-all self-end sm:self-auto active:scale-95"
      :class="isFilterOpen ? 'btn-on shadow-md' : 'inner-box hover:border-current'">
      <span class="text-base leading-none">{{ isFilterOpen ? '✕' : '🔍' }}</span>
      <span>{{ isFilterOpen ? 'CLOSE FILTER CONSOLE' : 'ASSET FILTER & SORT' }}</span>
    </button>
  </div>

  <!-- FILTER DRAWER -->
  <div v-show="isFilterOpen"
    class="border-2 border-inherit p-6 mb-8 inner-box shadow-2xl transition-all duration-300 space-y-6">
    <div
      class="flex justify-between items-center pb-3 border-b border-inherit/40 text-xs font-bold uppercase tracking-wider accent-text">
      <span>[ RADAR SEARCH & ASSET FILTERING ]</span>
      <span class="muted-text text-[10px] hidden sm:inline">ISOLATE SNIPPETS BY TYPE & KEYWORD</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div class="relative flex-1">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-60">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="SEARCH ASSETS BY KEYWORD, CODE OR SYNTAX..."
          aria-label="Search assets"
          class="w-full pl-9 pr-20 py-2.5 border border-inherit channel-box text-xs font-mono outline-none focus:border-current transition-all" />
        <button v-if="searchQuery" @click="searchQuery = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-bold uppercase border border-inherit inner-box muted-text hover:text-red-400">
          CLEAR
        </button>
      </div>

      <div class="flex items-center gap-2 self-end lg:self-auto w-full lg:w-auto justify-end shrink-0 flex-wrap">
        <span class="text-[10px] font-bold uppercase muted-text mr-1">SORT BY:</span>
        <div class="flex gap-1.5 text-xs font-bold uppercase">
          <button @click="setSort('newest')" class="px-3 py-2 border border-inherit transition-all"
            :class="sortBy === 'newest' ? 'btn-on shadow-sm' : 'channel-box muted-text hover:opacity-100 hover:border-current'">NEWEST</button>
          <button @click="setSort('oldest')" class="px-3 py-2 border border-inherit transition-all"
            :class="sortBy === 'oldest' ? 'btn-on shadow-sm' : 'channel-box muted-text hover:opacity-100 hover:border-current'">OLDEST</button>
          <button @click="setSort('alpha')" class="px-3 py-2 border border-inherit transition-all"
            :class="sortBy === 'alpha' ? 'btn-on shadow-sm' : 'channel-box muted-text hover:opacity-100 hover:border-current'">A-Z</button>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between pt-3 border-t border-inherit/20 flex-wrap gap-3 text-xs font-bold uppercase">
      <div class="flex flex-wrap gap-2">
        <button @click="setFilter('all')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'all' ? 'btn-on shadow-sm' : 'channel-box muted-text hover:opacity-100 hover:border-current'">
          <span>ALL ASSETS</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ items.length }}</span>
        </button>
        <button @click="setFilter('code')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'code' ? 'btn-on shadow-sm' : 'channel-box text-blue-400 hover:opacity-100 hover:border-current'">
          <span>💻 CODE</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('code') }}</span>
        </button>
        <button @click="setFilter('prompt')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'prompt' ? 'btn-on shadow-sm' : 'channel-box text-amber-400 hover:opacity-100 hover:border-current'">
          <span>🧠 PROMPT</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('prompt') }}</span>
        </button>
        <button @click="setFilter('color')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'color' ? 'btn-on shadow-sm' : 'channel-box text-pink-400 hover:opacity-100 hover:border-current'">
          <span>🎨 COLOR</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('color') }}</span>
        </button>
        <button @click="setFilter('url')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'url' ? 'btn-on shadow-sm' : 'channel-box text-cyan-400 hover:opacity-100 hover:border-current'">
          <span>🔗 URL</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('url') }}</span>
        </button>
        <button @click="setFilter('email')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'email' ? 'btn-on shadow-sm' : 'channel-box text-emerald-400 hover:opacity-100 hover:border-current'">
          <span>✉ EMAIL</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('email') }}</span>
        </button>
        <button @click="setFilter('text')"
          class="px-3.5 py-2 border border-inherit flex items-center gap-2 transition-all"
          :class="selectedFilter === 'text' ? 'btn-on shadow-sm' : 'channel-box text-gray-400 hover:opacity-100 hover:border-current'">
          <span>📝 TEXT</span>
          <span class="px-1.5 bg-black/40 text-[10px] rounded-full font-mono">{{ getCount('text') }}</span>
        </button>
      </div>

      <button v-if="selectedFilter !== 'all' || searchQuery" @click="resetFilters"
        class="px-3 py-1.5 border border-inherit text-[10px] font-bold uppercase channel-box hover:text-red-400">
        [ RESET FILTERS ]
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from '~/composables/useClipStore'

const {
  filteredAndSortedItems, items, selectedFilter, isFilterOpen, searchQuery, sortBy,
  toggleFilter, setFilter, setSort, resetFilters, getCount,
} = useClipStore()
</script>
