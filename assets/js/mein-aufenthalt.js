
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const surname = document.querySelector("#surname");
  const postalCode = document.querySelector("#postal-code");
  const message = document.querySelector("[data-form-message]");
  const submit = form?.querySelector("button[type='submit']");

  const copy = {
    de:{
      required:"Bitte füllen Sie beide Felder aus.",
      postal:"Bitte geben Sie eine gültige fünfstellige Postleitzahl ein.",
      unavailable:"Die sichere Buchungsprüfung wird derzeit eingerichtet. Bitte verwenden Sie bis dahin den persönlichen Link aus Ihrer Anreisenachricht."
    },
    en:{
      required:"Please complete both fields.",
      postal:"Please enter a valid five-digit postal code.",
      unavailable:"Secure booking verification is currently being set up. Until then, please use the personal link in your arrival message."
    },
    nl:{
      required:"Vul beide velden in.",
      postal:"Vul een geldige postcode van vijf cijfers in.",
      unavailable:"De veilige boekingscontrole wordt momenteel ingericht. Gebruik tot die tijd de persoonlijke link in uw aankomstbericht."
    }
  };
  const lang = document.documentElement.lang || "de";
  const t = copy[lang] || copy.de;

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    surname.setAttribute("aria-invalid","false");
    postalCode.setAttribute("aria-invalid","false");

    const nameValue = surname.value.trim();
    const postalValue = postalCode.value.replace(/\s/g,"").trim();

    if (!nameValue || !postalValue) {
      message.textContent = t.required;
      if (!nameValue) surname.setAttribute("aria-invalid","true");
      if (!postalValue) postalCode.setAttribute("aria-invalid","true");
      return;
    }
    if (!/^\d{5}$/.test(postalValue)) {
      postalCode.setAttribute("aria-invalid","true");
      message.textContent = t.postal;
      return;
    }

    submit.disabled = true;

    try {
      // Prepared secure endpoint. It deliberately contains no booking data
      // and does not fall back to insecure client-side credential checks.
      const response = await fetch("/api/guest-access", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          surname:nameValue,
          postalCode:postalValue,
          property:"brunnenstrasse"
        })
      });

      if (!response.ok) throw new Error("verification-unavailable");
      const result = await response.json();

      if (result?.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      throw new Error("invalid-response");
    } catch (error) {
      message.textContent = t.unavailable;
    } finally {
      submit.disabled = false;
    }
  });
});
