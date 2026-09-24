/* =========================================================
   Nir Hermelin — head.js
   Head-level scripts shared by every page. Loaded in <head>
   on all pages so anything here runs early, before the body.

   Right now it holds site analytics (Microsoft Clarity:
   heatmaps + session/flow recordings). Add any other
   head-level tags here in future so they stay in one place.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Microsoft Clarity ---------- */
  var CLARITY_PROJECT_ID = "yncwzg2c7w";

  if (CLARITY_PROJECT_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
  }
})();
