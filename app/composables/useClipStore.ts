import { effectScope } from "vue";

export type ItemType = "code" | "prompt" | "color" | "url" | "email" | "text";

export interface ClipItem {
  id: number;
  timestamp: number;
  content: string;
  type: ItemType;
  justCopied: boolean;
}

interface StoredItem {
  id: number;
  timestamp: number;
  content: string;
  type: ItemType;
}

const DB_NAME = "devclipperdb";
const DB_VERSION = 1;
const STORE_NAME = "items";
const BORDER_RADIUS_STORE = "border-radius";
const THEME_STORE = "theme";

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME))
        req.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbAdd(item: StoredItem): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db!.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbDelete(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db!.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbGetAll(): Promise<StoredItem[]> {
  return new Promise((resolve, reject) => {
    const tx = db!.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as StoredItem[]);
    req.onerror = () => reject(req.error);
  });
}

const theme = ref("");
const radius = ref("");
const newItem = ref("");
const isEditing = ref(false);
const isDragging = ref(false);
const isConfigOpen = ref(false);
const isFilterOpen = ref(false);
const searchQuery = ref("");
const selectedFilter = ref<ItemType | "all">("all");
const sortBy = ref<"newest" | "oldest" | "alpha">("newest");
const currentPage = ref(1);
const itemsPerPage = 6;
const isMuted = ref(false);
const volume = ref(0.4);
const items = ref<ClipItem[]>([]);

let audioCtx: AudioContext | null = null;

function initAudio(): void {
  try {
    if (!audioCtx) {
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch {
  }
}

function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  offset = 0,
  gainMult = 1,
): void {
  if (isMuted.value || volume.value <= 0) return;
  initAudio();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + offset);
    const maxGain = volume.value * gainMult * 0.3;
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime + offset);
    gain.gain.linearRampToValueAtTime(
      maxGain,
      audioCtx.currentTime + offset + 0.02,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + offset + duration,
    );
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + offset);
    osc.stop(audioCtx.currentTime + offset + duration);
  } catch {
    /* audio node error */
  }
}

function playSoundPaste() {
  playTone(330, "triangle", 0.15, 0, 0.8);
  playTone(659.25, "sine", 0.25, 0.08, 1.0);
}
function playSoundCopy() {
  playTone(880, "sine", 0.12, 0, 0.9);
  playTone(1760, "sine", 0.2, 0.05, 0.6);
}
function playSoundSwitch() {
  playTone(520, "square", 0.05, 0, 0.4);
  playTone(340, "triangle", 0.08, 0.03, 0.3);
}

function playSoundDelete(): void {
  if (isMuted.value || volume.value <= 0 || !audioCtx) {
    initAudio();
    return;
  }
  try {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, audioCtx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      40,
      audioCtx!.currentTime + 0.18,
    );
    gain.gain.setValueAtTime(volume.value * 0.25, audioCtx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx!.currentTime + 0.18,
    );
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start();
    osc.stop(audioCtx!.currentTime + 0.18);
  } catch {
    /* audio node error */
  }
}

function getSafeUrl(text: string): URL | null {
  const value = text.trim();
  if (!value || /\s/.test(value)) return null;

  const hasHttpScheme = /^https?:\/\//i.test(value);
  const isLocalhostWithPort = /^localhost:\d+(?:\/|$)/i.test(value);
  if (
    /^[a-z][a-z\d+.-]*:/i.test(value) &&
    !hasHttpScheme &&
    !isLocalhostWithPort
  )
    return null;

  try {
    const url = new URL(hasHttpScheme ? value : `https://${value}`);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (
      !url.hostname.includes(".") &&
      !url.hostname.includes(":") &&
      url.hostname !== "localhost"
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

function detectType(text: string): ItemType {
  const t = text.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "email";
  if (getSafeUrl(t)) return "url";
  if (/^#([0-9A-F]{3}){1,2}$/i.test(t) || /^rgb\(/.test(t)) return "color";
  if (
    /(\bact as\b|\byou are\b|\bprompt:\b|\bsystem:\b|\bignore previous\b|\/imagine\b|\bstep-by-step\b|\bcontext:\b|\brules:\b|\boutput format:\b|\bllm\b|\bgpt\b|\bgemini\b|\bclaude\b|\bmidjourney\b|```)/i.test(
      t,
    )
  )
    return "prompt";
  if (
    /([{}]|=|;\n|\bconst\b|\blet\b|\bvar\b|\bfunction\b|\bclass\b|\bimport\b|\bdiv\b|\bscript\b|=>)/.test(
      t,
    )
  )
    return "code";
  return "text";
}

type StoreReturn = ReturnType<typeof createStore>;
let _cache: StoreReturn | null = null;
const _scope = effectScope(true);

function createStore() {
  return _scope.run(() => {
    const filteredAndSortedItems = computed(() => {
      let result = [...items.value];
      if (selectedFilter.value !== "all")
        result = result.filter((i) => i.type === selectedFilter.value);
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((i) => i.content.toLowerCase().includes(q));
      }
      if (sortBy.value === "newest")
        result.sort((a, b) => b.timestamp - a.timestamp);
      else if (sortBy.value === "oldest")
        result.sort((a, b) => a.timestamp - b.timestamp);
      else if (sortBy.value === "alpha")
        result.sort((a, b) => a.content.localeCompare(b.content));
      return result.map((item, idx) => ({
        ...item,
        displayIndex: result.length - idx,
      }));
    });

    const totalPages = computed(
      () => Math.ceil(filteredAndSortedItems.value.length / itemsPerPage) || 1,
    );

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredAndSortedItems.value.slice(start, start + itemsPerPage);
    });

    const detectedType = computed(() => detectType(newItem.value));

    watch([searchQuery, selectedFilter, sortBy], () => {
      currentPage.value = 1;
    });

    function updateBodyClasses(): void {
      const el = document.getElementById("main-body");
      if (el)
        el.className = `theme-${theme.value} radius-${radius.value} min-h-screen p-3 sm:p-6 md:p-8 select-none`;
    }

    function toggleMute() {
      isMuted.value = !isMuted.value;
      if (!isMuted.value) playSoundCopy();
    }
    function toggleConfig() {
      isConfigOpen.value = !isConfigOpen.value;
      if (isConfigOpen.value) isFilterOpen.value = false;
      playSoundSwitch();
    }
    function toggleFilter() {
      isFilterOpen.value = !isFilterOpen.value;
      if (isFilterOpen.value) isConfigOpen.value = false;
      playSoundSwitch();
    }
    function setTheme(t: string) {
      localStorage.setItem(THEME_STORE, t);
      theme.value = t;
      updateBodyClasses();
      playSoundSwitch();
    }
    function loadInitialSettings() {
        const storedTheme = localStorage.getItem(THEME_STORE);
        theme.value =  storedTheme ? storedTheme : "cyberpunk";
        const storedRadius = localStorage.getItem(BORDER_RADIUS_STORE);
        radius.value  = storedRadius ? storedRadius: "smooth";
        updateBodyClasses();
    }
    function setRadius(r: string) {
      localStorage.setItem(BORDER_RADIUS_STORE, r);
      radius.value = r;
      updateBodyClasses();
      playSoundSwitch();
    }
    function setFilter(f: ItemType | "all") {
      selectedFilter.value = f;
      playSoundSwitch();
    }
    function setSort(s: "newest" | "oldest" | "alpha") {
      sortBy.value = s;
      playSoundSwitch();
    }
    function changePage(page: number) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        playSoundSwitch();
      }
    }
    function resetFilters() {
      searchQuery.value = "";
      selectedFilter.value = "all";
      sortBy.value = "newest";
      playSoundSwitch();
    }
    function getCount(type: ItemType) {
      return items.value.filter((i) => i.type === type).length;
    }

    async function addItem(): Promise<void> {
      if (!newItem.value.trim()) return;
      const stored: StoredItem = {
        id: Date.now(),
        timestamp: Date.now(),
        content: newItem.value,
        type: detectType(newItem.value),
      };
      await idbAdd(stored);
      items.value.unshift({ ...stored, justCopied: false });
      newItem.value = "";
      isEditing.value = false;
      playSoundPaste();
    }

    function cancelPaste(): void {
      newItem.value = "";
      isEditing.value = false;
      playSoundDelete();
    }

    async function removeItem(id: number): Promise<void> {
      await idbDelete(id);
      const idx = items.value.findIndex((i) => i.id === id);
      if (idx !== -1) {
        items.value.splice(idx, 1);
        playSoundDelete();
      }
    }

    function copyWithFeedback(item: ClipItem): void {
      navigator.clipboard.writeText(item.content);
      const original = items.value.find((i) => i.id === item.id);
      if (!original) return;
      original.justCopied = true;
      playSoundCopy();
      setTimeout(() => {
        original.justCopied = false;
      }, 1500);
    }

    function openEditorWithContent(text: string): void {
      newItem.value = text;
      isEditing.value = true;
    }

    async function triggerManualPaste(): Promise<void> {
      try {
        const text = await navigator.clipboard.readText();
        openEditorWithContent(text || "");
      } catch {
        openEditorWithContent("");
      }
    }

    function handleDrop(e: DragEvent): void {
      isDragging.value = false;
      const text = e.dataTransfer?.getData("text") ?? "";
      if (text) {
        openEditorWithContent(text);
        playSoundPaste();
      }
    }

    // Global paste handler — registered by app.vue
    function onGlobalPaste(e: ClipboardEvent): void {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const text = e.clipboardData?.getData("text") ?? "";
      if (text) {
        e.preventDefault();
        openEditorWithContent(text);
        playSoundPaste();
      }
    }

    function getTypeBadgeClass(type: ItemType): string {
      switch (type) {
        case "url":
          return "bg-cyan-900/40 text-cyan-300 border-cyan-500";
        case "email":
          return "bg-emerald-900/40 text-emerald-300 border-emerald-500";
        case "code":
          return "bg-blue-900/40 text-blue-300 border-blue-500";
        case "color":
          return "bg-pink-900/40 text-pink-300 border-pink-500";
        case "prompt":
          return "bg-amber-900/40 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
        default:
          return "inner-box muted-text";
      }
    }

    function getTypeBorderClass(type: ItemType): string {
      switch (type) {
        case "url":
          return "border-l-4 border-l-cyan-500";
        case "email":
          return "border-l-4 border-l-emerald-500";
        case "code":
          return "border-l-4 border-l-blue-500";
        case "color":
          return "border-l-4 border-l-pink-500";
        case "prompt":
          return "border-l-4 border-l-amber-500";
        default:
          return "border-l-4 border-l-gray-500";
      }
    }

    function getTypeLabel(type: ItemType): string {
      switch (type) {
        case "url":
          return "WEB // URL";
        case "email":
          return "CONTACT // EMAIL";
        case "code":
          return "SNIPPET // CODE";
        case "color":
          return "HEX // COLOR";
        case "prompt":
          return "AI // PROMPT";
        default:
          return "MEMO // TEXT";
      }
    }

    async function init(): Promise<void> {
      db = await openDB();
      const stored = await idbGetAll();
      items.value = stored.map((s) => ({
        ...s,
        type: detectType(s.content),
        justCopied: false,
      }));
    }

    function dispose(): void {
      db?.close();
    }

    return {
      theme,
      radius,
      newItem,
      isEditing,
      isDragging,
      isConfigOpen,
      isFilterOpen,
      searchQuery,
      selectedFilter,
      sortBy,
      currentPage,
      isMuted,
      volume,
      items,
      filteredAndSortedItems,
      totalPages,
      paginatedItems,
      detectedType,
      toggleMute,
      toggleConfig,
      toggleFilter,
      setTheme,
      setRadius,
      setFilter,
      setSort,
      changePage,
      resetFilters,
      getCount,
      addItem,
      cancelPaste,
      removeItem,
      copyWithFeedback,
      openEditorWithContent,
      triggerManualPaste,
      handleDrop,
      onGlobalPaste,
      getTypeBadgeClass,
      getTypeBorderClass,
      getTypeLabel,
      getSafeUrl,
      init,
      dispose,
      loadInitialSettings,
    };
  })!;
}

export function useClipStore() {
  if (!_cache) _cache = createStore();
  return _cache;
}
