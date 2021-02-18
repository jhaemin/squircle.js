export { squirclify as squirklify } from './squircle'
;(async () => {
  if ('ResizeObserver' in window === false) {
    // Loads polyfill asynchronously, only if required.
    const module = await import('@juggle/resize-observer')
    window.ResizeObserver = module.ResizeObserver as any
  }
})()
