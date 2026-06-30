const menuButton = document.querySelector("#menu-button");
const siteNav = document.querySelector("#site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const quoteForm = document.querySelector("#quote-form");
const formNote = document.querySelector("#form-note");

menuButton.addEventListener("click", () => {
  siteNav.classList.toggle("open");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => siteNav.classList.remove("open"));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    portfolioCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(quoteForm);
  const message = [
    "Hola Nexo Digital Partners, quiero solicitar un diagnostico/propuesta para un activo digital.",
    `Nombre / marca: ${data.get("name") || "No indicado"}`,
    `Contacto: ${data.get("contact") || "No indicado"}`,
    `Tipo de solucion: ${data.get("project") || "No indicado"}`,
    `Nicho o industria: ${data.get("sector") || "No indicado"}`,
    `Prioridad: ${data.get("timeline") || "No indicada"}`,
    `Objetivo principal: ${data.get("goal") || "No indicado"}`,
    `Contexto del proyecto: ${data.get("message") || "Sin descripcion adicional"}`,
    "",
    "Quiero recibir una propuesta con alcance, entregables, tiempos, prioridad y siguiente paso."
  ].join("\n");

  const whatsappUrl = `https://wa.me/593987411592?text=${encodeURIComponent(message)}`;

  if (!navigator.clipboard) {
    formNote.innerHTML = `<a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir mensaje en WhatsApp</a>`;
    return;
  }

  navigator.clipboard.writeText(message).then(
    () => {
      formNote.innerHTML = `Mensaje copiado. <a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir WhatsApp</a>`;
    },
    () => {
      formNote.innerHTML = `<a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir mensaje en WhatsApp</a>`;
    }
  );
});
