(() => {
  const sections = [
    {label:"首页", href:"#top"},
    {label:"关于我们", items:[["团队简介","#about"],["发展历程","team.html#history"],["团队成员","team.html#members"],["指导教师","team.html#faculty"]]},
    {label:"实践足迹", href:"fieldwork.html", items:[["实践地图","#footprints"],["2026年实践","fieldwork.html"],["历届实践"]]},
    {label:"实践成果", items:[["调研报告","results.html#reports"],["数字作品","results.html#digital"],["荣誉成果","results.html#honors"],["媒体报道","results.html#coverage"]]},
    {label:"最新动态", items:[["公众号推送","#wechat-posts"],["新闻报道","press.html"]]}
  ];
  const header = document.querySelector(".site-header");
  const nav = header.querySelector("nav");
  const inner = header.querySelector(".nav-inner");
  const contact = header.querySelector(".nav-contact");
  const toggle = header.querySelector(".nav-toggle");
  const dialog = header.querySelector("dialog");
  const panel = dialog.querySelector(".panel-content");
  const compact = matchMedia("(max-width: 899px)");
  const home = header.hasAttribute("data-home");
  const address = target => target.startsWith("#") && !home ? "index.html" + target : target;
  header.querySelector(".nav-brand").href = address("#top");
  const topLinks = [];
  const routeGroup = new Map();
  let closeTimer;
  let pinned = null;

  function closeGroups(except) {
    clearTimeout(closeTimer);
    for (const group of nav.querySelectorAll("details[open]")) {
      if (group !== except) group.open = false;
    }
    if (pinned !== except) pinned = null;
  }
  function makeGroup(section, index) {
    const group = document.createElement("details");
    const container = section.href ? document.createElement("div") : group;
    const trigger = document.createElement("summary");
    trigger.textContent = section.label;
    trigger.className = "nav-item";
    const links = document.createElement("ul");
    links.className = "nav-sub";
    links.id = "nav-group-" + index;
    trigger.setAttribute("aria-controls", links.id);
    for (const [label, hash] of section.items) {
      const row = document.createElement("li");
      if (hash) {
        const link = document.createElement("a");
        link.href = address(hash);
        link.textContent = label;
        row.append(link);
        routeGroup.set(hash, index);
      } else {
        const name = document.createElement("span");
        name.textContent = label;
        const pending = document.createElement("small");
        pending.textContent = "待开发";
        row.className = "nav-pending";
        row.append(name, pending);
      }
      links.append(row);
    }
    group.append(trigger, links);
    // Native disclosure supplies Enter, Space and expanded/collapsed semantics.
    trigger.addEventListener("click", event => {
      event.preventDefault();
      const keepOpen = !group.open || (event.detail > 0 && !compact.matches && pinned !== group);
      closeGroups(group);
      group.open = keepOpen;
      pinned = keepOpen ? group : null;
    });
    container.addEventListener("pointerenter", event => {
      if (compact.matches || event.pointerType !== "mouse") return;
      closeGroups(group);
      group.open = true;
    });
    container.addEventListener("pointerleave", () => {
      if (!compact.matches && pinned !== group && !container.contains(document.activeElement))
        closeTimer = setTimeout(() => { group.open = false; }, 180);
    });
    group.addEventListener("focusout", event => {
      if (event.relatedTarget && !group.contains(event.relatedTarget)) closeGroups();
    });
    if (section.href) {
      const primary = document.createElement("a");
      primary.className = "nav-item";
      primary.href = address(section.href);
      primary.textContent = section.label;
      container.className = "nav-split";
      container.append(primary, group);
      trigger.textContent = "";
      trigger.setAttribute("aria-label", section.label + "子菜单");
      topLinks.push(primary);
    } else {
      topLinks.push(trigger);
    }
    return container;
  }
  nav.replaceChildren(...sections.map((section, index) => {
    if (section.items) return makeGroup(section, index);
    const link = document.createElement("a");
    link.className = "nav-item";
    link.href = address(section.href);
    link.textContent = section.label;
    routeGroup.set(section.href, index);
    topLinks.push(link);
    return link;
  }));

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
    if (wasOpen) topLinks[0].focus({preventScroll:true});
  });

  const about = document.getElementById("about");
  const news = document.getElementById("news");
  const pageName = location.pathname.split("/").filter(Boolean).pop() || "index";
  const pageFile = pageName.endsWith(".html") ? pageName : pageName + ".html";
  const pageSections = home ? [] : [...document.querySelectorAll("main section[id]")];
  let currentRoute;
  function syncHeader() {
    let hash = location.hash;
    const line = header.offsetHeight + innerHeight * .25;
    if (!home) {
      let section = pageSections.filter(item => item.getBoundingClientRect().top <= line).pop() || pageSections[0];
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
        const linked = pageSections.find(item => "#" + item.id === location.hash && item.getBoundingClientRect().top < innerHeight);
        section = linked || pageSections.at(-1);
      }
      hash = section && routeGroup.has(pageFile + "#" + section.id) ? pageFile + "#" + section.id : pageFile;
    } else if (news && (news.getBoundingClientRect().top < line ||
      innerHeight + scrollY >= document.documentElement.scrollHeight - 2)) {
      hash = news.querySelector(".news-channels [aria-current]")?.hash || "#wechat-posts";
    } else if (about && about.getBoundingClientRect().top < line) hash = "#about";
    else hash = hash === "#footprints" ? hash : "#top";
    if (currentRoute === hash) return;
    currentRoute = hash;
    topLinks.forEach((link,i) => {
      const active = i === routeGroup.get(hash);
      link.classList.toggle("current", active);
      if (active) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    nav.querySelectorAll("a").forEach(link => {
      if (topLinks.includes(link)) return;
      if (link.getAttribute("href") === address(hash)) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
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
  syncHeader();
})();
