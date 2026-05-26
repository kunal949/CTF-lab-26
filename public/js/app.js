// Shared client utilities
window.LAB = {
  async api(path, body, method = 'POST') {
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
  },
  fmtTime(s) {
    s = Math.max(0, parseInt(s || 0, 10));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`;
  },
  async submitFlag(round, flag) {
    const r = await this.api('/api/evaluation/submit-flag', { round, flag });
    if (r.ok) window.location.href = r.redirect;
    else this.toast('Submission rejected. Verify payload.');
    return r;
  },
  toast(msg) {
    let el = document.querySelector('.alert.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'alert toast';
      el.style.position = 'fixed'; el.style.bottom = '24px'; el.style.right = '24px';
      el.style.zIndex = '999'; el.style.background = 'var(--surface)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.remove(), 3500);
  },
  async player() {
    const r = await this.api('/api/evaluation/player', null, 'GET');
    return r.player;
  },
  startTimer(elId, baseSeconds, startMs) {
    const el = document.getElementById(elId);
    if (!el) return;
    function tick() {
      const elapsed = Math.floor((Date.now() - startMs) / 1000) + (baseSeconds || 0);
      el.textContent = LAB.fmtTime(elapsed);
    }
    tick();
    setInterval(tick, 1000);
  }
};
