(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal, .reveal-item").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const revealElements = document.querySelectorAll(".reveal");
  const revealItems = document.querySelectorAll(".reveal-item");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (entry.target.classList.contains("reveal")) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const itemObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const index = Number(entry.target.dataset.revealIndex || 0);
        window.setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 90);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  revealElements.forEach((section) => observer.observe(section));
  revealItems.forEach((item, index) => {
    item.dataset.revealIndex = String(index % 6);
    itemObserver.observe(item);
  });
})();
