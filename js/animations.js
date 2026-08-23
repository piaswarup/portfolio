// ============================================================
// Reveal Animation System
// Watches elements via getBoundingClientRect each scroll tick
// (Intersection Observer ignores CSS transforms, so we roll our own)
// ============================================================

export class AnimationObserver {
  constructor() {
    this.entries = [];   // { el, margin }
    this.viewW = window.innerWidth;
    window.addEventListener('resize', () => { this.viewW = window.innerWidth; });
  }

  observe(el, margin = 0.15) {
    this.entries.push({ el, margin });
  }

  // Call this every animation frame with the current scroll position
  tick(scrollX) {
    for (const { el, margin } of this.entries) {
      if (el.classList.contains('visible')) continue;

      const rect = el.getBoundingClientRect();
      const triggerPoint = this.viewW * (1 - margin);

      if (rect.left < triggerPoint && rect.right > 0) {
        el.classList.add('visible');
      }
    }
  }
}
