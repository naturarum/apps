/* vignette.js: the living background.
   One fixed canvas (#vignette) behind the page. On the hub it idles on a slow
   titanium aurora and crossfades to an app's scene when its index row
   (data-vignette) is hovered. On an app page, set data-scene on the canvas and
   that scene runs alone. Pointer movement and clicks play the active scene.
   Honors prefers-reduced-motion (the canvas stays empty; the CSS wash remains). */
(function () {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('vignette');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var light = matchMedia('(prefers-color-scheme: light)').matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W, H;
    function size() {
        W = innerWidth; H = innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); addEventListener('resize', size);

    var px = -1e4, py = -1e4;
    addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; }, { passive: true });
    addEventListener('pointerleave', function () { px = py = -1e4; });

    var drops = [], presses = [], twinkles = [], lastDrip = 0, lastTwinkle = 0, tags = [];
    for (var i = 0; i < 12; i++) tags.push({ x: Math.random(), y: Math.random(), s: Math.random() * 6.3 });
    addEventListener('pointerdown', function (e) {
        if (active === 'pond') { drops.push({ x: e.clientX, y: e.clientY, t0: performance.now(), big: true }); if (drops.length > 18) drops.shift(); }
        if (active === 'hexatone') { presses.push({ x: e.clientX, y: e.clientY, t0: performance.now() }); if (presses.length > 8) presses.shift(); }
    }, { passive: true });

    var SCENES = {
        titanium: function (t, a) {
            var cx = W * 0.72, cy = H * 0.2;
            for (var i = 3; i >= 1; i--) {
                var r = Math.min(W, H) * (0.12 * i) * (1 + 0.08 * Math.sin(t * 0.00025 + i));
                var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                g.addColorStop(0, ['rgba(47,122,208,0.10)', 'rgba(136,120,180,0.07)', 'rgba(198,154,99,0.05)'][i - 1]);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalAlpha = a * (light ? 0.8 : 1);
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
            }
        },
        anima: function (t, a) {
            /* Anima's eye (the Level glyph, and the app icon): a horizontal
               almond that breathes open, blinks every few seconds, and whose
               dark iris drifts to follow the pointer. */
            var cx = W / 2, cy = H * 0.5, S = Math.min(W, H) * 0.42;
            var near = Math.max(0, 1 - Math.hypot(px - cx, py - cy) / (Math.min(W, H) * 0.7));
            var breath = 0.5 + 0.5 * Math.sin(t * 0.0005);
            var ph = t % 6500;                                   /* slow blink cycle */
            var blink = ph < 240 ? Math.max(0.06, Math.abs(1 - ph / 120)) : 1;
            var h = S * (0.34 + breath * 0.07 + near * 0.09) * blink;
            /* gaze: the iris looks toward the pointer */
            var gx = 0, gy = 0;
            if (px > -9999) {
                gx = Math.max(-1, Math.min(1, (px - cx) / (W * 0.5))) * S * 0.11;
                gy = Math.max(-1, Math.min(1, (py - cy) / (H * 0.5))) * S * 0.05;
            }
            function lid(sign) {
                ctx.beginPath();
                ctx.moveTo(cx - S, cy);
                ctx.quadraticCurveTo(cx, cy + sign * h * 2, cx + S, cy);
            }
            /* almond field */
            ctx.fillStyle = '#d3bf94';
            ctx.globalAlpha = a * (0.07 + near * 0.04) * (light ? 0.9 : 1);
            ctx.beginPath();
            ctx.moveTo(cx - S, cy); ctx.quadraticCurveTo(cx, cy - h * 2, cx + S, cy);
            ctx.quadraticCurveTo(cx, cy + h * 2, cx - S, cy); ctx.closePath(); ctx.fill();
            /* lids */
            ctx.strokeStyle = '#8a7fb8'; ctx.lineWidth = 1.6;
            ctx.globalAlpha = a * (0.18 + near * 0.08);
            lid(-1); ctx.stroke(); lid(1); ctx.stroke();
            /* dark iris (like the glyph's punched hole), hidden while blinking */
            var pr = S * 0.13, ix = cx + gx, iy = cy + gy;
            var irisR = pr * (1.45 + breath * 0.12 + near * 0.1);
            ctx.globalAlpha = a * (0.5 + near * 0.25) * blink;
            ctx.fillStyle = light ? '#2b2620' : '#0a0908';
            ctx.beginPath(); ctx.arc(ix, iy, irisR, 0, 7); ctx.fill();
            ctx.strokeStyle = '#8fa6c4'; ctx.globalAlpha = a * (0.2 + near * 0.1) * blink; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(ix, iy, irisR, 0, 7); ctx.stroke();
            /* warm glint at the center of the dark */
            var g = ctx.createRadialGradient(ix, iy, 0, ix, iy, pr * 0.55);
            g.addColorStop(0, 'rgba(255,250,235,' + (0.55 + near * 0.3) * a * blink + ')'); g.addColorStop(1, 'rgba(214,154,86,0)');
            ctx.globalAlpha = 1; ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(ix, iy, pr * 0.55, 0, 7); ctx.fill();
        },
        hexatone: function (t, a) {
            /* Key light, not ripples: the pointer is a spotlight sweeping the
               lattice, single keys twinkle like played notes, and a click
               presses a chord shape (the same interval pattern anywhere:
               that's the isomorphic point). */
            var R = 26, hs = R * 1.732, cols = ['#ffbd82', '#ffa9c9', '#cfa9ff', '#8cb8ff', '#9ee6e6'];
            if (t - lastTwinkle > 640) {
                lastTwinkle = t;
                twinkles.push({ x: Math.random() * W, y: Math.random() * H, t0: t });
                if (twinkles.length > 10) twinkles.shift();
            }
            /* active "pressed key" points: each press lights a chord shape */
            var lights = [];
            presses.forEach(function (p) {
                var age = (t - p.t0) / 1600;
                if (age > 1) return;
                var env = age < 0.1 ? age / 0.1 : 1 - (age - 0.1) / 0.9;
                [[0, 0], [hs * 2, 0], [hs, -R * 3]].forEach(function (o) {   /* a triad shape */
                    lights.push({ x: p.x + o[0], y: p.y + o[1], e: env });
                });
            });
            twinkles.forEach(function (w) {
                var age = (t - w.t0) / 1000;
                if (age > 1) return;
                lights.push({ x: w.x, y: w.y, e: Math.sin(age * Math.PI) * 0.55 });
            });
            for (var row = 0; row * R * 1.5 < H + R; row++) {
                for (var col = 0; col * hs < W + hs; col++) {
                    var cx = col * hs + (row % 2 ? hs / 2 : 0), cy = row * R * 1.5;
                    /* tight spotlight under the pointer */
                    var lit = Math.pow(Math.max(0, 1 - Math.hypot(px - cx, py - cy) / 150), 1.4);
                    for (var li = 0; li < lights.length; li++) {
                        if (Math.hypot(lights[li].x - cx, lights[li].y - cy) < R) lit = Math.max(lit, lights[li].e);
                    }
                    if (lit < 0.02) continue;
                    ctx.beginPath();
                    for (var k = 0; k < 6; k++) { var an = Math.PI / 180 * (60 * k - 30); ctx[k ? 'lineTo' : 'moveTo'](cx + (R - 3) * Math.cos(an), cy + (R - 3) * Math.sin(an)); }
                    ctx.closePath();
                    ctx.fillStyle = cols[(row + col) % 5]; ctx.globalAlpha = a * lit * (light ? 0.45 : 0.36); ctx.fill();
                }
            }
        },
        pond: function (t, a) {
            var M = Math.min(W, H);
            if (t - lastDrip > 2100) { lastDrip = t; drops.push({ x: W * (0.15 + 0.7 * Math.random()), y: H * (0.15 + 0.7 * Math.random()), t0: t, big: false }); if (drops.length > 18) drops.shift(); }
            drops.forEach(function (d) {
                var age = (t - d.t0) / (d.big ? 3400 : 4200);
                if (age > 1) return;
                for (var k = 0; k < 3; k++) {
                    var r = age * M * (d.big ? 0.62 : 0.45) - k * 26; if (r < 1) continue;
                    ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, 7);
                    ctx.strokeStyle = k === 1 ? '#8fc4f2' : '#9ee6e6';
                    ctx.globalAlpha = a * Math.max(0, (1 - age) * (0.62 - k * 0.14));
                    ctx.lineWidth = d.big ? 3.2 : 2.3; ctx.stroke();
                }
            });
        },
        datum: function (t, a) {
            var cols = 4, tw = 76, th = 32;
            tags.forEach(function (g, i) {
                var gx = W / 2 + ((i % cols) - (cols - 1) / 2) * (tw + 22);
                var gy = H * 0.46 + (Math.floor(i / cols) - 1) * (th + 22);
                var X = g.x * W, Y = g.y * H;
                var near = Math.max(0, 1 - Math.hypot(px - X, py - Y) / 300);
                var hx = X + Math.sin(t * 0.00035 + g.s) * 26 * (1 - near), hy = Y + Math.cos(t * 0.00028 + g.s) * 20 * (1 - near);
                var tx = near * gx + (1 - near) * hx, ty = near * gy + (1 - near) * hy;
                ctx.globalAlpha = a * (0.16 + near * 0.3);
                ctx.strokeStyle = near > 0.5 ? '#7d7bf0' : (light ? '#8a877e' : '#565b6e');
                ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(tx - tw / 2 + 8, ty - th / 2);
                ctx.arcTo(tx + tw / 2, ty - th / 2, tx + tw / 2, ty + th / 2, 8);
                ctx.arcTo(tx + tw / 2, ty + th / 2, tx - tw / 2, ty + th / 2, 8);
                ctx.arcTo(tx - tw / 2, ty + th / 2, tx - tw / 2, ty - th / 2, 8);
                ctx.arcTo(tx - tw / 2, ty - th / 2, tx + tw / 2, ty - th / 2, 8);
                ctx.closePath(); ctx.stroke();
                ctx.beginPath(); ctx.arc(tx - tw / 2 + 11, ty, 3, 0, 7); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
            });
        },
        tape: function (t, a) {
            var cy = H * 0.42, r1 = Math.min(W, H) * 0.1, x1 = W * 0.34, x2 = W * 0.66, ang = t * 0.0011;
            var wob = Math.max(0, 1 - Math.abs(py - cy) / (H * 0.5));
            for (var e = 2; e >= 0; e--) {
                ctx.globalAlpha = a * (e ? 0.12 * (3 - e) : 0.6);
                ctx.strokeStyle = '#ffbd82'; ctx.fillStyle = '#e8a85f'; ctx.lineWidth = e ? 1.2 : 2;
                var off = e * 10;
                ctx.beginPath();
                for (var x = x1; x <= x2; x += 6) {
                    var k = (x - x1) / (x2 - x1);
                    var y = cy + r1 + 14 + off + Math.sin(t * 0.004 + x * 0.045 - e * 0.9) * (2 + wob * 12) * Math.sin(k * Math.PI);
                    x === x1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                if (!e) {
                    /* both reels turn the same way: the tape pulls them together */
                    [[x1, r1, ang], [x2, r1 * 0.94, ang * 1.18]].forEach(function (rl) {
                        ctx.beginPath(); ctx.arc(rl[0], cy, rl[1], 0, 7); ctx.stroke();
                        for (var k2 = 0; k2 < 3; k2++) {
                            var an2 = rl[2] + k2 * Math.PI * 2 / 3;
                            ctx.beginPath(); ctx.moveTo(rl[0] + Math.cos(an2) * rl[1] * 0.25, cy + Math.sin(an2) * rl[1] * 0.25);
                            ctx.lineTo(rl[0] + Math.cos(an2) * rl[1] * 0.82, cy + Math.sin(an2) * rl[1] * 0.82); ctx.stroke();
                        }
                        ctx.beginPath(); ctx.arc(rl[0], cy, rl[1] * 0.16, 0, 7); ctx.fill();
                    });
                }
            }
        }
    };

    var fixed = canvas.dataset.scene || null;
    var active = fixed || 'titanium', prev = null, fadeT0 = 0;
    if (!fixed) {
        document.querySelectorAll('[data-vignette]').forEach(function (row) {
            row.addEventListener('pointerenter', function () {
                if (active === row.dataset.vignette) return;
                prev = active; active = row.dataset.vignette; fadeT0 = performance.now();
            });
        });
    }

    function frame(t) {
        ctx.clearRect(0, 0, W, H);
        var f = Math.min(1, (t - fadeT0) / 450);
        if (prev && f < 1) SCENES[prev](t, 1 - f);
        (SCENES[active] || SCENES.titanium)(t, f);
        ctx.globalAlpha = 1;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();
