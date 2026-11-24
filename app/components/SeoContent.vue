<template>
  <section aria-labelledby="clipper-guide-title" class="mt-10 select-text border-t-2 border-inherit/40 pt-8">
    <header class="mb-8">
      <h2 id="clipper-guide-title" class="text-xl sm:text-2xl font-bold tracking-wide title-text">
        A free clipboard manager for text, code, and prompts
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed muted-text">
        Clipper is a browser-based clipboard manager that helps you save, search, and reuse snippets.
        Keep useful text, code, links, and AI prompts together in one place while you work.
      </p>
    </header>

    <div class="grid gap-6 md:grid-cols-3">
      <article class="border border-inherit/50 p-4 inner-box">
        <h3 class="font-bold accent-text">Save useful snippets</h3>
        <p class="mt-2 text-sm leading-relaxed muted-text">
          Paste text with Ctrl + V, drag and drop content, or enter a snippet manually.
          Clipper recognizes common content such as code, prompts, links, email addresses, and colors.
        </p>
      </article>

      <article class="border border-inherit/50 p-4 inner-box">
        <h3 class="font-bold accent-text">Search and organize</h3>
        <p class="mt-2 text-sm leading-relaxed muted-text">
          Search your clipboard history by keyword, filter snippets by type, and sort them
          by newest, oldest, or alphabetically.
        </p>
      </article>

      <article class="border border-inherit/50 p-4 inner-box">
        <h3 class="font-bold accent-text">Keep snippets in your browser</h3>
        <p class="mt-2 text-sm leading-relaxed muted-text">
          Your snippets are stored in this browser and are not synced to a Clipper cloud account.
          No account is needed to use the clipboard manager.
        </p>
      </article>
    </div>

    <section aria-labelledby="clipper-faq-title" class="mt-10">
      <h2 id="clipper-faq-title" class="text-lg sm:text-xl font-bold tracking-wide title-text">
        Frequently asked questions
      </h2>

      <div class="mt-4 grid gap-5 md:grid-cols-2">
        <article>
          <h3 class="font-bold accent-text">Where is my clipboard history stored?</h3>
          <p class="mt-1 text-sm leading-relaxed muted-text">
            Clipper stores snippets in the browser's local IndexedDB storage on this device.
            The history is not available in another browser or on another device.
          </p>
        </article>

        <article>
          <h3 class="font-bold accent-text">Can I save code and AI prompts?</h3>
          <p class="mt-1 text-sm leading-relaxed muted-text">
            Yes. Save code, AI prompts, notes, links, and other text snippets, then search
            or filter your history when you need them.
          </p>
        </article>

        <article>
          <h3 class="font-bold accent-text">Do I need to create an account?</h3>
          <p class="mt-1 text-sm leading-relaxed muted-text">
            No account is required. Open Clipper in a supported browser and start adding snippets.
          </p>
        </article>

        <article>
          <h3 class="font-bold accent-text">Will my snippets sync across devices?</h3>
          <p class="mt-1 text-sm leading-relaxed muted-text">
            No. Snippets stay in the browser storage on the device where you saved them.
            Clearing that browser's site data can remove the saved history.
          </p>
        </article>
      </div>
    </section>
  </section>
</template>
