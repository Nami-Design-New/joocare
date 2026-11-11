/*!
 * Joocare AI Engine v1.0
 * Animated hero diagram: an AI cell of dots inside a precision ring with the 8 hiring steps.
 * SVG + canvas, no dependencies. See README.md.
 *
 *   <link rel="stylesheet" href="ai-engine/joocare-ai-engine.css">
 *   <div data-joocare-engine data-logo="ai-engine/joocare-logo-on-dark.png"></div>
 *   <script src="ai-engine/joocare-ai-engine.js" defer></script>
 */
(function () {
  'use strict';

  /* ================================ CONTENT ================================
   * The 8 steps. Step 1 sits at one o'clock and the spark moves clockwise,
   * so step 8 ends at the top left, facing step 1.
   *   label:  [bold first line, lighter second line]
   *   status: the line shown in the centre while the step is active
   *   icon:   a key of ICONS below
   * ======================================================================== */
  const STEPS = [
    { label: ['CV', 'Analysis'], status: 'Analyzing CVs', icon: 'cvScan' },
    {
      label: ['Qualification', 'Review'],
      status: 'Reviewing qualifications',
      icon: 'cap',
    },
    {
      label: ['Credential', 'Verification'],
      status: 'Verifying credentials',
      icon: 'shield',
    },
    {
      label: ['Assessment', 'Insights'],
      status: 'Building assessment insights',
      icon: 'insight',
    },
    {
      label: ['Talent', 'Matching'],
      status: 'Matching talent to roles',
      icon: 'match',
    },
    { label: ['Talent', 'Ranking'], status: 'Ranking talent', icon: 'rank' },
    {
      label: ['Smart', 'Shortlisting'],
      status: 'Shortlisting the best fit',
      icon: 'shortlist',
    },
    {
      label: ['Hiring', 'Insights'],
      status: 'Delivering hiring insights',
      icon: 'bulb',
    },
  ];
  const TOP_LABEL = 'JOOCARE INTELLIGENCE';
  const CORE_LABEL = 'AI ENGINE';
  const FOOTER = [
    'Workforce Complexity',
    'Hiring Intelligence',
    'Better Hiring Decisions',
  ];

  // 24 x 24 line icons
  const ICONS = {
    cvScan:
      'M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h5 M14 3l4.5 4.5V10 M14 3v4.5h4.5 M8.5 9h3 M8.5 12.5h4 M15.5 18.75a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5z M17.9 17.9l2.6 2.6',
    cap: 'M2.5 9 12 4.5 21.5 9 12 13.5z M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11 M21.5 9v5',
    shield: 'M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z M9 12l2 2 4-4',
    insight:
      'M9 3.5h6v3H9z M9 5H7a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17 5h-2 M9 17.5v-3 M12 17.5v-6 M15 17.5v-4.5',
    match:
      'M3.5 8.5h4.5a2.5 2.5 0 1 1 3 0h4.5v3.5a2.5 2.5 0 1 1 0 3v4.5h-12v-4a2.5 2.5 0 1 0 0-3z',
    rank: 'M4 20h16 M6 20v-5h4v5 M10 20V9h4v11 M14 20v-7h4v7',
    shortlist:
      'M3.5 6.5 5 8l3-3 M3.5 12.5 5 14l3-3 M11 6.5h9.5 M11 12.5h9.5 M11 18.5h9.5 M5.75 18.5h.01',
    bulb: 'M9.5 18.5h5 M10.5 21h3 M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2V16h5v-.1c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z',
  };

  /* =============================== GEOMETRY ===============================
   * Everything is drawn in fixed viewBox units around a centre of (720, 500).
   * ======================================================================== */
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 720,
    CY = 500,
    ORBIT = 335,
    CORE = 230;
  const COMPACT_BELOW = 480; // px: narrower boxes hide the labels
  const BLOCK_TOP = 125,
    BLOCK_BOTTOM = 875; // the ring with its step circles and labels
  const MIN_LINE = 60; // shortest top and bottom dotted lines

  const rad = (d) => (d * Math.PI) / 180;
  const polar = (deg, r) => [
    CX + r * Math.sin(rad(deg)),
    CY - r * Math.cos(rad(deg)),
  ];
  const f2 = (n) => +n.toFixed(2);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smooth = (a, b, v) => {
    const x = clamp01((v - a) / (b - a));
    return x * x * (3 - 2 * x);
  };
  const glow = (s, hold, fade) =>
    smooth(0, 0.3, s) * (1 - smooth(hold, hold + fade, s));
  const pulse = (s) =>
    s < 0.28 ? smooth(0, 0.28, s) : Math.exp(-(s - 0.28) / 0.85);
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  // ?t=12.5 freezes every engine at that moment (stills); ?capture lets a script render exact frames
  const query = new URLSearchParams(location.search);
  const FROZEN = query.has('t') ? parseFloat(query.get('t')) || 0 : null;
  const CAPTURE = query.has('capture');
  const REDUCED = !!(
    window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const instances = [];
  let uid = 0;

  const esc = (v) =>
    String(v).replace(
      /[&<>"]/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch],
    );

  // texts can be overridden per instance (e.g. translations) with mount(el, { content })
  function resolveContent(c) {
    c = c || {};
    const steps = STEPS.map((s, i) => {
      const o = (c.steps && c.steps[i]) || {};
      return {
        label: o.label || s.label,
        status: o.status || s.status,
        icon: s.icon,
      };
    });
    return {
      steps,
      topLabel: c.topLabel || TOP_LABEL,
      coreLabel: c.coreLabel || CORE_LABEL,
      footer: c.footer || FOOTER,
      rtl: !!c.rtl,
      arrow: c.arrow || (c.rtl ? '←' : '→'),
      ariaTitle:
        c.ariaTitle ||
        `Joocare AI engine. Joocare intelligence feeds an AI cell that works through eight hiring steps: ${steps.map((s) => s.label.join(' ')).join(', ')}, leading from workforce complexity to better hiring decisions.`,
    };
  }

  function template(u, logo, c) {
    const F = c.footer.map(esc),
      A = esc(c.arrow);
    // RTL: one plain string, so the bidi algorithm orders it (dx-spaced tspans collide in RTL)
    const line = c.rtl
      ? F.join(` ${A} `)
      : `${F[0]}<tspan class="jce-arrow" dx="12">${A}</tspan><tspan dx="12">${F[1]}</tspan><tspan class="jce-arrow" dx="12">${A}</tspan><tspan dx="12">${F[2]}</tspan>`;
    const ports = [
      [385, 500],
      [1055, 500],
      [720, 165],
      [720, 835],
    ]
      .map(
        ([x, y]) =>
          `<g transform="translate(${x} ${y})"><circle class="jce-mark-bg" r="9.5"/><circle class="jce-mark-ring" r="6.2" stroke-width="1.6"/><circle class="jce-mark-dot" r="3.4"/></g>`,
      )
      .join('');
    return `<svg class="jce-svg" role="img" aria-labelledby="${u}-title" preserveAspectRatio="xMidYMid meet">
<title id="${u}-title">${esc(c.ariaTitle)}</title>
<defs>
<radialGradient id="${u}-stage" cx="720" cy="500" r="470" gradientUnits="userSpaceOnUse"><stop offset="0" class="jce-s500" stop-opacity=".12"/><stop offset=".6" class="jce-s500" stop-opacity=".035"/><stop offset="1" class="jce-s500" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-core" cx="720" cy="430" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" class="jce-schar"/><stop offset=".7" class="jce-score"/><stop offset="1" class="jce-score-edge"/></radialGradient>
<linearGradient id="${u}-bowl" x1="490" y1="0" x2="950" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" class="jce-s300" stop-opacity="0"/><stop offset=".5" class="jce-s300" stop-opacity=".9"/><stop offset="1" class="jce-s300" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-halo"><stop offset="0" class="jce-s300" stop-opacity=".3"/><stop offset="1" class="jce-s300" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-head"><stop offset="0" class="jce-s100" stop-opacity=".95"/><stop offset=".35" class="jce-s300" stop-opacity=".4"/><stop offset="1" class="jce-s300" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="720" cy="500" r="470" fill="url(#${u}-stage)"/>
<g class="jce-axis">
<line class="jce-rail" data-r="top"/><line class="jce-flow" data-f="top"/>
<line class="jce-rail" data-r="bottom"/><line class="jce-flow" data-f="bottom"/>
<g class="jce-pill">
<rect class="jce-pill-bg" y="-20" height="40" rx="20"/>
<g class="jce-pill-on" opacity="0"><rect class="jce-pill-bg jce-pill-bg--on" y="-20" height="40" rx="20"/></g>
<g class="jce-pill-dot"><circle class="jce-mark-ring" r="5.77" stroke-width="1.46"/><circle class="jce-mark-dot" r="3.2"/></g>
<text class="jce-t jce-pill-text" y="6">${esc(c.topLabel)}</text>
</g>
<text class="jce-t jce-foot jce-foot--line" x="720" text-anchor="middle">${line}</text>
<g class="jce-foot jce-foot--stack">
<text class="jce-t" x="720" y="-72" text-anchor="middle">${F[0]}</text>
<text class="jce-t" x="720" y="-36" text-anchor="middle"><tspan class="jce-arrow">${A} </tspan>${F[1]}</text>
<text class="jce-t" x="720" y="0" text-anchor="middle"><tspan class="jce-arrow">${A} </tspan>${F[2]}</text>
</g>
</g>
<circle class="jce-orbit" cx="720" cy="500" r="331"/>
<circle class="jce-orbit" cx="720" cy="500" r="339"/>
<g class="jce-dial"></g>
<circle cx="720" cy="500" r="230" fill="url(#${u}-core)"/>
<circle class="jce-core-edge" cx="720" cy="500" r="230"/>
<circle class="jce-core-edge jce-core-edge--inner" cx="720" cy="500" r="221"/>
<path d="M490 500A230 230 0 0 0 950 500" fill="none" stroke="url(#${u}-bowl)" stroke-width="10" opacity=".16"/>
<path d="M490 500A230 230 0 0 0 950 500" fill="none" stroke="url(#${u}-bowl)" stroke-width="2"/>
<image href="${logo}" x="620" y="341" width="200" height="45.2"/>
<text class="jce-t jce-core-label" x="723.4" y="426" text-anchor="middle">${esc(c.coreLabel)}</text>
<g class="jce-status-dot"><circle class="jce-mark-ring" r="5.33" stroke-width="1.35"/><circle class="jce-mark-dot" r="2.95"/></g>
<text class="jce-t jce-status" x="726" y="462" text-anchor="middle"></text>
<g class="jce-comet"></g>
${ports}
<g class="jce-nodes"></g>
</svg>
<canvas class="jce-cell" aria-hidden="true"></canvas>`;
  }

  /* ============================ THE AI CELL ===============================
   * A dotted membrane around a nucleus, drawn on canvas. It waves, its shade
   * fades on and off, and each time a step lights up it pulses and sends a
   * double ring of dots across the inner circle.
   * ======================================================================== */
  function createCell(canvas, css, W) {
    const ctx = canvas.getContext('2d');
    const TAU = Math.PI * 2;
    const hex = (v) => {
      v = String(v).trim().replace('#', '');
      return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
    };
    const C5 = hex(css.getPropertyValue('--jce-g500') || '#1FAD36');
    const C3 = hex(css.getPropertyValue('--jce-g300') || '#61D174');
    const C1 = hex(css.getPropertyValue('--jce-g100') || '#CEF3D5');
    const mix = (a, b, k) => [
      (a[0] + (b[0] - a[0]) * k) | 0,
      (a[1] + (b[1] - a[1]) * k) | 0,
      (a[2] + (b[2] - a[2]) * k) | 0,
    ];
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // seeded: a given moment always looks the same
    const sphere = (n) => {
      const p = new Float32Array(n * 5),
        ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (2 * (i + 0.5)) / n,
          r = Math.sqrt(1 - y * y),
          x = Math.cos(ga * i) * r,
          z = Math.sin(ga * i) * r;
        p.set([x, y, z, Math.atan2(z, x), Math.asin(y)], i * 5);
      }
      return p;
    };
    const NM = 900,
      NN = 210;
    const mem = sphere(NM),
      nuc = sphere(NN);
    const ph = Float32Array.from({ length: NM + NN }, () => rnd() * TAU);
    const NB = 16,
      buf = Array.from({ length: NB }, () => new Float32Array((NM + NN) * 3)),
      cnt = new Int32Array(NB);
    const push = (v, x, y, r) => {
      const b = Math.min(NB - 1, (v * NB) | 0),
        n = cnt[b];
      buf[b][n] = x;
      buf[b][n + 1] = y;
      buf[b][n + 2] = r;
      cnt[b] = n + 3;
    };
    const A = 108,
      B = 68,
      TILT = 0.3,
      FOCAL = 700,
      X0 = CORE,
      Y0 = CORE + 96;
    const WAVE = 204; // how far the wave travels: almost to the edge of the inner circle
    const ct = Math.cos(TILT),
      st = Math.sin(TILT);
    const L = (() => {
      const v = [-0.42, 0.62, 0.66],
        m = Math.hypot(...v);
      return v.map((c) => c / m);
    })();
    let S = 1;

    function resize() {
      const r = canvas.getBoundingClientRect(),
        dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      S = canvas.width / (CORE * 2);
    }

    function draw(t, E, s) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(S, 0, 0, S, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      const cx = X0 + 3 * Math.sin(W * t),
        cy = Y0 + 3 * Math.sin(2 * W * t);

      // glow behind the cell
      let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, A * 1.25);
      g.addColorStop(0, rgba(C5, 0.13 + 0.2 * E));
      g.addColorStop(1, rgba(C5, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, A * 1.25, 0, TAU);
      ctx.fill();

      // soft reflection under the cell
      ctx.save();
      ctx.translate(cx, Y0 + 100);
      ctx.scale(1, 0.15);
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, A * 1.25);
      g.addColorStop(0, rgba(C5, 0.22 + 0.18 * E));
      g.addColorStop(1, rgba(C5, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, A * 1.25, 0, TAU);
      ctx.fill();
      ctx.restore();

      // the wave: a double ring of dots on a soft band of light, sent out on every step
      const p = s / 2.4;
      if (p > 0 && p < 1) {
        const e = 1 - Math.pow(1 - p, 2.4),
          fade = Math.pow(1 - p, 1.4),
          ry = st * 1.05;
        const R0 = A + (WAVE - A) * e;
        ctx.strokeStyle = rgba(C3, 0.1 * fade);
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R0 - 9, (R0 - 9) * ry, 0, 0, TAU);
        ctx.stroke();
        for (const [lag, k] of [
          [0, 1],
          [18, 0.5],
        ]) {
          const R = R0 - lag;
          if (R < A) continue;
          const n = Math.round(R * 0.95);
          for (const front of [false, true]) {
            ctx.fillStyle = rgba(
              front ? C1 : C3,
              fade * k * (front ? 0.85 : 0.32),
            );
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
              const a = (i / n) * TAU + W * t,
                sa = Math.sin(a);
              if (sa > 0 !== front) continue;
              const x = cx + R * Math.cos(a),
                y = cy + R * ry * sa,
                r = front ? 1.25 : 0.85;
              ctx.moveTo(x + r, y);
              ctx.arc(x, y, r, 0, TAU);
            }
            ctx.fill();
          }
        }
      }

      cnt.fill(0);
      const G = 0.64 + 0.36 * E + 0.05 * Math.sin(3 * W * t);
      const rot = W * t,
        cr = Math.cos(rot),
        sr = Math.sin(rot);
      const scanC = -1.8 + 3.6 * (s / 1.3),
        scanA = s < 1.5 ? 1 - s / 1.5 : 0;

      // membrane: waves glide around it, a light band scans upward on each pulse
      for (let i = 0; i < NM; i++) {
        const o = i * 5,
          ux = mem[o],
          uy = mem[o + 1],
          uz = mem[o + 2],
          lon = mem[o + 3],
          lat = mem[o + 4];
        const d =
          1 +
          0.085 * Math.sin(3 * lon - 4 * W * t) * Math.cos(lat) +
          0.05 * Math.sin(4 * lat + 5 * W * t) +
          0.03 * E;
        const rx = ux * cr - uz * sr,
          rz = ux * sr + uz * cr;
        const X = A * d * rx,
          Y = B * d * uy,
          Z = A * d * rz;
        const Y2 = Y * ct - Z * st,
          Z2 = Y * st + Z * ct,
          k = FOCAL / (FOCAL - Z2);
        const ny = uy * ct - rz * st,
          nz = uy * st + rz * ct;
        const lit = Math.max(0, rx * L[0] + ny * L[1] + nz * L[2]);
        const depth = nz * 0.5 + 0.5;
        const band = scanA * Math.exp(-(((lat - scanC) / 0.2) ** 2));
        const bounce = Math.max(0, -ny) * (0.5 + 0.5 * depth); // green light reflected up from the floor glow
        const v =
          (0.07 + 0.5 * lit + 0.24 * depth + 0.26 * bounce) *
            G *
            (0.86 + 0.14 * Math.sin(4 * W * t + ph[i])) +
          0.8 * band;
        push(
          v > 1 ? 1 : v,
          cx + X * k,
          cy - Y2 * k,
          (0.7 + 0.85 * depth) * k * (1 + 0.6 * band),
        );
      }

      // nucleus: turns the other way and brightens with every pulse
      const rn = A * 0.34,
        r2 = -W * t,
        c2 = Math.cos(r2),
        s2 = Math.sin(r2);
      for (let j = 0; j < NN; j++) {
        const o = j * 5,
          ux = nuc[o],
          uy = nuc[o + 1],
          uz = nuc[o + 2],
          lon = nuc[o + 3],
          lat = nuc[o + 4];
        const d = 1 + 0.12 * Math.sin(2 * lon + 3 * lat + 4 * W * t) + 0.2 * E;
        const rx = ux * c2 - uz * s2,
          rz = ux * s2 + uz * c2;
        const X = rn * d * rx,
          Y = rn * d * uy,
          Z = rn * d * rz;
        const Y2 = Y * ct - Z * st,
          Z2 = Y * st + Z * ct,
          k = FOCAL / (FOCAL - Z2);
        const ny = uy * ct - rz * st,
          nz = uy * st + rz * ct;
        const lit = Math.max(0, rx * L[0] + ny * L[1] + nz * L[2]);
        const depth = nz * 0.5 + 0.5;
        const v =
          (0.2 + 0.45 * lit + 0.2 * depth) *
          (0.5 + 0.8 * E) *
          (0.8 + 0.2 * Math.sin(7 * W * t + ph[NM + j]));
        push(v > 1 ? 1 : v, cx + X * k, cy - Y2 * k, (0.65 + 0.55 * depth) * k);
      }

      g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rn * 1.7);
      g.addColorStop(0, rgba(C1, 0.08 + 0.26 * E));
      g.addColorStop(0.45, rgba(C3, 0.05 + 0.1 * E));
      g.addColorStop(1, rgba(C3, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rn * 1.7, 0, TAU);
      ctx.fill();

      // dots, drawn in brightness buckets (one fill per bucket keeps it light)
      for (let b = 0; b < NB; b++) {
        const n = cnt[b];
        if (!n) continue;
        const v = (b + 0.5) / NB,
          arr = buf[b],
          col = mix(C5, C1, Math.pow(v, 1.7));
        if (v > 0.55) {
          ctx.fillStyle = rgba(col, 0.03 + (0.08 * (v - 0.55)) / 0.45);
          ctx.beginPath();
          for (let j = 0; j < n; j += 3) {
            const r = arr[j + 2] * 2.6;
            ctx.moveTo(arr[j] + r, arr[j + 1]);
            ctx.arc(arr[j], arr[j + 1], r, 0, TAU);
          }
          ctx.fill();
        }
        ctx.fillStyle = rgba(col, 0.1 + 0.9 * v);
        ctx.beginPath();
        for (let j = 0; j < n; j += 3) {
          const r = arr[j + 2];
          ctx.moveTo(arr[j] + r, arr[j + 1]);
          ctx.arc(arr[j], arr[j + 1], r, 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    return { draw, resize };
  }

  /* ================================ MOUNT ================================= */
  function mount(root, options) {
    if (!root) return null;
    if (root.__jce) return root.__jce;
    const opts = options || {};
    const u = 'jce' + ++uid;
    const logo =
      opts.logo || root.getAttribute('data-logo') || 'joocare-logo-on-dark.png';
    root.classList.add('jce');
    root.classList.toggle('jce--rtl', !!(opts.content && opts.content.rtl));
    const content = resolveContent(opts.content);
    root.innerHTML = template(u, logo, content);
    const q = (s) => root.querySelector(s);
    const svg = q('.jce-svg'),
      canvas = q('.jce-cell');
    const css = getComputedStyle(root);
    const LOOP =
      parseFloat(
        opts.loop ||
          root.getAttribute('data-loop') ||
          css.getPropertyValue('--jce-loop'),
      ) || 20;
    const STEP_T = LOOP / 8;
    const W = (Math.PI * 2) / LOOP; // every motion repeats exactly once per loop
    const START = 22.5 - 16; // the spark starts just before step 1
    const head = (t) => (((START + (360 * t) / LOOP) % 360) + 360) % 360;
    const since = (t, deg) =>
      (((((head(t) - deg) % 360) + 360) % 360) / 360) * LOOP; // seconds since the spark passed deg

    // precision scale
    const dial = q('.jce-dial');
    for (let i = 0; i < 180; i++) {
      const major = i % 15 === 0;
      const [x1, y1] = polar(i * 2, major ? 256 : 262);
      const [x2, y2] = polar(i * 2, major ? 272 : 266);
      el(
        'line',
        {
          x1: f2(x1),
          y1: f2(y1),
          x2: f2(x2),
          y2: f2(y2),
          class: major ? 'jce-major' : '',
        },
        dial,
      );
    }

    // the spark: a fading tail behind a bright head
    const comet = q('.jce-comet');
    const SEG = 18,
      SPAN = 2.4;
    for (let i = 0; i < SEG; i++) {
      const [x0, y0] = polar(-(i + 1) * SPAN - 0.2, ORBIT),
        [x1, y1] = polar(-i * SPAN, ORBIT);
      el(
        'path',
        {
          class: 'jce-tail',
          d: `M${f2(x0)} ${f2(y0)}A${ORBIT} ${ORBIT} 0 0 1 ${f2(x1)} ${f2(y1)}`,
          opacity: f2(Math.pow(1 - i / SEG, 1.8) * 0.95),
        },
        comet,
      );
    }
    el(
      'circle',
      { cx: CX, cy: CY - ORBIT, r: 22, fill: `url(#${u}-head)` },
      comet,
    );
    el(
      'circle',
      { class: 'jce-head-ring', cx: CX, cy: CY - ORBIT, r: 6.2 },
      comet,
    );
    el('circle', { class: 'jce-head', cx: CX, cy: CY - ORBIT, r: 3.4 }, comet);

    // the 8 step circles: a resting layer plus a lit layer that fades in as the spark passes
    const nodeLayer = q('.jce-nodes');
    const nodes = content.steps.map((s, i) => {
      const a = 22.5 + 45 * i;
      const [x, y] = polar(a, ORBIT);
      const ux = Math.sin(rad(a)),
        uy = -Math.cos(rad(a));
      const g = el(
        'g',
        { transform: `translate(${f2(x)} ${f2(y)})` },
        nodeLayer,
      );
      // labels of the top and bottom circles move a little away from the ring, so the spark never crosses them
      const dy = Math.abs(uy) > 0.9 ? 12 * Math.sign(uy) : 0;
      const spoke = {
        x1: f2(-56 * ux),
        y1: f2(-56 * uy),
        x2: f2(-38 * ux),
        y2: f2(-38 * uy),
      };
      const texts = [];
      const layer = (on) => {
        const p = on ? el('g', { opacity: 0 }, g) : g;
        if (on) el('circle', { r: 52, fill: `url(#${u}-halo)` }, p);
        el(
          'line',
          Object.assign(
            { class: on ? 'jce-spoke jce-spoke--on' : 'jce-spoke' },
            spoke,
          ),
          p,
        );
        el(
          'circle',
          {
            class: on ? 'jce-ring-outer jce-ring-outer--on' : 'jce-ring-outer',
            r: 33,
          },
          p,
        ); // double circle, like the logo mark
        el(
          'circle',
          { class: on ? 'jce-ring jce-ring--on' : 'jce-ring', r: 25.5 },
          p,
        );
        el(
          'path',
          {
            class: on ? 'jce-icon jce-icon--on' : 'jce-icon',
            d: ICONS[s.icon] || '',
            transform: 'translate(-12 -12)',
          },
          p,
        );
        const text = el(
          'text',
          {
            class: on ? 'jce-t jce-label jce-label--on' : 'jce-t jce-label',
            'text-anchor': 'middle',
          },
          p,
        );
        el('tspan', { class: 'jce-num', x: 0, y: -24 + dy }, text).textContent =
          String(i + 1).padStart(2, '0');
        el('tspan', { class: 'jce-l1', x: 0, y: 3 + dy }, text).textContent =
          s.label[0];
        el('tspan', { class: 'jce-l2', x: 0, y: 27 + dy }, text).textContent =
          s.label[1];
        texts.push(text);
        return p;
      };
      layer(false);
      return {
        a,
        x,
        side: x < CX - 1 ? -1 : 1,
        on: layer(true),
        texts,
        last: -1,
      };
    });

    const statusEl = q('.jce-status'),
      statusDot = q('.jce-status-dot');
    const pill = q('.jce-pill'),
      pillOn = q('.jce-pill-on'),
      pillText = q('.jce-pill-text');
    const rails = { top: q('[data-r="top"]'), bottom: q('[data-r="bottom"]') };
    const flows = { top: q('[data-f="top"]'), bottom: q('[data-f="bottom"]') };
    const footLine = q('.jce-foot--line'),
      footStack = q('.jce-foot--stack');
    const cell = createCell(canvas, css, W);
    const state = { compact: null, labelHalf: 0, statusIdx: -1, pillH: 40 };

    // labels: centred lines, each block a fixed gap beside its circle; the widest one sets the viewBox width
    function placeLabels() {
      let half = 0;
      nodes.forEach((n) => {
        const w = Math.max(
          ...Array.from(n.texts[0].children, (t) => t.getComputedTextLength()),
        );
        const off = f2(n.side * (50 + w / 2));
        n.texts.forEach((t) =>
          Array.from(t.children).forEach((sp) => sp.setAttribute('x', off)),
        );
        half = Math.max(half, Math.abs(n.x - CX) + 50 + w);
      });
      state.labelHalf = half + 16;
    }

    function fitPill() {
      const h = state.compact ? 58 : 44,
        k = h / 40;
      state.pillH = h;
      const w = Math.round(pillText.getComputedTextLength() + h * 1.55),
        x = CX - w / 2;
      pill.querySelectorAll('rect').forEach((r) => {
        r.setAttribute('x', f2(x));
        r.setAttribute('width', w);
        r.setAttribute('y', -h / 2);
        r.setAttribute('height', h);
        r.setAttribute('rx', h / 2);
      });
      // the dot leads the text: on its left in LTR, on its right in RTL
      const rtl = content.rtl;
      pill
        .querySelector('.jce-pill-dot')
        .setAttribute(
          'transform',
          `translate(${f2(rtl ? x + w - 24 * k : x + 24 * k)} 0) scale(${f2(k)})`,
        );
      pillText.setAttribute('x', f2(rtl ? x + w - 38 * k : x + 38 * k));
      pillText.setAttribute('text-anchor', rtl ? 'end' : 'start');
      pillText.setAttribute('y', f2(h * 0.15));
    }

    function setLine(key, y1, y2) {
      [rails[key], flows[key]].forEach((l) => {
        l.setAttribute('x1', CX);
        l.setAttribute('x2', CX);
        l.setAttribute('y1', f2(y1));
        l.setAttribute('y2', f2(Math.max(y1, y2)));
      });
    }

    // sizing: the ring keeps its proportions, the top and bottom dotted lines stretch to fill the box height
    function layout() {
      const w = root.clientWidth;
      if (!w) return;
      const compact = w < COMPACT_BELOW;
      if (compact !== state.compact) {
        state.compact = compact;
        root.classList.toggle('jce--compact', compact);
        fitPill();
        if (!compact) placeLabels();
        state.statusIdx = -1;
      }
      const half = compact ? 395 : Math.max(395, state.labelHalf);
      const vbx = CX - half,
        vbw = half * 2,
        s = w / vbw;
      const footH = compact ? 118 : 34;
      const minTop = BLOCK_TOP - MIN_LINE - state.pillH - 4;
      const minVbh = BLOCK_BOTTOM + MIN_LINE + footH - minTop;
      const minPx = Math.ceil(minVbh * s);
      if (Math.abs((parseFloat(root.style.minHeight) || 0) - minPx) > 0.5)
        root.style.minHeight = minPx + 'px';
      const h = Math.max(root.clientHeight, minPx);
      const vbh = Math.max(minVbh, h / s);
      const vby = minTop - (vbh - minVbh) / 2;

      // the pill sits at the top; its centre is 13px down so it lines up with 26px tags beside it
      const pillCY = vby + Math.max(state.pillH / 2 + 2, compact ? 0 : 13 / s);
      pill.setAttribute('transform', `translate(0 ${f2(pillCY)})`);
      const footBase = vby + vbh - (compact ? 14 : 10);
      footLine.setAttribute('y', f2(footBase));
      footStack.setAttribute('transform', `translate(0 ${f2(footBase)})`);
      setLine('top', pillCY + state.pillH / 2, CY - ORBIT - 9.5);
      setLine('bottom', CY + ORBIT + 9.5, footBase - (compact ? 112 : 26));

      svg.setAttribute(
        'viewBox',
        `${f2(vbx)} ${f2(vby)} ${f2(vbw)} ${f2(vbh)}`,
      );
      const cs = canvas.style;
      cs.left = ((CX - CORE - vbx) / vbw) * 100 + '%';
      cs.top = ((CY - CORE - vby) / vbh) * 100 + '%';
      cs.width = ((CORE * 2) / vbw) * 100 + '%';
      cs.height = ((CORE * 2) / vbh) * 100 + '%';
      cell.resize();
    }

    function setStatus(i) {
      state.statusIdx = i;
      statusEl.textContent = content.steps[i].status;
      const k = state.compact ? 1.7 : 1.25;
      const half = statusEl.getComputedTextLength() / 2 + 11 * k;
      statusDot.setAttribute(
        'transform',
        `translate(${f2(content.rtl ? 726 + half : 726 - half)} ${state.compact ? 452 : 455}) scale(${k})`,
      );
    }

    // everything on screen is a pure function of t: the loop is seamless and any moment can be rendered
    function renderAt(t) {
      comet.setAttribute('transform', `rotate(${f2(head(t))} ${CX} ${CY})`);
      dial.setAttribute(
        'transform',
        `rotate(${f2((t * 30) / LOOP)} ${CX} ${CY})`,
      );
      let best = Infinity,
        bi = 0;
      for (let i = 0; i < nodes.length; i++) {
        const s = since(t, nodes[i].a);
        if (s < best) {
          best = s;
          bi = i;
        }
        const o = f2(glow(s, 1.5, 1.0));
        if (o !== nodes[i].last) {
          nodes[i].last = o;
          nodes[i].on.setAttribute('opacity', o);
        }
      }
      if (bi !== state.statusIdx) setStatus(bi);
      statusEl.setAttribute(
        'opacity',
        f2(clamp01(Math.min(best / 0.35, (STEP_T - best) / 0.3))),
      );
      statusDot.setAttribute(
        'opacity',
        f2(0.35 + 0.65 * (0.5 + 0.5 * Math.cos(13 * W * t))),
      );
      pillOn.setAttribute('opacity', f2(glow(since(t, 0), 1.6, 1.2))); // lights as the spark passes the top
      const dash = f2(-((t * 28 * 12) / LOOP) % 28);
      flows.top.style.strokeDashoffset = dash;
      flows.bottom.style.strokeDashoffset = dash;
      cell.draw(t, pulse(best), best);
    }

    const still = FROZEN !== null ? FROZEN : REDUCED ? 1.3 : null;
    let raf = 0,
      t0 = 0,
      hiddenAt = 0,
      visible = true;
    const onResize = () => {
      layout();
      if (still !== null || CAPTURE) renderAt(still !== null ? still : 0);
    };
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver((e) => {
            visible = e[0].isIntersecting;
          })
        : null;
    const onVisibility = () => {
      if (document.hidden) hiddenAt = performance.now();
      else t0 += performance.now() - hiddenAt;
    };

    function boot() {
      if (!root.__jce) return; // destroyed before fonts were ready
      layout();
      if (ro) ro.observe(root);
      else window.addEventListener('resize', onResize);
      if (io) io.observe(root);
      if (CAPTURE) {
        renderAt(0);
        window.__render = (t) => instances.forEach((x) => x.renderAt(t));
        return;
      }
      if (still !== null) {
        renderAt(still);
        return;
      }
      t0 = performance.now();
      document.addEventListener('visibilitychange', onVisibility);
      const tick = (now) => {
        if (visible && !document.hidden) renderAt((now - t0) / 1000); // pauses off screen and in background tabs
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    function destroy() {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', onResize);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      const k = instances.indexOf(inst);
      if (k >= 0) instances.splice(k, 1);
      delete root.__jce;
      root.classList.remove('jce', 'jce--compact', 'jce--rtl');
      root.style.minHeight = '';
      root.innerHTML = '';
    }

    const inst = { element: root, renderAt, layout, destroy };
    root.__jce = inst;
    instances.push(inst);
    (document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve()
    ).then(boot);
    return inst;
  }

  function mountAll() {
    document.querySelectorAll('[data-joocare-engine]').forEach((n) => mount(n));
  }

  window.JoocareEngine = { mount, mountAll, instances, version: '1.0.0' };
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
})();

// imported as a side-effect module (it sets window.JoocareEngine)
export {};
