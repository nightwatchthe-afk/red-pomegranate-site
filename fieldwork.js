(() => {
  const journal = document.querySelector(".field-journal");
  const segments = [...journal.querySelectorAll(".trail-step, .trail-season:not(:last-child) .trail-source")];
  const seasons = document.querySelectorAll(".field-journal .contents a");
  let current;
  let scheduled = false;
  function updateTrail() {
    scheduled = false;
    const bounds = segments.map(segment => segment.getBoundingClientRect());
    const viewport = document.documentElement.clientHeight;
    const remaining = Math.max(0, document.documentElement.scrollHeight - viewport - scrollY);
    // As the footer approaches, carry the reading line down to the final stop.
    const readingLine = viewport * .48 + Math.max(0, viewport * .52 - remaining);
    let next;
    segments.forEach((segment, index) => {
      const {top, height} = bounds[index];
      const fraction = Math.min(1, Math.max(0, (readingLine - top) / Math.max(height, 1)));
      const fill = Number((fraction * 100).toFixed(3)) + "%";
      if (segment.style.getPropertyValue("--trail-fill") !== fill) {
        segment.style.setProperty("--trail-fill", fill);
      }
      if (segment.classList.contains("trail-step")) {
        const reached = top <= readingLine;
        segment.classList.toggle("is-reached", reached);
        if (reached) next = segment;
      }
    });
    if (next === current) return;
    current?.classList.remove("is-current");
    current = next;
    current?.classList.add("is-current");
    const season = current?.closest(".trail-season").id;
    for (const link of seasons) {
      if (link.hash === "#" + season) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateTrail);
  }
  window.addEventListener("scroll", scheduleUpdate, {passive:true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(journal);
  updateTrail();

  const film = document.querySelector(".season-film");
  const video = film.querySelector("video");
  const play = film.querySelector(".film-play");
  const fallback = film.querySelector(".film-fallback");
  function showFallback() {
    play.hidden = true;
    video.controls = true;
    fallback.hidden = false;
  }
  video.controls = false;
  play.hidden = false;
  video.addEventListener("error", showFallback);
  play.addEventListener("click", () => {
    play.hidden = true;
    video.controls = true;
    video.focus({preventScroll:true});
    video.play().catch(showFallback);
  });
})();
