
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-lang-button]");
  const contents = document.querySelectorAll("[data-lang-content]");
  const stored = localStorage.getItem("me-living-language");
  const browser = (navigator.language || "de").toLowerCase();
  let activeLanguage = stored || (browser.startsWith("nl") ? "nl" : browser.startsWith("en") ? "en" : "de");

  const setLanguage = (language) => {
    activeLanguage = language;
    localStorage.setItem("me-living-language", language);
    document.documentElement.lang = language;
    buttons.forEach(button => {
      const active = button.dataset.langButton === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    contents.forEach(content => {
      content.classList.toggle("active", content.dataset.langContent === language);
    });
    document.querySelectorAll("[data-guide-link]").forEach(link => {
      link.href = `${language}/villa-am-kurpark.html`;
    });
  };

  buttons.forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.langButton));
  });

  setLanguage(activeLanguage);
});
