// ============================================================
// Horizontal Scroll System — directional snapping
// ============================================================

export class HorizontalScroller {
  constructor(track, onProgress, config = {}) {
    this.track      = track;
    this.onProgress = onProgress || (() => {});

    this.target    = 0;
    this.current   = 0;
    this.maxScroll = 0;
    this.isLocked  = false;

    this._snapPoints  = [];
    this._snapTimer   = null;
    this._snapDelay   = config.snapDelay   ?? 500;
    this._easing      = config.easing      ?? 0.072;
    this._wheelMult   = config.wheelMultiplier ?? 1.2;
    this._snapCommit  = config.snapCommit  ?? 0.15;

    this._scrollDir  = 1;

    this._touchStartX = 0;
    this._touchStartY = 0;
    this._touchLastX  = 0;

    this._recalc();
    this._bind();
    this._tick();
  }

  // ── Public API ──────────────────────────────────────────────

  setSnapPoints(points) {
    this._snapPoints = points; // must be sorted ascending
  }

  scrollTo(x, instant = false) {
    this.target = this._clamp(x);
    if (instant) { this.current = this.target; this._apply(); }
  }

  scrollToEl(el, instant = false) {
    if (!el) return;
    this.scrollTo(el.offsetLeft, instant);
  }

  resize() { this._recalc(); }

  // ── Private ──────────────────────────────────────────────────

  _recalc() {
    this.maxScroll = Math.max(0, this.track.scrollWidth - window.innerWidth);
    this.target    = this._clamp(this.target);
  }

  _clamp(x) {
    return Math.max(0, Math.min(x, this.maxScroll));
  }

  _bind() {
    window.addEventListener('wheel',      this._onWheel.bind(this),      { passive: false });
    window.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: true  });
    window.addEventListener('touchmove',  this._onTouchMove.bind(this),  { passive: false });
    window.addEventListener('touchend',   this._onTouchEnd.bind(this),   { passive: true  });
    window.addEventListener('keydown',    this._onKeyDown.bind(this));
    window.addEventListener('resize',     this._onResize.bind(this));
  }

  // ── Input handlers ────────────────────────────────────────────

  _onWheel(e) {
    if (this.isLocked || window.innerWidth <= 768) return;
    e.preventDefault();

    let delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) delta *= 32;
    if (e.deltaMode === 2) delta *= 800;

    if (delta !== 0) this._scrollDir = delta > 0 ? 1 : -1;
    this.target = this._clamp(this.target + delta * this._wheelMult);
    this._scheduleSnap();
  }

  _onTouchStart(e) {
    this._touchStartX = e.touches[0].clientX;
    this._touchStartY = e.touches[0].clientY;
    this._touchLastX  = e.touches[0].clientX;
    clearTimeout(this._snapTimer);
  }

  _onTouchMove(e) {
    if (window.innerWidth <= 768) return;
    const dx     = this._touchLastX - e.touches[0].clientX;
    const dy     = Math.abs(e.touches[0].clientY - this._touchStartY);
    const movedX = Math.abs(e.touches[0].clientX - this._touchStartX);

    if (movedX > dy) {
      e.preventDefault();
      if (dx !== 0) this._scrollDir = dx > 0 ? 1 : -1;
      this.target = this._clamp(this.target + dx * this._wheelMult);
    }
    this._touchLastX = e.touches[0].clientX;
  }

  _onTouchEnd() {
    if (window.innerWidth <= 768) return;
    this._scheduleSnap(280);
  }

  _onKeyDown(e) {
    const step = 180;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      this._scrollDir = 1;
      this.target = this._clamp(this.target + step);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      this._scrollDir = -1;
      this.target = this._clamp(this.target - step);
    }
    if (e.key === 'Home') { this._scrollDir = -1; this.target = 0; }
    if (e.key === 'End')  { this._scrollDir =  1; this.target = this.maxScroll; }
    this._scheduleSnap();
  }

  _onResize() { this._recalc(); this._apply(); }

  // ── Snapping ─────────────────────────────────────────────────

  _scheduleSnap(delay = this._snapDelay) {
    clearTimeout(this._snapTimer);
    this._snapTimer = setTimeout(() => this._doSnap(), delay);
  }

  _doSnap() {
    const pts = this._snapPoints;
    if (!pts.length) return;

    const t = this.target;

    // Already exactly at a snap point — nothing to do
    if (pts.includes(t)) return;

    // Clamp to first / last if target drifted outside
    if (t <= pts[0]) { this.target = this._clamp(pts[0]); return; }
    if (t >= pts[pts.length - 1]) { this.target = this._clamp(pts[pts.length - 1]); return; }

    // Find the [lo, hi] segment target sits in
    let lo = pts[0], hi = pts[pts.length - 1];
    for (let i = 0; i < pts.length - 1; i++) {
      if (t >= pts[i] && t < pts[i + 1]) {
        lo = pts[i];
        hi = pts[i + 1];
        break;
      }
    }

    // How far into the segment (0 = at lo, 1 = at hi)
    const progress = (t - lo) / (hi - lo);

    // Need to cross 15% of a segment to commit — prevents micro-scroll from
    // flying you to the next entry. Below that, bounce back to where you were.
    const COMMIT = this._snapCommit;

    let snapTo;
    if (this._scrollDir >= 0) {
      snapTo = progress >= COMMIT ? hi : lo;
    } else {
      snapTo = progress <= (1 - COMMIT) ? lo : hi;
    }

    this.target = this._clamp(snapTo);
  }

  // ── Render loop ───────────────────────────────────────────────

  _tick() {
    const diff = this.target - this.current;
    this.current = Math.abs(diff) < 0.05 ? this.target : this.current + diff * this._easing;

    this._apply();

    const progress = this.maxScroll > 0 ? this.current / this.maxScroll : 0;
    this.onProgress(progress, this.current);

    requestAnimationFrame(this._tick.bind(this));
  }

  _apply() {
    this.track.style.transform = `translate3d(${-this.current}px, 0, 0)`;
  }
}
