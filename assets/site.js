/* Shared behaviour for the hub and app pages: scroll-reveal + current year. */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var yr = document.getElementById('current-year');
        if (yr) yr.textContent = new Date().getFullYear();

        var reveals = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || !reveals.length) {
            reveals.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
        reveals.forEach(function (el) { obs.observe(el); });
    });
})();
