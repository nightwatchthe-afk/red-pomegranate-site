for (const container of document.querySelectorAll("[data-org-preview]")) {
  const photo = container.querySelector(".directory-photo, .about-photo");
  const caption = container.querySelector("figcaption");
  const desktop = matchMedia("(min-width:741px)");
  const initial = {src:photo.getAttribute("src"), alt:photo.alt};
  function preview(src, alt) {
    photo.src = src;
    photo.alt = alt;
    if (caption) caption.textContent = alt;
  }
  for (const link of container.querySelectorAll(".org-directory a")) {
    function select() {
      if (desktop.matches) preview(link.querySelector("img").getAttribute("src"), link.dataset.caption);
    }
    link.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") select(); });
    link.addEventListener("focus", select);
  }
  desktop.addEventListener("change", () => preview(initial.src, initial.alt));
}
