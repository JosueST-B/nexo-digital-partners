const menuButton = document.querySelector("#menu-button");
const siteNav = document.querySelector("#site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const quoteForm = document.querySelector("#quote-form");
const formNote = document.querySelector("#form-note");
const languageSelect = document.querySelector("#language-select");
const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translateText(value, lang) {
  if (lang === "es") {
    return value;
  }

  const dictionary = window.NEXO_TRANSLATIONS?.[lang] || {};
  return dictionary[normalizeText(value)] || value;
}

function translateAttribute(element, attr, lang) {
  if (!element.hasAttribute(attr)) {
    return;
  }

  if (!originalAttributes.has(element)) {
    originalAttributes.set(element, {});
  }

  const originals = originalAttributes.get(element);
  if (!originals[attr]) {
    originals[attr] = element.getAttribute(attr);
  }

  element.setAttribute(attr, translateText(originals[attr], lang));
}

function applyLanguage(lang) {
  const isRtl = window.NEXO_RTL?.includes(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      return normalizeText(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    if (!originalText.has(node)) {
      originalText.set(node, node.textContent);
    }

    node.textContent = translateText(originalText.get(node), lang);
  });

  document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
    translateAttribute(element, "placeholder", lang);
    translateAttribute(element, "aria-label", lang);
    translateAttribute(element, "title", lang);
  });

  localStorage.setItem("nexo-language", lang);
}

menuButton.addEventListener("click", () => {
  siteNav.classList.toggle("open");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => siteNav.classList.remove("open"));
});

if (languageSelect) {
  const savedLanguage = localStorage.getItem("nexo-language") || "es";
  languageSelect.value = savedLanguage;
  applyLanguage(savedLanguage);

  languageSelect.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
  });
}

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
  const lang = languageSelect?.value || "es";
  const intro = window.NEXO_FORM_INTRO?.[lang] || window.NEXO_FORM_INTRO?.es;
  const closing = window.NEXO_FORM_CLOSING?.[lang] || window.NEXO_FORM_CLOSING?.es;
  const message = [
    intro,
    `${translateText("Nombre / marca", lang)}: ${data.get("name") || translateText("No indicado", lang)}`,
    `${translateText("Contacto", lang)}: ${data.get("contact") || translateText("No indicado", lang)}`,
    `${translateText("Tipo de solucion", lang)}: ${data.get("project") || translateText("No indicado", lang)}`,
    `${translateText("Nicho o industria", lang)}: ${data.get("sector") || translateText("No indicado", lang)}`,
    `${translateText("Prioridad", lang)}: ${data.get("timeline") || translateText("No indicada", lang)}`,
    `${translateText("Objetivo principal", lang)}: ${data.get("goal") || translateText("No indicado", lang)}`,
    `${translateText("Contexto del proyecto", lang)}: ${data.get("message") || translateText("Sin descripcion adicional", lang)}`,
    "",
    closing
  ].join("\n");

  const whatsappUrl = `https://wa.me/593987411592?text=${encodeURIComponent(message)}`;

  if (!navigator.clipboard) {
    formNote.innerHTML = `<a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir mensaje en WhatsApp</a>`;
    return;
  }

  navigator.clipboard.writeText(message).then(
    () => {
      formNote.innerHTML = `${translateText("Mensaje copiado.", lang)} <a href="${whatsappUrl}" target="_blank" rel="noopener">${translateText("Abrir WhatsApp", lang)}</a>`;
    },
    () => {
      formNote.innerHTML = `<a href="${whatsappUrl}" target="_blank" rel="noopener">${translateText("Abrir mensaje en WhatsApp", lang)}</a>`;
    }
  );
});
