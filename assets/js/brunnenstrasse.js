
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
  }

  const modal = document.querySelector("[data-private-modal]");
  const openButtons = document.querySelectorAll("[data-open-private]");
  const closeButton = document.querySelector("[data-close-private]");

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeButton?.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  openButtons.forEach(button => button.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });
});
