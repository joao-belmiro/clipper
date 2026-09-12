<template>
  <div id="main-body" class="theme-cyberpunk radius-smooth min-h-screen p-3 sm:p-6 md:p-8 select-none">
    <div id="app" class="relative w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 border-4 deck-box pixel-mesh shadow-2xl">
      <div class="relative z-10">
        <DeckHeader />
        <ClipDropzone />
        <FilterConsole />
        <ClipGrid />
        <ClipPagination />
        <DeckFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useClipStore()

onMounted(async () => {
  await store.init()
  store.loadInitialSettings();
  window.addEventListener('paste', store.onGlobalPaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', store.onGlobalPaste)
  store.dispose()
})
</script>
