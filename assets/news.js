/* ============================================================================
   news.js — renders the shared news feed (apps/news/news.json).
   Drop a <div class="news-feed"></div> on any page:
     • no data-news-app  → the merged feed across all apps (the hub)
     • data-news-app="pond" → only that app's posts (an app page)
     • data-news-limit="6"  → cap the number shown
   Post once in news.json; it appears wherever a feed mount matches. No build step.
   ========================================================================== */
(function () {
    var script = document.currentScript;
    var FEED = new URL('../news/news.json', script.src).href;   // apps/news/news.json
    var SITE = new URL('../', script.src).href;                  // apps/  (for resolving internal links)

    // App metadata for the hub feed (label + colour dot + page link).
    var APPS = {
        hexatone:    { name: 'Hexatone',  accent: '#ffa9c9', href: 'hexatone/' },
        pond:        { name: 'Pond',      accent: '#9ee6e6', href: 'pond/' },
        anima:       { name: 'Anima',     accent: '#cfa9ff', href: 'anima/' },
        're-deemer': { name: 'Re-deemer', accent: '#ffbd82', href: 're-deemer/' }
    };

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function resolve(href) { return /^(https?:|mailto:|#)/.test(href) ? href : new URL(href, SITE).href; }
    function ext(href) { return /^https?:/.test(href); }

    function inline(s) {
        return s
            .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, u) {
                return '<a href="' + resolve(u) + '"' + (ext(u) ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
            })
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    }
    function body(src) {
        return esc(src || '').split(/\n{2,}/).map(function (block) {
            var lines = block.split('\n');
            if (lines.length && lines.every(function (l) { return /^\s*-\s+/.test(l); })) {
                return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*-\s+/, '')) + '</li>'; }).join('') + '</ul>';
            }
            return '<p>' + inline(block.replace(/\n/g, '<br>')) + '</p>';
        }).join('');
    }
    function fmtDate(iso) {
        var d = new Date(iso + 'T00:00:00');
        if (isNaN(d)) return esc(iso);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function itemHTML(p, showApp) {
        var meta = ['<time>' + fmtDate(p.date) + '</time>'];
        if (showApp && p.app && APPS[p.app]) {
            var a = APPS[p.app];
            meta.push('<a class="news-app" href="' + resolve(a.href) + '"><span class="news-dot" style="background:' + a.accent + '"></span>' + esc(a.name) + '</a>');
        }
        if (p.tag) meta.push('<span class="news-tag">' + esc(p.tag) + '</span>');
        var html = '<article class="news-item">'
            + '<div class="news-meta">' + meta.join('') + '</div>'
            + '<h3 class="news-title">' + esc(p.title) + '</h3>';
        if (p.body) html += '<div class="news-body">' + body(p.body) + '</div>';
        if (p.link && p.link.href) {
            html += '<a class="news-link" href="' + resolve(p.link.href) + '"' + (ext(p.link.href) ? ' target="_blank" rel="noopener"' : '') + '>'
                + esc(p.link.label || 'Read more') + ' ' + (ext(p.link.href) ? '&#8599;' : '&rarr;') + '</a>';
        }
        return html + '</article>';
    }

    var mounts = document.querySelectorAll('.news-feed');
    if (!mounts.length) return;

    fetch(FEED).then(function (r) { return r.json(); }).then(function (posts) {
        posts.sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
        mounts.forEach(function (mount) {
            var app = mount.getAttribute('data-news-app') || '';
            var limit = parseInt(mount.getAttribute('data-news-limit') || '0', 10);
            var items = posts.filter(function (p) { return !app || p.app === app; });
            if (limit > 0) items = items.slice(0, limit);
            if (!items.length) { var s = mount.closest('section'); if (s) s.style.display = 'none'; return; }
            mount.className = 'news-feed news-list';
            mount.innerHTML = items.map(function (p) { return itemHTML(p, !app); }).join('');
        });
    }).catch(function () {
        mounts.forEach(function (mount) { var s = mount.closest('section'); if (s) s.style.display = 'none'; });
    });
})();
