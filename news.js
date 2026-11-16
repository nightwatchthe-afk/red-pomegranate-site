(() => {
  const content = document.getElementById("news-content");
  const status = document.getElementById("news-status");
  const isPress = content.dataset.channel === "press";
  function redirectOldPressLink() {
    if (!isPress && ["#media-reports", "#practice-2026", "#cross-season-report"].includes(location.hash)) {
      location.replace("press.html");
      return true;
    }
    return false;
  }
  if (redirectOldPressLink()) return;
  if (!isPress) window.addEventListener("hashchange", redirectOldPressLink);

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function readingLink(value, category) {
    if (!value) return null;
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
      if (category === "wechat" && (url.hostname !== "mp.weixin.qq.com" ||
          !((url.pathname === "/s" && url.searchParams.has("mid")) || /^\/s\/[\w-]+\/?$/.test(url.pathname)))) return null;
      const link = document.createElement("a");
      link.href = url.href;
      return link;
    } catch {
      return null;
    }
  }

  function wechatCard(record, original) {
    const link = original || readingLink(wechatPreviewUrl);
    const card = link || node("div");
    card.className = "push-card";
    const actionLabel = original ? "阅读微信原文" : link ? "查看示例新闻" : "原文待补";
    if (link) link.setAttribute("aria-label", record.title + "，" + actionLabel);
    if (record.image) {
      const photo = node("img", "push-cover");
      photo.src = record.image;
      photo.alt = "";
      photo.loading = "lazy";
      card.append(photo);
    }
    const body = node("div", "push-body");
    body.append(node("h4", "push-title", record.title));
    if (record.reportTopic && !original) body.append(node("small", "push-note", "报告所列主题"));
    if (link) {
      const reveal = node("div", "push-reveal");
      const clip = node("div", "push-clip");
      const action = node("span", "push-action", actionLabel);
      const arrow = node("span", "", "↗");
      arrow.setAttribute("aria-hidden", "true");
      action.append(arrow);
      clip.append(action);
      reveal.append(clip);
      body.append(reveal);
    } else {
      body.append(node("small", "push-note", actionLabel));
    }
    card.append(node("span", "push-source", record.source), body);
    const item = node("li", "push-item");
    item.append(card);
    return item;
  }

  function articleMeta(record) {
    const meta = node("div", "entry-meta");
    const credit = record.publishedBy ? record.publishedBy + " · 转载自" + record.source : record.source;
    meta.append(node("span", "", credit));
    if (record.publishedAt) {
      const time = node("time", "", record.publishedAt.replaceAll("-", "."));
      time.dateTime = record.publishedAt;
      meta.append(time);
    }
    return meta;
  }

  function articleRow(record, link) {
    const row = node("li", "news-entry");
    const main = link || node("div");
    main.className = "entry-main";
    if (record.image) {
      const photo = node("img", "entry-photo");
      photo.src = record.image;
      photo.alt = "";
      photo.loading = "lazy";
      main.append(photo);
    }
    const body = node("div", "entry-body");
    body.append(articleMeta(record));
    body.append(node("span", "entry-title", record.title));
    if (record.reportTopic && !link) body.append(node("small", "entry-note", "报告所列主题"));
    main.append(body);
    if (link) {
      const arrow = node("span", "entry-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      main.append(arrow);
    } else {
      main.append(node("span", "entry-note", record.unavailableNote || "原文待补"));
    }
    row.append(main);
    return row;
  }

  function renderPinned(records) {
    const section = document.getElementById("press-pinned");
    const list = section.querySelector("ol");
    const slots = new Map();
    for (const record of records) {
      const rank = record.pinnedOrder;
      if (!Number.isInteger(rank) || rank < 1 || rank > 5 || slots.has(rank)) continue;
      const link = readingLink(record.originalUrl);
      if (link) slots.set(rank, {record, link});
    }
    const view = document.createDocumentFragment();
    for (const rank of [...slots.keys()].sort((a,b) => a-b)) {
      const {record, link} = slots.get(rank);
      link.className = "feature-link";
      if (record.image) {
        const photo = node("img", "feature-photo");
        photo.src = record.image;
        photo.alt = "";
        link.append(photo);
      }
      const body = node("div", "feature-copy");
      body.append(articleMeta(record), node("h2", "feature-title", record.title));
      link.append(body);
      const item = node("li");
      item.append(link);
      view.append(item);
    }
    list.replaceChildren(view);
    section.hidden = slots.size === 0;
  }

  function renderChannel(catalog) {
    const category = isPress ? "press" : "wechat";
    const records = catalog.filter(record => record.category === category);
    if (isPress) renderPinned(records);
    const view = document.createDocumentFragment();
    const groups = new Map();
    for (const record of records) {
      const label = record.season || (isPress ? "其他团队报道" : "其他推送");
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push({record, link: readingLink(record.originalUrl, category)});
    }
    for (const [label, entries] of groups) {
      const group = node(label ? "section" : "div", "news-group");
      if (label) {
        const heading = node("div", "season-caption");
        heading.append(node("h3", "season-heading", label));
        if (!isPress && wechatPreviewUrl && entries.some(entry => !entry.link)) {
          heading.append(node("small", "push-season-note", "原文待补的卡片暂链至北航新闻网"));
        }
        group.append(heading);
      }
      const list = node("ul", isPress ? "entry-list" : "push-grid");
      for (const {record, link} of entries) list.append(isPress ? articleRow(record, link) : wechatCard(record, link));
      group.append(list);
      view.append(group);
    }
    if (!records.length) view.append(node("p", "news-empty", "本栏暂无文章。"));
    content.className = isPress ? "press-list" : "season-list";
    content.replaceChildren(view);
    status.textContent = (isPress ? "新闻报道" : "公众号推送") + "，共 " + records.length + " 条";
  }

  content.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    const card = event.target.closest(".push-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", (100 * (event.clientX - bounds.left) / bounds.width) + "%");
    card.style.setProperty("--pointer-y", (100 * (event.clientY - bounds.top) / bounds.height) + "%");
  });
  loadNewsEntries().then(renderChannel).catch(() => {
    content.textContent = "文章列表暂时无法加载，请刷新重试。";
  }).finally(() => content.setAttribute("aria-busy", "false"));
})();
