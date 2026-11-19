(() => {
  const header = document.querySelector(".site-header");
  const nav = header.querySelector("nav");
  const inner = header.querySelector(".nav-inner");
  const contact = header.querySelector(".nav-contact");
  const toggle = header.querySelector(".nav-toggle");
  const dialog = header.querySelector("dialog");
  const panel = dialog.querySelector(".panel-content");
  const compact = matchMedia("(max-width: 899px)");
  const home = header.hasAttribute("data-home");
  const groups = [...nav.querySelectorAll("details")];
  const links = [...nav.querySelectorAll("a")];
  const top = nav.querySelector('a.nav-item');
  const about = document.getElementById("about");
  const news = document.getElementById("news");
  let closeTimer;
  let pinned = null;

  function closeGroups(except) {
    clearTimeout(closeTimer);
    for (const group of nav.querySelectorAll("details[open]")) {
      if (group !== except) group.open = false;
    }
    if (pinned !== except) pinned = null;
  }
  for (const group of groups) {
    const trigger = group.querySelector("summary");
    trigger.addEventListener("click", event => {
      event.preventDefault();
      const open = !group.open || (!compact.matches && event.detail > 0 && pinned !== group);
      closeGroups(group);
      group.open = open;
      pinned = open ? group : null;
    });
    group.addEventListener("pointerenter", event => {
      if (compact.matches || event.pointerType !== "mouse") return;
      closeGroups(group);
      group.open = true;
    });
    group.addEventListener("pointerleave", () => {
      if (!compact.matches && pinned !== group && !group.contains(document.activeElement))
        closeTimer = setTimeout(() => { group.open = false; }, 180);
    });
    group.addEventListener("focusout", event => {
      if (event.relatedTarget && !group.contains(event.relatedTarget)) closeGroups();
    });
  }

  function openPanel() {
    closeGroups();
    panel.append(nav, contact);
    dialog.showModal();
    document.documentElement.classList.add("nav-locked");
    toggle.setAttribute("aria-expanded", "true");
    dialog.querySelector(".nav-close").focus();
  }
  function closePanel(restoreFocus = true) {
    if (!dialog.open) return;
    closeGroups();
    dialog.close();
    inner.insertBefore(nav, toggle);
    inner.insertBefore(contact, toggle);
    document.documentElement.classList.remove("nav-locked");
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus && compact.matches) toggle.focus({preventScroll:true});
  }
  toggle.addEventListener("click", openPanel);
  dialog.querySelector(".nav-close").addEventListener("click", () => closePanel());
  dialog.addEventListener("cancel", event => { event.preventDefault(); closePanel(); });
  dialog.addEventListener("click", event => { if (event.target === dialog) closePanel(); });
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest(".site-header details")) closeGroups();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (dialog.open) {
      event.preventDefault();
      closePanel();
      return;
    }
    const group = nav.querySelector("details[open]");
    if (group) {
      event.preventDefault();
      closeGroups();
      group.querySelector("summary").focus({preventScroll:true});
    }
  });
  compact.addEventListener("change", () => {
    const wasOpen = dialog.open;
    closePanel(false);
    closeGroups();
    if (wasOpen) top.focus({preventScroll:true});
  });

  const pageLink = links.find(link => !link.hash && link.pathname === location.pathname);
  const aboutSummary = nav.querySelector("#org-menu").parentElement.querySelector("summary");
  const wechatLink = links.find(link => link.hash === "#wechat-posts");
  function syncHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 64);
    let current = pageLink;
    if (home) {
      const line = header.offsetHeight + innerHeight * .25;
      if (news.getBoundingClientRect().top < line) current = wechatLink;
      else if (about.getBoundingClientRect().top < line) current = aboutSummary;
      else current = top;
    }
    for (const item of nav.querySelectorAll("a, summary")) {
      const active = current === item;
      const inGroup = item.tagName === "SUMMARY" && current && item.parentElement.contains(current);
      item.classList.toggle("current", Boolean(active || inGroup));
      if (active) item.setAttribute("aria-current", home ? "location" : "page");
      else item.removeAttribute("aria-current");
    }
  }
  header.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    closeGroups();
    const mobileOpen = dialog.open;
    closePanel();
    if (!home || link.pathname !== location.pathname || !link.hash) return;
    if (mobileOpen) {
      const dest = document.getElementById(link.hash.slice(1));
      if (dest && dest !== document.body) {
        if (!dest.hasAttribute("tabindex") && dest.tagName !== "BUTTON") dest.tabIndex = -1;
        dest.focus({preventScroll:true});
      }
    }
  });
  let scheduled = false;
  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; syncHeader(); });
  }
  window.addEventListener("scroll", scheduleSync, {passive:true});
  window.addEventListener("resize", scheduleSync);
  window.addEventListener("hashchange", scheduleSync);
  window.addEventListener("pageshow", scheduleSync);
  header.classList.add("nav-ready");
  syncHeader();
})();
