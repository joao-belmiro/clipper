declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const containerId = 'GTM-P462S8DP'
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`
  document.head.appendChild(script)

  nuxtApp.hook('app:mounted', () => {
    window.dataLayer.push({
      event: 'screen_view',
      screen_name: 'dev_clipper_home',
      page_title: document.title,
    })
  })
})