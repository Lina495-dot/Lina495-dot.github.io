
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("meLivingGuestToken");
  const lang = document.documentElement.lang || "de";
  const loginPages = {
    de:"mein-aufenthalt-de.html",
    en:"mein-aufenthalt-en.html",
    nl:"mein-aufenthalt-nl.html"
  };

  if (!token) {
    window.location.replace(loginPages[lang] || loginPages.de);
    return;
  }

  const guestName = sessionStorage.getItem("meLivingGuestName") || "";
  const arrival = sessionStorage.getItem("meLivingGuestArrival") || "";
  const departure = sessionStorage.getItem("meLivingGuestDeparture") || "";

  const guestTarget = document.querySelector("[data-guest-name]");
  const datesTarget = document.querySelector("[data-stay-dates]");

  if (guestTarget) guestTarget.textContent = guestName;

  if (datesTarget && arrival && departure) {
    const locale = lang === "en" ? "en-GB" : lang === "nl" ? "nl-NL" : "de-DE";
    const format = (value) => new Intl.DateTimeFormat(locale, {
      day:"2-digit", month:"2-digit", year:"numeric"
    }).format(new Date(value + "T12:00:00"));
    datesTarget.textContent = `${format(arrival)} – ${format(departure)}`;
  }

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem("meLivingGuestToken");
    sessionStorage.removeItem("meLivingGuestName");
    sessionStorage.removeItem("meLivingGuestArrival");
    sessionStorage.removeItem("meLivingGuestDeparture");
    sessionStorage.removeItem("meLivingGuestProperty");
    window.location.replace(loginPages[lang] || loginPages.de);
  });
});
