
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const surname = document.querySelector("#surname");
  const postalCode = document.querySelector("#postal-code");
  const message = document.querySelector("[data-form-message]");
  const submit = form?.querySelector("button[type='submit']");

  const copy = {
    de:{
      required:"Bitte füllen Sie beide Felder aus.",
      postal:"Bitte geben Sie eine gültige Postleitzahl ein.",
      invalid:"Die eingegebenen Daten konnten keiner aktuellen Buchung zugeordnet werden.",
      unavailable:"Der Gastbereich ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut.",
      loading:"Buchung wird geprüft …"
    },
    en:{
      required:"Please complete both fields.",
      postal:"Please enter a valid postal code.",
      invalid:"The details could not be matched to a current booking.",
      unavailable:"The guest area is currently unavailable. Please try again later.",
      loading:"Checking your booking …"
    },
    nl:{
      required:"Vul beide velden in.",
      postal:"Vul een geldige postcode in.",
      invalid:"De ingevoerde gegevens konden niet aan een actuele boeking worden gekoppeld.",
      unavailable:"Het gastgedeelte is momenteel niet bereikbaar. Probeer het later opnieuw.",
      loading:"Uw boeking wordt gecontroleerd …"
    }
  };

  const lang = document.documentElement.lang || "de";
  const t = copy[lang] || copy.de;
  const dashboardByLanguage = {
    de:"dashboard-de.html",
    en:"dashboard-en.html",
    nl:"dashboard-nl.html"
  };

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    surname.setAttribute("aria-invalid","false");
    postalCode.setAttribute("aria-invalid","false");

    const nameValue = surname.value.trim();
    const postalValue = postalCode.value.trim().replace(/\s+/g," ").toUpperCase();

    if (!nameValue || !postalValue) {
      message.textContent = t.required;
      if (!nameValue) surname.setAttribute("aria-invalid","true");
      if (!postalValue) postalCode.setAttribute("aria-invalid","true");
      return;
    }

    if (!/^[A-Z0-9][A-Z0-9 -]{1,10}[A-Z0-9]$/.test(postalValue)) {
      postalCode.setAttribute("aria-invalid","true");
      message.textContent = t.postal;
      return;
    }

    submit.disabled = true;
    const originalText = submit.textContent;
    submit.textContent = t.loading;

    try {
      const response = await fetch("https://me-living-guest-access.pm4nbrt8jy.workers.dev/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          surname:nameValue,
          postalCode:postalValue,
          property:"brunnenstrasse"
        })
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success || !result?.token) {
        message.textContent =
          response.status === 401
            ? (result?.message || t.invalid)
            : (result?.message || t.unavailable);
        return;
      }

      sessionStorage.setItem("meLivingGuestToken", result.token);
      sessionStorage.setItem("meLivingGuestName", result.guestName || nameValue);
      sessionStorage.setItem("meLivingGuestArrival", result.arrival || "");
      sessionStorage.setItem("meLivingGuestDeparture", result.departure || "");
      sessionStorage.setItem("meLivingGuestProperty", result.property || "brunnenstrasse");
      sessionStorage.setItem("meLivingGuestLanguage", lang);

      window.location.assign(dashboardByLanguage[lang] || dashboardByLanguage.de);
    } catch (error) {
      message.textContent = t.unavailable;
    } finally {
      submit.disabled = false;
      submit.textContent = originalText;
    }
  });
});
