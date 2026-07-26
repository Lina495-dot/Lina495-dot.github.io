document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menuBtn = document.getElementById("menuBtn");
  const navlinks = document.getElementById("navlinks");

  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navlinks.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navlinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navlinks.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
});