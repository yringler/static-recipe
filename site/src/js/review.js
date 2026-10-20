/**
 * Side-by-side review of a recipe against its original scan(s).
 * Toggled by the "Compare with original" button; the open state is kept in
 * the URL hash (#review) so a review view can be linked or reloaded.
 */
(function () {
  "use strict";

  const toggle = document.querySelector(".review-toggle");
  const pane = document.getElementById("source-pane");
  if (!toggle || !pane) return;

  const images = Array.from(pane.querySelectorAll(".source-image"));
  const pageButtons = Array.from(pane.querySelectorAll(".source-page-btn"));
  const zoomButton = pane.querySelector(".source-zoom-btn");
  const openLink = pane.querySelector(".source-open-link");
  const closeButton = pane.querySelector(".source-close-btn");

  function setOpen(open) {
    pane.hidden = !open;
    document.body.classList.toggle("is-reviewing", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Hide original" : "Compare with original";
    const hash = open ? "#review" : "";
    if (location.hash !== hash) {
      history.replaceState(null, "", location.pathname + location.search + hash);
    }
  }

  function showPage(index) {
    images.forEach((img, i) => (img.hidden = i !== index));
    pageButtons.forEach((btn, i) => btn.setAttribute("aria-pressed", String(i === index)));
    openLink.href = images[index].src;
  }

  function setZoom(zoomed) {
    pane.classList.toggle("is-zoomed", zoomed);
    zoomButton.setAttribute("aria-pressed", String(zoomed));
  }

  toggle.addEventListener("click", () => setOpen(pane.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  pageButtons.forEach((btn) =>
    btn.addEventListener("click", () => showPage(Number(btn.dataset.page)))
  );
  zoomButton.addEventListener("click", () => setZoom(!pane.classList.contains("is-zoomed")));
  images.forEach((img) =>
    img.addEventListener("click", () => setZoom(!pane.classList.contains("is-zoomed")))
  );

  setOpen(location.hash === "#review");
})();
