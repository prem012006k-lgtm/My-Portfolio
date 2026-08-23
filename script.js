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
     CLICK ANYWHERE → SHIFT THE PALETTE
     Almost every accent color in style.css is derived from
     the --hue-base custom property. Rotating it here shifts
     the whole site's gradients, glows and blobs together.
     A short-lived ripple ring is also dropped at the click
     point, colored to match the new palette.
     ------------------------------------------------------- */
  let hue = 258;

  function shiftPalette(x, y) {
    hue = (hue + 47) % 360;
    document.documentElement.style.setProperty("--hue-base", hue);

    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  document.addEventListener("click", (e) => {
    shiftPalette(e.clientX, e.clientY);
  });


  /* -------------------------------------------------------
     CURSOR-FOLLOW GLOW
     A soft glow that trails the pointer with a little lag,
     skipped on touch devices and reduced-motion.
     ------------------------------------------------------- */
  const glow = document.getElementById("cursorGlow");
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  if (glow && !isTouchDevice && !prefersReducedMotion) {

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function followCursor() {
      // ease toward the target for a soft trailing feel
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(followCursor);
    }

    requestAnimationFrame(followCursor);
  } else if (glow) {
    glow.style.display = "none";
  }


  /* -------------------------------------------------------
     TILT ON HOVER (glass panels)
     Cards lean slightly toward the pointer. Purely visual,
     skipped on touch devices and reduced-motion.
     ------------------------------------------------------- */
  if (!isTouchDevice && !prefersReducedMotion) {
    document.querySelectorAll(".glass-panel").forEach((panel) => {

      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltStrength = 6; // degrees, kept subtle on purpose
        panel.style.transform =
          `perspective(900px) rotateX(${(-py * tiltStrength).toFixed(2)}deg) ` +
          `rotateY(${(px * tiltStrength).toFixed(2)}deg) translateY(-4px)`;
      });

      panel.addEventListener("mouseleave", () => {
        panel.style.transform = "";
      });
    });


    /* -----------------------------------------------------
       MAGNETIC BUTTONS
       Buttons drift a few pixels toward the pointer while
       hovered, and spring back on leave.
       ----------------------------------------------------- */
    document.querySelectorAll(".btn").forEach((btn) => {

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const pull = 10; // max pixels of movement
        btn.style.transform = `translate(${(px * pull).toFixed(1)}px, ${(py * pull).toFixed(1)}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
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
