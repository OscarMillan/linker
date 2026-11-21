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

(() => {
  const dialog = document.querySelector("#promotion-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const title = dialog.querySelector("#promotion-dialog-title");
  const panels = dialog.querySelectorAll("[data-promotion-panel]");
  const video = dialog.querySelector("video");
  const titles = {
    product: "Siigo noi Asistente",
    campaign: "Conoce la campaña de Siigo Aspel",
    video: "Siigo noi Asistente en 38 segundos",
  };
  let opener;

  document.querySelectorAll("[data-promotion-media]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-controls", dialog.id);
    link.addEventListener("click", (event) => {
      // Preserve opening the underlying asset in a new tab or window.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const selected = link.dataset.promotionMedia;
      if (!titles[selected]) return;
      event.preventDefault();
      opener = link;
      title.textContent = titles[selected];
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.promotionPanel !== selected;
        if (panel.hidden) return;
        const media = panel.querySelector("[data-src]");
        if (!media.hasAttribute("src")) media.src = media.dataset.src;
      });
      dialog.showModal();
      document.documentElement.classList.add("promotion-viewer-open");
      dialog.querySelector(".promotion-dialog-body").scrollTop = 0;
    });
  });

  dialog.querySelector(".promotion-dialog-close").addEventListener("click", () => dialog.close());
  // A click on the backdrop closes the viewer; clicks inside its bounds do not.
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    video.pause();
    document.documentElement.classList.remove("promotion-viewer-open");
    opener?.focus({ preventScroll: true });
  });
})();
