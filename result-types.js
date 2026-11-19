const resultTypes = document.getElementById("result-types");
const resultSections = [...document.querySelectorAll("main > section[id]")];

function showCategory() {
  const target = document.getElementById(location.hash.slice(1));
  const section = target?.closest("main > section");
  for (const item of resultSections) item.hidden = Boolean(section && item !== section);
  for (const link of resultTypes.querySelectorAll("a")) {
    if (link.hash === "#" + (section?.id || resultTypes.id)) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  if (section && target !== section) target.scrollIntoView();
  else if (section) resultTypes.scrollIntoView();
}
window.addEventListener("hashchange", showCategory);
showCategory();
