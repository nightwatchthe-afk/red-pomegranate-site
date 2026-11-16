const atlas = document.querySelector(".atlas");
const xinjiang = document.getElementById("xinjiang");
const regionToggle = xinjiang.querySelector(".hit");
let zoomTimer;
let leaveTimer;

function showFootprints(open) {
  clearTimeout(zoomTimer);
  clearTimeout(leaveTimer);
  atlas.classList.toggle("show-footprints", open);
  regionToggle.setAttribute("aria-expanded", String(open));
}

xinjiang.addEventListener("pointerover", event => {
  if (event.pointerType === "touch") return;
  clearTimeout(leaveTimer);
  clearTimeout(zoomTimer);
  // A visible city name is already a destination. Keep it still under the pointer.
  if (!atlas.classList.contains("show-footprints") && !event.target.closest(".city-link")) {
    zoomTimer = setTimeout(() => showFootprints(true), 140);
  }
});
xinjiang.addEventListener("pointerleave", event => {
  clearTimeout(zoomTimer);
  if (event.pointerType !== "touch" && !xinjiang.contains(document.activeElement)) {
    leaveTimer = setTimeout(() => showFootprints(false), 260);
  }
});
xinjiang.addEventListener("focusout", event => {
  if (!xinjiang.contains(event.relatedTarget)) showFootprints(false);
});
xinjiang.addEventListener("click", event => {
  if (event.target.closest("a")) return;
  if (event.pointerType === "touch" || !matchMedia("(hover:hover)").matches) {
    showFootprints(!atlas.classList.contains("show-footprints"));
  } else {
    showFootprints(true);
  }
});
xinjiang.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    regionToggle.focus({preventScroll:true});
    showFootprints(false);
  }
  if (event.target === regionToggle && (event.key === " " || event.key === "Enter")) {
    event.preventDefault();
    showFootprints(!atlas.classList.contains("show-footprints"));
  }
});
document.addEventListener("pointerdown", event => {
  if (!xinjiang.contains(event.target)) showFootprints(false);
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const waveLayer = atlas.querySelector(".background-waves");
// Broken oval, offset crescents, and a pair of long, wind-drawn crests.
const wavePaths = [
  "M12 30C10 18 32 9 58 11S102 21 101 28 M91 36C75 44 51 44 36 40",
  "M18 29Q48 3 94 23 M30 36Q58 18 84 29",
  "M5 27C23 36 35 16 57 23S88 32 107 20 M42 32Q53 26 68 33"
];
let lastWave = -Infinity;
let lastX = 0, lastY = 0;
let lastShape = -1;

atlas.addEventListener("pointermove", event => {
  if (event.pointerType !== "mouse" || reducedMotion.matches ||
      event.target.closest("#map-surface, .atlas-foot, .atlas-heading, .compass")) return;
  const now = performance.now();
  if (now - lastWave < 280 || Math.hypot(event.clientX-lastX, event.clientY-lastY) < 26) return;
  const bounds = atlas.getBoundingClientRect();
  const shape = lastShape < 0 ? Math.floor(Math.random()*wavePaths.length)
    : (lastShape + 1 + Math.floor(Math.random()*(wavePaths.length-1))) % wavePaths.length;
  const ns = "http://www.w3.org/2000/svg";
  const wave = document.createElementNS(ns, "svg");
  const line = document.createElementNS(ns, "path");
  wave.setAttribute("viewBox", "0 0 112 54");
  wave.style.left = (event.clientX-bounds.left) + "px";
  wave.style.top = (event.clientY-bounds.top) + "px";
  wave.style.width = (76 + Math.random()*32) + "px";
  wave.style.setProperty("--tilt", (Math.random()*48-24) + "deg");
  line.setAttribute("d", wavePaths[shape]);
  wave.append(line);
  waveLayer.append(wave);
  wave.addEventListener("animationend", () => wave.remove(), {once:true});
  lastWave = now;
  lastX = event.clientX;
  lastY = event.clientY;
  lastShape = shape;
}, {passive:true});
reducedMotion.addEventListener("change", () => waveLayer.replaceChildren());

// Follow native scroll in both directions, including jumps from the navigation.
const about = document.getElementById("about");
const introStages = [...about.querySelectorAll(".about-heading, .about-motto, .about-copy, .about-photo")];
about.classList.add("about-staged");
let fadeFrame = 0;
let lastIntroStart = -Infinity;
function updateAtlasFade() {
  fadeFrame = 0;
  const progress = Math.min(1, Math.pow(Math.max(0, window.scrollY / (atlas.offsetHeight * 1.1)), 1.3));
  const revealLine = window.innerHeight - Math.min(48, window.innerHeight * .05);
  const stageTops = introStages.map(stage => stage.getBoundingClientRect().top);
  const beforeIntro = about.getBoundingClientRect().top >= window.innerHeight;
  const fade = progress * progress * (3 - 2 * progress);
  atlas.parentElement.style.setProperty("--exit-fade", fade.toFixed(3));
  atlas.style.setProperty("--map-drift", (-32 * fade).toFixed(2) + "px");
  // A tall desktop photo can enter the viewport before the heading beside it.
  // Keep the reading order, but let a below-fold mobile photo wait for its turn.
  const now = performance.now();
  if (beforeIntro) lastIntroStart = -Infinity;
  for (const [i, stage] of introStages.entries()) {
    if (beforeIntro) {
      stage.classList.remove("in-view");
    } else if (!stage.classList.contains("in-view")) {
      if (stageTops[i] > revealLine) break;
      const gap = stage.matches(".about-motto") ? 480 : stage.matches(".about-copy") ? 760 : 210;
      lastIntroStart = Math.max(now, lastIntroStart + gap);
      stage.style.setProperty("--entry-delay", (lastIntroStart - now) + "ms");
      stage.classList.add("in-view");
    }
  }
}
function scheduleAtlasFade() {
  if (!fadeFrame) fadeFrame = requestAnimationFrame(updateAtlasFade);
}
window.addEventListener("scroll", scheduleAtlasFade, {passive:true});
window.addEventListener("resize", scheduleAtlasFade);
window.addEventListener("pageshow", scheduleAtlasFade);
new ResizeObserver(scheduleAtlasFade).observe(about);
updateAtlasFade();
