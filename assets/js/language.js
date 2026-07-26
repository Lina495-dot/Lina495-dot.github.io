document.addEventListener("DOMContentLoaded", () => {
  const browserLanguage = (navigator.language || "").toLowerCase();
  const suggested = browserLanguage.startsWith("nl")
    ? "nl"
    : browserLanguage.startsWith("de")
      ? "de"
      : "en";

  const link = document.querySelector(`[data-language="${suggested}"]`);
  if (link) {
    link.setAttribute("aria-current", "true");
    link.insertAdjacentText("beforeend", " · empfohlen");
  }
});