const menuButton = document.querySelector("#menu-button");
const siteNav = document.querySelector("#site-nav");
const languageSelect = document.querySelector("#language-select");
const quoteForm = document.querySelector("#quote-form");
const result = document.querySelector("#request-result");
const formNote = document.querySelector("#form-note");
const dialog = document.querySelector("#project-dialog");
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const supportedLanguages = Array.from(languageSelect.options, option => option.value);
let preparedMessage = "";
let previewTrigger = null;

function normalizeText(value) { return value.replace(/\s+/g, " ").trim(); }
function translateText(value, lang = document.documentElement.lang) {
  return window.NEXO_TRANSLATIONS?.[lang]?.[normalizeText(value)] || value;
}
function setLocalizedText(element, source) {
  element.textContent = translateText(source);
  originalText.set(element.firstChild, source);
}
function translateAttribute(element, attr, lang) {
  if (!element.hasAttribute(attr)) return;
  if (!originalAttributes.has(element)) originalAttributes.set(element, {});
  const originals = originalAttributes.get(element);
  if (!(attr in originals)) originals[attr] = element.getAttribute(attr);
  element.setAttribute(attr, translateText(originals[attr], lang));
}
function applyLanguage(requested) {
  const lang = supportedLanguages.includes(requested) ? requested : "es";
  languageSelect.value = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = window.NEXO_RTL?.includes(lang) ? "rtl" : "ltr";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, noscript, [translate="no"], [aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      return normalizeText(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!originalText.has(node)) originalText.set(node, node.textContent);
    node.textContent = translateText(originalText.get(node), lang);
  });
  document.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach(element => {
    if (element.closest('[translate="no"]')) return;
    ["placeholder", "aria-label", "title", "alt"].forEach(attr => translateAttribute(element, attr, lang));
  });
  document.title = "Nexo Digital Partners | " + translateText("Soluciones", lang);
  try { localStorage.setItem("nexo-language", lang); } catch { /* Storage can be unavailable in private or file contexts. */ }
  if (!result.hidden) prepareRequest();
}
function closeMenu() {
  siteNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  siteNav.classList.toggle("open", expanded);
  menuButton.setAttribute("aria-expanded", String(expanded));
});
siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => { if (!event.target.closest(".site-header")) closeMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && siteNav.classList.contains("open")) { closeMenu(); menuButton.focus(); } });
matchMedia("(min-width:961px)").addEventListener("change", closeMenu);
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelectorAll(".portfolio-card").forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  });
});
document.querySelectorAll("[data-project]").forEach(link => {
  link.addEventListener("click", () => {
    quoteForm.elements.project.value = link.dataset.project;
    result.hidden = true;
  });
});
// Local-only projects expose their real capture, not a misleading live-demo link.
document.querySelectorAll(".portfolio-card").forEach(card => {
  const liveLink = card.querySelector('a[href^="https://"], a[href^="demos/"]');
  if (liveLink) return;
  const captureLink = document.createElement("a");
  captureLink.className = "text-link";
  captureLink.href = card.querySelector(".project-image img").getAttribute("src");
  captureLink.target = "_blank";
  captureLink.rel = "noopener noreferrer";
  captureLink.textContent = "Ver captura";
  card.append(captureLink);
});
document.querySelectorAll("[data-preview]").forEach(button => {
  button.addEventListener("click", () => {
    previewTrigger = button;
    const card = button.closest(".portfolio-card");
    const thumbnail = button.querySelector("img");
    const preview = document.querySelector("#preview-image");
    document.querySelector("#preview-title").textContent = card.querySelector("h3").textContent;
    preview.src = thumbnail.src;
    preview.alt = thumbnail.alt;
    const paragraph = card.querySelector("p");
    setLocalizedText(document.querySelector("#preview-description"), originalText.get(paragraph.firstChild) || paragraph.textContent);
    dialog.showModal();
  });
});
document.querySelector("#close-preview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener("close", () => previewTrigger?.focus());

function prepareRequest() {
  const data = new FormData(quoteForm);
  const lang = languageSelect.value;
  const fields = [
    ["Nombre / marca", data.get("name")],
    ["Contacto", data.get("contact")],
    ["Tipo de solucion", quoteForm.elements.project.selectedOptions[0].textContent],
    ["Contexto del proyecto", data.get("message")]
  ];
  preparedMessage = [
    window.NEXO_FORM_INTRO[lang],
    ...fields.map(([label, value]) => translateText(label) + ": " + String(value || "").trim()),
    "", window.NEXO_FORM_CLOSING[lang]
  ].join("\n");
  document.querySelector("#whatsapp-result").href = "https://wa.me/593987411592?text=" + encodeURIComponent(preparedMessage);
  document.querySelector("#email-result").href = "mailto:josuepug@gmail.com?subject=" + encodeURIComponent("Nexo Digital Partners - " + translateText("Iniciar proyecto")) + "&body=" + encodeURIComponent(preparedMessage);
  setLocalizedText(formNote, "Solicitud preparada.");
  result.hidden = false;
}
quoteForm.addEventListener("submit", event => { event.preventDefault(); prepareRequest(); });
quoteForm.addEventListener("input", () => { result.hidden = true; });
document.querySelector("#copy-request").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage);
    setLocalizedText(formNote, "Mensaje copiado.");
  } catch {
    setLocalizedText(formNote, "No se pudo copiar. Abre WhatsApp o correo.");
  }
});
window.lucide?.createIcons();
let savedLanguage = "es";
try { savedLanguage = localStorage.getItem("nexo-language") || "es"; } catch { /* The site remains usable without persistent storage. */ }
applyLanguage(savedLanguage);
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
