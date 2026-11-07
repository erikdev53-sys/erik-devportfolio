/* ============================================================
   Portfolio — script.js
   Theme toggle, mobile nav, scroll reveal, copy-to-clipboard.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fc" : "#0b0f19");
  }

  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(stored || (prefersLight ? "light" : "dark"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  /* ---------- Mobile nav ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");

  if (copyBtn && copyStatus) {
    copyBtn.addEventListener("click", async function () {
      const email = copyBtn.dataset.email || "erik.dev53@gmail.com";
      const copied = await copyText(email);

      if (copied) {
        showStatus("Copied " + email + " to clipboard ✓");
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied ✓";
        window.setTimeout(function () { copyBtn.textContent = original; }, 2000);
      } else {
        showStatus("Couldn't copy automatically — the address is " + email);
      }
    });

    async function copyText(text) {
      // Modern API first (needs a secure context and permission).
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (err) { /* fall through to the legacy path */ }
      }

      // Fallback that works on file:// and older browsers.
      try {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.top = "-1000px";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        field.setSelectionRange(0, text.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(field);
        return ok;
      } catch (err) {
        return false;
      }
    }

    function showStatus(message) {
      copyStatus.textContent = message;
      copyStatus.classList.add("show");
      window.clearTimeout(showStatus.timer);
      showStatus.timer = window.setTimeout(function () {
        copyStatus.classList.remove("show");
      }, 2600);
    }
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
