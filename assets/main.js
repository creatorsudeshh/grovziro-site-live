(() => {
  const config = window.GROVZIRO_CONFIG || {};
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = year;
  });

  const header = document.querySelector(".site-header");
  const updateHeaderOnScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

  document.querySelectorAll(".booking-link").forEach((link) => {
    if (config.bookingUrl) {
      link.href = config.bookingUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
    } else if (link.getAttribute("href") === "#contact-form") {
      link.href = "contact.html#contact-form";
    }
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }));
  }

  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");
  if (form && status) {
    if (!config.contactEmail) {
      status.textContent = "The enquiry email is not configured yet. Please contact Grovziro directly.";
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!config.contactEmail) {
        status.textContent = "The enquiry email is not configured yet. Please contact Grovziro directly.";
        status.classList.add("form-note-pending");
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent(`Website enquiry from ${data.get("name")}`);
      const body = encodeURIComponent([
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone")}`,
        `Country: ${data.get("country")}`,
        `Business: ${data.get("company") || "Not provided"}`,
        "",
        "Project details:",
        data.get("details")
      ].join("\n"));
      window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
      status.textContent = `Your email app should open with this enquiry addressed to ${config.contactEmail}. Press Send in that app to deliver it.`;
    });
  }
})();
