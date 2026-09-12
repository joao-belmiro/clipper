<template>
  <div class="mb-8 transition-all duration-300">
    <!-- DROPZONE -->
    <div v-if="!isEditing" @click="triggerManualPaste" @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false" @drop.prevent="handleDrop"
      class="border-2 border-dashed border-inherit p-6 sm:p-8 inner-box flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group hover:border-solid transition-all"
      :class="isDragging ? 'border-solid bg-white/5 scale-[0.99]' : 'radar-active'">

      <div
        class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-inherit flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-black/20">
        <span class="text-2xl">⚡</span>
      </div>
      <h3 class="text-sm sm:text-base font-bold uppercase tracking-widest accent-text mb-1">[ CLIPBOARD RADAR ACTIVE ]</h3>
      <p class="text-[11px] sm:text-xs muted-text max-w-md">
        Press <kbd class="px-1.5 py-0.5 border border-inherit text-xs font-mono">Ctrl + V</kbd> anywhere on screen,
        drag and drop text/code/prompts, or <span class="underline decoration-dotted">click here</span> to open console.
      </p>
    </div>

    <!-- EDITOR -->
    <div v-else class="border-2 border-inherit p-4 sm:p-6 inner-box shadow-2xl animate-fade-in">
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2 truncate">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
          <span class="text-xs uppercase font-bold accent-text truncate">[ MODULATING INPUT ] // DETECTED:
            <span class="underline font-extrabold">{{ detectedType }}</span>
          </span>
        </div>
        <button @click="cancelPaste" class="text-xs muted-text hover:text-red-500 font-bold px-2 py-1 shrink-0">
          [ X ABORT ]
        </button>
      </div>

      <textarea ref="textareaRef" v-model="newItem" @keydown.ctrl.enter="addItem" @keydown.esc="cancelPaste"
        placeholder="Edit snippet or AI instruction prompt..."
        aria-label="Snippet editor"
        class="w-full p-4 border border-inherit channel-box outline-none min-h-[140px] text-sm font-mono leading-relaxed resize-y focus:ring-1 focus:ring-inherit mb-4"></textarea>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <span class="text-[10px] muted-text uppercase text-center sm:text-left">
          TIP: Press <kbd class="border px-1">Ctrl + Enter</kbd> to inject instantly or
          <kbd class="border px-1">Esc</kbd> to cancel.
        </span>
        <div class="flex gap-3 w-full sm:w-auto">
          <button @click="cancelPaste"
            class="flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase border border-inherit inner-box muted-text">
            Cancel
          </button>
          <button @click="addItem"
            class="flex-1 sm:flex-none px-8 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-inherit btn-action active:translate-x-1 active:translate-y-1">
            [ + INJECT ASSET ]
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useClipStore()
const { isEditing, isDragging, newItem, detectedType, addItem, cancelPaste, triggerManualPaste, handleDrop } = store

// Local textarea ref — focus when editor opens
const textareaRef = ref<HTMLTextAreaElement | null>(null)

watch(isEditing, async (val) => {
  if (val) {
    await nextTick()
    textareaRef.value?.focus()
  }
})
</script>
