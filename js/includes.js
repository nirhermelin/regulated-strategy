/* =========================================================
   Nir Hermelin — includes.js
   Single source of truth for the site header (nav) and footer.
   Edit the menu or footer HERE, once. Every page updates.

   How it works: each page has an empty <header data-site-header>
   and <footer data-site-footer>. This script fills them in, sets
   the "current page" highlight automatically from the URL, then
   fires a "site:includes-ready" event so main.js can wire up the
   menu toggle AFTER the markup exists.

   This file must load BEFORE main.js.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- The menu (edit links here, once) ---------- */
  var HEADER_HTML =
    '<div class="nav-inner">' +
      '<a href="index.html" class="logo logo-lockup" aria-label="Nir Hermelin — Regulated Strategy — home"><img src="images/rs-logo.png" alt="" class="logo-badge" width="30" height="39"><span class="logo-words"><span class="logo-name">Nir Hermelin<em>.</em></span><span class="logo-brand">Regulated Strategy</span></span></a>' +
      '<button class="nav-toggle" aria-expanded="false" aria-label="Open menu" aria-controls="navLinks">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<ul class="nav-links" id="navLinks">' +
        '<li><a href="index.html" data-match="index.html">Home</a></li>' +
        '<li><a href="about.html" data-match="about.html">About</a></li>' +
        '<li><a href="regulated-strategy.html" data-match="regulated-strategy.html">Regulated Strategy</a></li>' +
        '<li class="has-sub" data-sub-match="work-with-me.html,clinic.html,session.html,lab.html,advisory.html">' +
          '<button class="sub-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="wwmSub">Work With Me <span class="caret" aria-hidden="true"></span></button>' +
          '<ul class="submenu" id="wwmSub">' +
            '<li><a href="work-with-me.html" data-match="work-with-me.html">Overview</a></li>' +
            '<li><a href="clinic.html" data-match="clinic.html">The Offer Clinic <span class="sub-meta">90 min &middot; US$89</span></a></li>' +
            '<li><a href="session.html" data-match="session.html">The Next Move Session <span class="sub-meta">90 min &middot; US$275</span></a></li>' +
            '<li><a href="lab.html" data-match="lab.html">The Next Move Lab <span class="sub-meta">6 weeks &middot; group</span></a></li>' +
            '<li><a href="advisory.html" data-match="advisory.html">Regulated Strategy Advisory <span class="sub-meta">12 weeks &middot; 1:1</span></a></li>' +
          '</ul>' +
        '</li>' +
        '<li><a href="contact.html" data-match="contact.html">Contact</a></li>' +
      '</ul>' +
    '</div>';

  /* ---------- The footer (edit here, once) ---------- */
  var FOOTER_HTML =
    '<div class="container">' +
      '<p class="footer-anchor">Ambitious enough for the business. Safe enough for the nervous system.</p>' +
      '<div class="footer-grid">' +
        '<div>' +
          '<a href="index.html" class="logo">Nir Hermelin<em>.</em></a>' +
          '<p class="footer-about" style="margin-top:1rem;">Business strategy, nervous system + inner work included. AI always supporting.</p>' +
        '</div>' +
        '<nav aria-label="Footer navigation">' +
          '<h4>Explore</h4>' +
          '<ul>' +
            '<li><a href="index.html">Home</a></li>' +
            '<li><a href="about.html">About</a></li>' +
            '<li><a href="regulated-strategy.html">Regulated Strategy</a></li>' +
            '<li><a href="work-with-me.html">Work With Me</a></li>' +
            '<li><a href="clinic.html">&mdash; The Offer Clinic</a></li>' +
            '<li><a href="session.html">&mdash; The Next Move Session</a></li>' +
            '<li><a href="lab.html">&mdash; The Next Move Lab</a></li>' +
            '<li><a href="advisory.html">&mdash; Regulated Strategy Advisory</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
          '</ul>' +
        '</nav>' +
        '<div>' +
          '<h4>Elsewhere</h4>' +
          '<ul>' +
            '<li><a href="https://www.linkedin.com/in/nirhermelin" target="_blank" rel="noopener">LinkedIn</a></li>' +
            '<li><a href="https://www.nirmusic.com" target="_blank" rel="noopener">NirMusic</a></li>' +
            '<li><a href="mailto:nir@nirhermelin.com">nir@nirhermelin.com</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<h4>Sessions</h4>' +
          '<ul>' +
            '<li><span style="color:var(--dark-muted); font-size:0.95rem;">Online, worldwide.</span></li>' +
            '<li><span style="color:var(--dark-muted); font-size:0.95rem;">South Africa &middot; Hong Kong &middot; Israel &middot; Thailand</span></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; <span data-year>2026</span> Regulated Strategy &middot; founded by Nir Hermelin</span>' +
        '<span class="wink">Built with a regulated-enough nervous system and a lot of AI.</span>' +
      '</div>' +
    '</div>';

  /* ---------- Work out which page we're on ---------- */
  function currentFile() {
    var path = window.location.pathname;
    var last = path.substring(path.lastIndexOf("/") + 1);
    if (!last || last === "") last = "index.html";        // "/"  -> index.html
    if (last.indexOf(".") === -1) last = last + ".html";  // "/about" (cleanUrls) -> about.html
    return last.toLowerCase();
  }

  /* ---------- Highlight the current page in the nav ---------- */
  function markCurrent(headerEl, file) {
    var link = headerEl.querySelector('.nav-links a[data-match="' + file + '"]');
    if (link) link.setAttribute("aria-current", "page");

    // If we're on a "Work With Me" sub-page, mark the parent group.
    var group = headerEl.querySelector(".has-sub[data-sub-match]");
    if (group) {
      var matches = group.getAttribute("data-sub-match").split(",");
      if (matches.indexOf(file) !== -1) group.classList.add("is-current");
    }
  }

  /* ---------- Inject, then announce ---------- */
  function inject() {
    var header = document.querySelector("[data-site-header]");
    if (header) {
      header.className = "nav";              // ensure the styling class is present
      header.innerHTML = HEADER_HTML;
      markCurrent(header, currentFile());
    }
    var footer = document.querySelector("[data-site-footer]");
    if (footer) {
      footer.className = "footer";
      footer.innerHTML = FOOTER_HTML;
    }
    // Tell main.js the markup now exists, so it can attach behaviour.
    document.dispatchEvent(new CustomEvent("site:includes-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
