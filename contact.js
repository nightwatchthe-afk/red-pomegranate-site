(() => {
  const gallery = document.querySelector(".gallery-scroll");
  const stage = gallery.querySelector(".gallery-stage");
  const plane = gallery.querySelector(".wall-plane");
  const letter = document.querySelector(".letter-content");
  const motion = document.getElementById("wall-motion");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const photos = [
    "winter-court", "orchard", "history", "walk", "together", "workshop",
    "oasis", "winter-team", "discussion", "market", "listening", "students",
    "classroom", "canal", "exhibition"
  ];
  const columns = [
    { start: 2, duration: 52, phase: -11 }, { start: 7, duration: 44, phase: -21 },
    { start: 14, duration: 56, phase: -36 }, { start: 10, duration: 48, phase: -22 },
    { start: 4, duration: 58, phase: -29 }, { start: 0, duration: 46, phase: -15 }
  ];
  for (const {start, duration, phase} of columns) {
    const column = document.createElement("div");
    column.className = "wall-column";
    column.style.setProperty("--duration", duration + "s");
    column.style.setProperty("--phase", phase + "s");
    const track = document.createElement("div");
    track.className = "wall-track";
    const sequence = document.createElement("div");
    sequence.className = "wall-sequence";
    for (let offset = 0; offset < 11; offset++) {
      const tile = document.createElement("div");
      tile.className = "wall-tile";
      const img = document.createElement("img");
      img.alt = "";
      img.draggable = false;
      img.src = "assets/contact/" + photos[(start + offset) % photos.length] + ".webp";
      tile.append(img);
      sequence.append(tile);
    }
    track.append(sequence, sequence.cloneNode(true));
    column.append(track);
    plane.append(column);
  }
  stage.classList.add("wall-ready");
  motion.hidden = false;
  motion.addEventListener("click", () => {
    const paused = stage.toggleAttribute("data-paused");
    motion.textContent = paused ? "继续播放" : "暂停照片墙";
    motion.setAttribute("aria-pressed", String(paused));
  });

  const clamp = value => Math.max(0, Math.min(1, value));
  const revealAnimations = [];
  let timelineEnd = 0;
  function addReveal(target, frames, delay, duration, easing) {
    const animation = target.animate(frames, {delay, duration, easing, fill:"both"});
    animation.pause();
    revealAnimations.push(animation);
    timelineEnd = Math.max(timelineEnd, delay + duration);
  }
  function drawRule(parent, placement, delay, duration) {
    const line = document.createElement("i");
    line.className = "float-rule " + placement;
    line.setAttribute("aria-hidden", "true");
    parent.append(line);
    addReveal(line, [{transform:"scaleX(0)"}, {transform:"scaleX(1)"}], delay, duration, "ease-out");
  }
  const copy = document.getElementById("copy-email");
  const email = document.getElementById("team-email");
  copy.hidden = false;
  if (typeof letter.animate === "function") {
    for (const element of letter.querySelectorAll("[data-float-at]")) {
      const start = Number(element.dataset.floatAt);
      const text = element.textContent;
      // Keep one continuous accessible string, including for paragraphs and the mailto link.
      const readable = document.createElement("span");
      readable.className = "sr float-readable";
      readable.textContent = text;
      const visual = document.createElement("span");
      visual.className = "float-text";
      visual.setAttribute("aria-hidden", "true");
      element.replaceChildren(readable, visual);
      const characters = Array.from(text);
      const isTitle = element.id === "contact-title";
      const stagger = Math.min(isTitle ? 50 : 25, 180 / Math.max(1, characters.length - 1));
      characters.forEach((character, index) => {
        const glyph = document.createElement("span");
        glyph.className = "float-glyph";
        glyph.textContent = character;
        visual.append(glyph);
        addReveal(glyph, [
          {opacity:0, transform:isTitle ? "translateY(120%) scale(.7,2.3)" : "translateY(72%) scale(.92,1.24)"},
          {opacity:1, transform:"none"}
        ], start + index * stagger, isTitle ? 460 : 290, "cubic-bezier(.52,-.12,.28,1.22)");
      });
      if (element.matches("#copy-email, #open-qr")) drawRule(visual, "action-rule", start + 100, 225);
    }
    drawRule(letter.querySelector(".addresses"), "top-rule", 260, 430);
    const rows = letter.querySelectorAll(".address");
    rows.forEach((row, index) => drawRule(row, "bottom-rule", 485 + index * 275, 335));
    letter.classList.add("float-ready");
  }
  let lastFloatProgress;
  let frame = 0;
  function updateScene() {
    frame = 0;
    const bounds = gallery.getBoundingClientRect();
    const letterBounds = letter.getBoundingClientRect();
    const distance = Math.max(1, bounds.height - stage.offsetHeight);
    const progress = clamp(-bounds.top / distance);
    stage.style.setProperty("--blackout", progress.toFixed(3));
    stage.toggleAttribute("data-away", progress >= 1 || document.hidden);
    // A short letter on a tall screen must finish revealing by the time it is centered.
    const revealDistance = Math.min(innerHeight * .68, innerHeight * .58 + letterBounds.height / 2 - 2);
    const floatProgress = reducedMotion.matches ? 1 : clamp((innerHeight * 1.08 - letterBounds.top) / revealDistance);
    if (floatProgress !== lastFloatProgress) {
      for (const animation of revealAnimations) animation.currentTime = floatProgress * timelineEnd;
      lastFloatProgress = floatProgress;
    }
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateScene);
  }
  window.addEventListener("scroll", scheduleUpdate, {passive:true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  document.addEventListener("visibilitychange", scheduleUpdate);
  reducedMotion.addEventListener("change", scheduleUpdate);
  updateScene();

  const status = document.querySelector(".copy-status");
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email.getAttribute("href").slice("mailto:".length));
      status.textContent = "邮箱地址已复制";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(email.querySelector(".float-text") || email);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "已选中邮箱地址，可手动复制";
    }
  });
  const dialog = document.getElementById("qr-dialog");
  document.getElementById("open-qr").addEventListener("click", event => {
    if (typeof dialog.showModal !== "function" || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    dialog.showModal();
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
})();
