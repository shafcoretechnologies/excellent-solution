/* ============================================================
   Excellent Solution Mysore — script.js
   Pure Vanilla JS | No Frameworks
   ============================================================ */

(function () {
  "use strict";

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
        backToTop.classList.add("visible");
      } else {
        navbar.classList.remove("scrolled");
        backToTop.classList.remove("visible");
      }
    },
    { passive: true },
  );

  /* ===== BACK TO TOP ===== */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===== HAMBURGER / MOBILE MENU ===== */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));

    // Animate hamburger bars
    const bars = hamburger.querySelectorAll("span");
    if (isOpen) {
      bars[0].style.transform = "translateY(7px) rotate(45deg)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      bars[0].style.transform = "";
      bars[1].style.opacity = "";
      bars[2].style.transform = "";
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      const bars = hamburger.querySelectorAll("span");
      bars[0].style.transform = "";
      bars[1].style.opacity = "";
      bars[2].style.transform = "";
    });
  });

  /* ===== FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all
      faqItems.forEach((i) => {
        i.classList.remove("active");
        i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Open clicked (if was closed)
      if (!isActive) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ===== ANIMATED COUNTER ===== */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counters = document.querySelectorAll(".stat-num");
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach((c) => animateCounter(c));
        }
      });
    },
    { threshold: 0.5 },
  );

  if (counters.length) {
    counterObserver.observe(counters[0].closest(".hero-stats"));
  }

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    ".service-card, .why-card, .process-step, .faq-item, .coverage-wrapper, .contact-wrapper, .section-header",
  );

  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger siblings
    const siblings = el.parentElement.children;
    const index = Array.from(siblings).indexOf(el);
    if (index === 1) el.classList.add("reveal-delay-1");
    if (index === 2) el.classList.add("reveal-delay-2");
    if (index === 3) el.classList.add("reveal-delay-3");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ===== SMOOTH ACTIVE NAV LINK ===== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.style.color = "var(--text-primary)";
            }
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector("#name").value.trim();
      const phone = contactForm.querySelector("#phone").value.trim();
      const service = contactForm.querySelector("#service").value;

      if (!name) {
        showAlert("Please enter your name.", "error");
        return;
      }
      if (!phone) {
        showAlert("Please enter your phone number.", "error");
        return;
      }
      if (!service) {
        showAlert("Please select a service.", "error");
        return;
      }

      // Build WhatsApp message
      const email = contactForm.querySelector("#email").value.trim();
      const location = contactForm.querySelector("#location").value.trim();
      const message = contactForm.querySelector("#message").value.trim();

      const serviceLabels = {
        cctv: "CCTV Installation",
        alarm: "Intrusion Alarm System",
        networking: "Networking Solutions",
        fire: "Fire Alarm System",
        website: "Website Services",
        multiple: "Multiple Services",
      };

      const whatsappText = encodeURIComponent(
        `Hello Excellent Solution Mysore!\n\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          (email ? `Email: ${email}\n` : "") +
          `Service Required: ${serviceLabels[service] || service}\n` +
          (location ? `Location in Mysore: ${location}\n` : "") +
          (message ? `\nMessage: ${message}` : ""),
      );

      showAlert("Redirecting to WhatsApp…", "success");
      setTimeout(() => {
        window.open(
          `https://wa.me/919008458177X?text=${whatsappText}`,
          "_blank",
        );
      }, 800);
    });
  }

  /* Alert helper */
  function showAlert(msg, type) {
    // Remove existing
    const existing = document.querySelector(".form-alert");
    if (existing) existing.remove();

    const alert = document.createElement("div");
    alert.className = "form-alert";
    alert.textContent = msg;
    Object.assign(alert.style, {
      position: "fixed",
      top: "84px",
      right: "24px",
      padding: "14px 24px",
      borderRadius: "10px",
      fontFamily: "var(--font-body)",
      fontWeight: "600",
      fontSize: "0.9rem",
      zIndex: "9999",
      background: type === "success" ? "#0062ff" : "#e53e3e",
      color: "#fff",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      animation: "fadeInDown 0.3s ease both",
    });
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3500);
  }

  /* ===== LOCALITY TAG HOVER SPARKLE ===== */
  document.querySelectorAll(".locality-tags span").forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });
    tag.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
})();
