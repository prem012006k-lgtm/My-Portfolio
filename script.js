/* =========================================================
   PREM KUMAR — PORTFOLIO SCRIPT
   Plain JavaScript, no external libraries required.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* Confirms this file actually loaded and ran. Scroll
     animations in style.css only activate once this class
     is present — so if this file ever fails to load, the
     page still displays normally (just without the
     scroll-in animation) instead of staying invisible. */
  document.documentElement.classList.add("js-ready");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* -------------------------------------------------------
     FOOTER YEAR
     ------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* -------------------------------------------------------
     MOBILE MENU TOGGLE
     ------------------------------------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* -------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }


  /* -------------------------------------------------------
     ANIMATED SKILL BARS
     Bars already show their correct width via inline style
     (safe fallback). When they scroll into view, we briefly
     collapse them to 0% then restore the target width so
     the CSS transition animates the fill in.
     ------------------------------------------------------- */
  const bars = document.querySelectorAll(".bar-fill");

  if (bars.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const target = bar.dataset.pct + "%";
            bar.style.width = "0%";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                bar.style.width = target;
              });
            });
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((bar) => barObserver.observe(bar));
  }


  /* -------------------------------------------------------
     ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
  }


  /* -------------------------------------------------------
     TYPEWRITER TAGLINE
     Edit the PHRASES array to change what it cycles through.
     ------------------------------------------------------- */
  const typingEl = document.getElementById("typingText");

  const PHRASES = [
    "continuous improvement",
    "better processes",
    "consistent results",
    "attention to detail"
  ];

  if (typingEl && !prefersReducedMotion) {

    let phraseIndex = 0;
    let charIndex = PHRASES[0].length;
    let isDeleting = false;

    const TYPE_SPEED = 55;
    const DELETE_SPEED = 30;
    const HOLD_TIME = 1700;

    function tick() {
      const currentPhrase = PHRASES[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        typingEl.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
        }
      }

      setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
    }

    setTimeout(() => {
      isDeleting = true;
      tick();
    }, HOLD_TIME);
  }

});
