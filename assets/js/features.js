
document.addEventListener("DOMContentLoaded", () => {
  const config = window.ME_LIVING_CONFIG;
  if (!config) return;
  const lang = document.documentElement.lang || "de";
  const toast = document.querySelector("[data-toast]");
  const words = {
    de:{copied:"Kopiert",all:"Alle",accommodation:"Unterkunft",parking:"Parken",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Sehenswert",shopping:"Einkaufen",maps:"Google Maps"},
    en:{copied:"Copied",all:"All",accommodation:"Accommodation",parking:"Parking",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Sights",shopping:"Shopping",maps:"Google Maps"},
    nl:{copied:"Gekopieerd",all:"Alles",accommodation:"Accommodatie",parking:"Parkeren",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Bezienswaardigheden",shopping:"Winkelen",maps:"Google Maps"}
  };
  const t = words[lang] || words.de;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.copy;
      const values = {
        wifi: config.property.wifiName,
        password: config.property.wifiPassword,
        address: config.property.address
      };
      try {
        await navigator.clipboard.writeText(values[key] || "");
        showToast(t.copied);
      } catch {
        showToast(values[key] || "");
      }
    });
  });

  // Arrival assistant
  const steps = [...document.querySelectorAll(".assistant-step")];
  const dots = [...document.querySelectorAll(".progress-dot")];
  let currentStep = 0;
  const renderStep = () => {
    steps.forEach((step,index) => step.classList.toggle("active", index === currentStep));
    dots.forEach((dot,index) => dot.classList.toggle("active", index <= currentStep));
    document.querySelectorAll("[data-assistant-prev]").forEach(btn => btn.disabled = currentStep === 0);
    document.querySelectorAll("[data-assistant-next]").forEach(btn => {
      btn.hidden = currentStep === steps.length - 1;
    });
  };
  document.querySelectorAll("[data-assistant-next]").forEach(btn => btn.addEventListener("click", () => {
    currentStep = Math.min(steps.length - 1, currentStep + 1); renderStep();
  }));
  document.querySelectorAll("[data-assistant-prev]").forEach(btn => btn.addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1); renderStep();
  }));
  renderStep();

  // Map
  const mapEl = document.getElementById("guest-map");
  const listEl = document.querySelector("[data-map-list]");
  let map;
  let markerLayer;
  const categoryColors = {
    accommodation:"#b99052",parking:"#252525",cafe:"#c4a16d",restaurant:"#96703e",
    wellness:"#5d5549",sight:"#d0b784",shopping:"#77716a"
  };
  const categoryLabels = {
    all:t.all,accommodation:t.accommodation,parking:t.parking,cafe:t.cafe,
    restaurant:t.restaurant,wellness:t.wellness,sight:t.sight,shopping:t.shopping
  };

  const googleLink = (place) => "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(place.name + " " + place.address);

  const renderList = (category="all") => {
    if (!listEl) return;
    listEl.innerHTML = "";
    config.places.filter(p => category === "all" || p.category === category).forEach(place => {
      const item = document.createElement("div");
      item.className = "map-list-item";
      item.innerHTML = `<span><strong>${place.name}</strong><br><small>${place.address}</small></span>
        <a href="${googleLink(place)}" target="_blank" rel="noopener">${t.maps}</a>`;
      listEl.appendChild(item);
    });
  };

  const renderMarkers = (category="all") => {
    if (!map || !window.L) return;
    markerLayer.clearLayers();
    const selected = config.places.filter(p => category === "all" || p.category === category);
    selected.forEach(place => {
      const color = categoryColors[place.category] || "#050505";
      const icon = L.divIcon({
        className:"",
        html:`<div class="marker-dot" style="background:${color}"></div>`,
        iconSize:[18,18],iconAnchor:[9,9]
      });
      L.marker([place.lat,place.lng],{icon}).bindPopup(
        `<strong>${place.name}</strong><br>${place.address}<br><a href="${googleLink(place)}" target="_blank" rel="noopener">${t.maps}</a>`
      ).addTo(markerLayer);
    });
    if (selected.length) {
      const bounds = L.latLngBounds(selected.map(p => [p.lat,p.lng]));
      map.fitBounds(bounds.pad(.15), {maxZoom:15});
    }
  };

  if (mapEl && window.L) {
    map = L.map(mapEl,{scrollWheelZoom:false}).setView(config.property.coordinates,14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:19,attribution:'&copy; OpenStreetMap'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    renderMarkers();
  } else if (mapEl) {
    // Reliable fallback when the external Leaflet library cannot be loaded.
    // The OpenStreetMap embed remains interactive (zoom and pan).
    const lat = config.property.coordinates[0];
    const lng = config.property.coordinates[1];
    const deltaLat = 0.018;
    const deltaLng = 0.032;
    const bbox = [
      lng - deltaLng,
      lat - deltaLat,
      lng + deltaLng,
      lat + deltaLat
    ].join(",");

    mapEl.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.className = "osm-fallback-frame";
    iframe.title = lang === "en" ? "Interactive map of the area" :
      lang === "nl" ? "Interactieve kaart van de omgeving" :
      "Interaktive Karte der Umgebung";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = "https://www.openstreetmap.org/export/embed.html?bbox=" +
      encodeURIComponent(bbox) +
      "&layer=mapnik&marker=" + encodeURIComponent(lat + "," + lng);
    iframe.setAttribute("allowfullscreen", "");
    mapEl.appendChild(iframe);

    const fallback = document.querySelector("[data-map-fallback]");
    if (fallback) fallback.style.display = "none";
    if (listEl) listEl.classList.add("fallback-visible");
  }
  renderList();

  document.querySelectorAll("[data-map-filter]").forEach(button => {
    button.textContent = categoryLabels[button.dataset.mapFilter] || button.textContent;
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-map-filter]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMarkers(button.dataset.mapFilter);
      renderList(button.dataset.mapFilter);
    });
  });


  // PWA installation: system prompt where supported, instructions elsewhere.
  let deferredPrompt = null;
  const installButtons = document.querySelectorAll("[data-install-app]");
  const installModal = document.querySelector("[data-install-modal]");
  const installModalText = document.querySelector("[data-install-modal-text]");
  const installModalTitle = document.querySelector("[data-install-modal-title]");
  const installModalClose = document.querySelector("[data-install-modal-close]");

  const installCopy = {
    de: {
      title: "Guide zum Startbildschirm hinzufügen",
      ios: "Tippen Sie unten im Browser auf das Teilen-Symbol □↑ und wählen Sie anschließend „Zum Home-Bildschirm“.",
      android: "Öffnen Sie das Browser-Menü ⋮ und wählen Sie „App installieren“ oder „Zum Startbildschirm hinzufügen“.",
      desktop: "Öffnen Sie das Browser-Menü und wählen Sie „ME LIVING installieren“ oder das Installationssymbol in der Adresszeile.",
      installed: "Der ME LIVING Guest Guide ist bereits installiert."
    },
    en: {
      title: "Add the guide to your home screen",
      ios: "Tap the Share icon □↑ in the browser and then select “Add to Home Screen”.",
      android: "Open the browser menu ⋮ and select “Install app” or “Add to Home screen”.",
      desktop: "Open the browser menu and select “Install ME LIVING”, or use the install icon in the address bar.",
      installed: "The ME LIVING Guest Guide is already installed."
    },
    nl: {
      title: "Voeg de gids toe aan uw beginscherm",
      ios: "Tik onderaan in de browser op het deel-symbool □↑ en kies daarna ‘Zet op beginscherm’.",
      android: "Open het browsermenu ⋮ en kies ‘App installeren’ of ‘Toevoegen aan startscherm’.",
      desktop: "Open het browsermenu en kies ‘ME LIVING installeren’, of gebruik het installatiepictogram in de adresbalk.",
      installed: "De ME LIVING Guest Guide is al geïnstalleerd."
    }
  };

  const installText = installCopy[lang] || installCopy.de;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const ua = navigator.userAgent || "";
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);

  const openInstallHelp = (message) => {
    if (!installModal) return;
    if (installModalTitle) installModalTitle.textContent = installText.title;
    if (installModalText) installModalText.textContent = message;
    installModal.hidden = false;
    document.body.classList.add("install-modal-open");
    if (installModalClose) installModalClose.focus();
  };

  const closeInstallHelp = () => {
    if (!installModal) return;
    installModal.hidden = true;
    document.body.classList.remove("install-modal-open");
  };

  installButtons.forEach((button) => {
    // Button should always be visible.
    button.hidden = false;

    button.addEventListener("click", async () => {
      if (isStandalone) {
        openInstallHelp(installText.installed);
        return;
      }

      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === "accepted") {
          deferredPrompt = null;
        }
        return;
      }

      if (isIOS) {
        openInstallHelp(installText.ios);
      } else if (isAndroid) {
        openInstallHelp(installText.android);
      } else {
        openInstallHelp(installText.desktop);
      }
    });
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButtons.forEach((button) => {
      button.hidden = false;
      button.classList.add("install-ready");
    });
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installButtons.forEach((button) => button.classList.remove("install-ready"));
    closeInstallHelp();
  });

  if (installModalClose) {
    installModalClose.addEventListener("click", closeInstallHelp);
  }
  if (installModal) {
    installModal.addEventListener("click", (event) => {
      if (event.target === installModal) closeInstallHelp();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && installModal && !installModal.hidden) {
      closeInstallHelp();
    }
  });


  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../service-worker.js").catch(() => {});
  }
});
