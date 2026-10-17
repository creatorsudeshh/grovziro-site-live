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
    if (!config.contactEmail || !config.formEndpoint) {
      status.textContent = "The enquiry email is not configured yet. Please contact Grovziro directly.";
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!config.contactEmail || !config.formEndpoint) {
        status.textContent = "The enquiry email is not configured yet. Please contact Grovziro directly.";
        status.classList.add("form-note-pending");
        return;
      }
      const data = new FormData(form);
      if (window.location.protocol === "file:") {
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
        status.textContent = "This laptop file preview can’t send enquiries automatically. Your email app should open with the details; press Send there. Automatic delivery works on the hosted website.";
        return;
      }
      const payload = Object.fromEntries(data.entries());
      payload._subject = `New Grovziro website enquiry from ${data.get("name")}`;
      payload._replyto = data.get("email");
      const submitButton = form.querySelector('[type="submit"]');
      const originalButtonText = submitButton?.innerHTML;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";
      }
      status.classList.remove("form-note-pending");
      status.textContent = "Sending your enquiry…";

      try {
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || String(result.success).toLowerCase() !== "true") {
          throw new Error(result.message || "The form service did not confirm delivery.");
        }
        form.reset();
        status.textContent = "Thanks for reaching out. Your enquiry has been submitted to Grovziro Solutions, and we’ll be in touch soon.";
      } catch (error) {
        status.textContent = `We couldn’t confirm that your enquiry was sent. Please try again or email ${config.contactEmail} directly.`;
        status.classList.add("form-note-pending");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }
})();
