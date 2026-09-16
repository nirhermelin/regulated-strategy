/* =========================================================
   Nir Hermelin — main.js
   Vanilla JS. No libraries.
   v3: the pressure map is a set of lenses, not a ladder.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Page loader ---------- */
  var loader = document.querySelector(".loader");
  function hideLoader() {
    if (loader) loader.classList.add("done");
    document.body.classList.add("loaded");
  }
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 2500); // never trap a visitor behind a loader
  }

  /* ---------- Nav: solid on scroll ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Hand-drawn lines outside .reveal containers draw on view too */
  document.querySelectorAll(".hand-line").forEach(function (el) {
    if (el.closest(".reveal")) return;
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { el.classList.add("drawn"); o.unobserve(el); }
        });
      }, { threshold: 0.5 });
      o.observe(el);
    } else {
      el.classList.add("drawn");
    }
  });

  /* ---------- Subtle hero parallax ---------- */
  var heroInner = document.querySelector("[data-parallax]");
  if (heroInner && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroInner.style.transform = "translateY(" + y * 0.16 + "px)";
          heroInner.style.opacity = Math.max(1 - y / (window.innerHeight * 0.9), 0);
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- The pressure map: lenses, not a ladder ---------- */
  var lensWrap = document.querySelector(".lens-wrap");
  if (lensWrap && "IntersectionObserver" in window) {
    var lObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            lensWrap.classList.add("animate");
            lObserver.unobserve(lensWrap);
          }
        });
      },
      { threshold: 0.3 }
    );
    lObserver.observe(lensWrap);
  } else if (lensWrap) {
    lensWrap.classList.add("animate");
  }

  /* Lens data — useful lenses, not diagnoses. Framing straight from the brief. */
  var LENSES = {
    regulated: {
      name: "Regulated / connected",
      color: "#7a9e7e",
      zone: "regulated",
      frame: "Perspective is available. So is energy.",
      a: { label: "Useful", items: ["Perspective", "Curiosity", "Flexible attention", "Listening"] },
      b: { label: "Watch for", items: ["Calm is not the goal all day.", "Business also needs energy, mobilisation and healthy stress."] }
    },
    fight: {
      name: "Fight / mobilise",
      color: "#d4a853",
      zone: "mobilise",
      frame: "Energy pointed at something.",
      a: { label: "Useful", items: ["Boundaries", "Decisive action", "Protecting a priority", "Saying no"] },
      b: { label: "Watch for", items: ["Control", "Irritability", "Forcing", "Turning every disagreement into a contest"] }
    },
    flight: {
      name: "Flight / mobilise",
      color: "#e6c47a",
      zone: "mobilise",
      frame: "Energy pointed away from something.",
      a: { label: "Useful", items: ["Speed", "Scanning", "Problem-solving", "Spotting opportunities"] },
      b: { label: "Watch for", items: ["Compulsive busyness", "Difficulty stopping", "Solving tomorrow while today is still happening"] }
    },
    freeze: {
      name: "Freeze / shutdown",
      color: "#8fa3b8",
      zone: "shutdown",
      frame: "Less available. Not necessarily broken.",
      a: { label: "Can look like", items: ["Blankness", "Avoidance", "Fatigue", "Difficulty choosing or starting"] },
      b: { label: "Useful question", text: "Is this protection, depletion, confusion, a bad plan, or some combination?" }
    },
    fawn: {
      name: "Fawn / social protection",
      color: "#c99a7a",
      zone: "fawn",
      frame: "A relational strategy. It can sit at any level of activation.",
      a: { label: "Can look like", items: ["Over-accommodating", "Softening the price before anyone objects", "Saying yes while resenting it", "Managing everyone else’s comfort"] },
      b: { label: "Treat it as", text: "A protection strategy about belonging and safety with other people, not a point on an activation curve. It can coexist with fight, flight or a fairly regulated state." }
    }
  };

  var lensBtns = document.querySelectorAll(".lens-btn");
  var lensPanel = document.getElementById("lensPanel");
  var zones = document.querySelectorAll(".lens-zone");

  function renderList(col) {
    if (col.items) {
      return "<ul>" + col.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
    }
    return "<p>" + col.text + "</p>";
  }

  function renderLens(key) {
    var L = LENSES[key];
    if (!L || !lensPanel) return;
    lensPanel.innerHTML =
      '<h4><span class="lens-dot" style="background:' + L.color + '"></span>' + L.name + "</h4>" +
      '<p class="lens-frame">' + L.frame + "</p>" +
      '<div class="lens-cols">' +
      '<div class="col-a"><h5>' + L.a.label + "</h5>" + renderList(L.a) + "</div>" +
      '<div class="col-b"><h5>' + L.b.label + "</h5>" + renderList(L.b) + "</div>" +
      "</div>";

    lensBtns.forEach(function (b) {
      var active = b.dataset.lens === key;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (zones.length) {
      lensWrap.classList.add("focused");
      lensWrap.classList.toggle("fawn-on", key === "fawn");
      zones.forEach(function (z) {
        z.classList.toggle("active", z.dataset.zone === L.zone);
      });
    }
  }

  if (lensBtns.length && lensPanel) {
    lensBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { renderLens(btn.dataset.lens); });
    });
    renderLens("regulated");
    lensWrap.classList.remove("focused"); // stay undimmed until the first click
  }

  /* ---------- Email capture forms ----------
     No backend here yet. Swap for your provider's action URL. */
  document.querySelectorAll("[data-capture]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value) return;
      var success = form.parentElement.querySelector(".form-success");
      form.style.display = "none";
      if (success) success.classList.add("show");
    });
  });

  /* ---------- Contact form ----------
     TODO(Nir): point this at a form backend (Formspree / Basin / Vercel function).
     Until then it opens a pre-filled email. */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = contactForm;
      var name = (f.querySelector('[name="name"]') || {}).value || "";
      var email = (f.querySelector('[name="email"]') || {}).value || "";
      var working = (f.querySelector('[name="working"]') || {}).value || "";
      var complicated = (f.querySelector('[name="complicated"]') || {}).value || "";
      var body = "Name: " + name + "\nEmail: " + email + "\n\nWhat I'm working on:\n" + working + "\n\nWhat seems to be getting complicated:\n" + complicated;
      window.location.href = "mailto:nir@nirhermelin.com?subject=" + encodeURIComponent("From the website — " + name) + "&body=" + encodeURIComponent(body);
      var success = document.querySelector(".form-success");
      f.style.display = "none";
      if (success) success.classList.add("show");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", !isOpen);
      q.setAttribute("aria-expanded", String(!isOpen));
      a.style.maxHeight = isOpen ? null : a.scrollHeight + "px";
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
