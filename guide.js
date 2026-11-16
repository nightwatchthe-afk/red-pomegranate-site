(() => {
  const guide=shixiaoliuGuide;
  const root=document.createElement("aside");
  root.className="shiliu-guide";
  root.setAttribute("aria-label","石小榴实践向导");
  root.innerHTML=`
    <button class="pet-launch" type="button" aria-label="问问石小榴，打开实践向导" aria-haspopup="dialog" aria-controls="guide-panel" aria-expanded="false">
      <span class="pet-stage"><span class="pet-shadow"></span><span class="pet-turn">
        <svg class="pet-figure" viewBox="0 0 326 360" aria-hidden="true" focusable="false">
          <defs>
            <image id="guide-sprite" href="assets/shixiaoliu.webp" width="326" height="360"/>
            <clipPath id="guide-arm-cut"><path d="M24 157H73Q83 164 90 181Q99 202 125 216L113 244H24Z"/></clipPath>
            <clipPath id="guide-body-cut"><path d="M0 0H326V360H0V243H107Q108 230 118 216Q95 203 87 181Q83 167 72 159H0Z"/></clipPath>
          </defs>
          <g class="pet-arm"><use href="#guide-sprite" clip-path="url(#guide-arm-cut)"/></g>
          <use href="#guide-sprite" clip-path="url(#guide-body-cut)"/>
        </svg>
      </span></span>
      <span class="pet-caption" aria-hidden="true">问问石小榴</span>
    </button>
    <dialog id="guide-panel" aria-labelledby="guide-title">
      <div class="guide-heading"><span class="guide-portrait"><img src="assets/shixiaoliu.webp" alt=""></span>
        <div><h2 id="guide-title">石小榴</h2><p>AI 实践向导</p></div>
        <button class="guide-close" type="button" aria-label="收起石小榴">×</button>
      </div>
      <div class="guide-scroll"><div class="guide-intro"><h3>你好，我是石小榴。</h3><p class="guide-greeting"></p><div class="guide-quick"></div></div>
        <div class="guide-thread" role="log" aria-label="和石小榴的对话" aria-live="polite" aria-relevant="additions"></div>
      </div>
      <form class="guide-form"><label for="guide-question" class="sr">向石小榴提问</label>
        <input id="guide-question" type="text" maxlength="400" autocomplete="off" placeholder="问问实践队…" required>
        <button aria-label="发送问题" type="submit" disabled>↑</button>
      </form>
    </dialog>`;
  document.body.append(root);
  const $=selector=>root.querySelector(selector);
  const launch=$(".pet-launch"), panel=$("#guide-panel"), input=$("#guide-question");
  const quick=$(".guide-quick"),thread=$(".guide-thread"),scroll=$(".guide-scroll");
  const close=$(".guide-close"),submit=$(".guide-form button");
  let lastTopic="";
  let pending=false;
  const pageName=location.pathname.split("/").filter(Boolean).pop() || "index";
  const localFile=pageName.endsWith(".html") ? pageName : pageName + ".html";

  function linkTo(label,href) {
    const a=document.createElement("a");
    a.href=href;
    a.textContent=label;
    return a;
  }
  function questionButton(text) {
    const b=document.createElement("button");
    b.type="button";
    b.textContent=text;
    b.addEventListener("click",()=>ask(text));
    return b;
  }
  function welcome() {
    const news=document.querySelector("#news");
    const inNews=localFile==="index.html" && (["#wechat-posts","#media-reports","#news"].includes(location.hash) ||
      (news && news.getBoundingClientRect().top<innerHeight/2));
    const content={
      "press.html":["想找哪座城市的报道？告诉我地名就好。","places","posts"],
      "fieldwork.html":["你可以选一站读实践记录，也可以直接看暑期回顾。","winter","film"],
      "team.html":["想了解团队里的同学和老师？我来带路。","members","faculty"],
      "results.html":["这里有田野调查写成的报告，也有队员做的数字作品。","reports","digital"],
      "contact.html":["想和我们聊实践合作？这里能找到团队邮箱和公众号。","contact","qr"]
    };
    const [greeting,first,second]=inNews?["想找哪一站的报道？可以直接告诉我地名。","press","posts"]:
      content[localFile] || ["从新疆的八个地方，选一站和我一起出发吧。","places","film"];
    $(".guide-greeting").textContent=greeting;
    const firstTopic=guide.byId.get(first);
    const primary=first==="places" ? questionButton("我们去过哪些地方？") :
      linkTo(firstTopic.label,firstTopic.href);
    const other=guide.byId.get(second);
    quick.replaceChildren(primary,linkTo(other.label,other.href));
  }
  function openGuide() {
    guide.warmup();
    welcome();
    panel.showModal();
    launch.setAttribute("aria-expanded","true");
    close.focus({preventScroll:true});
  }
  launch.addEventListener("click",openGuide);
  close.addEventListener("click",()=>panel.close());
  panel.addEventListener("close",()=>{
    launch.setAttribute("aria-expanded","false");
    launch.focus({preventScroll:true});
  });
  panel.addEventListener("click",event=>{
    if (event.target===panel) {
      const r=panel.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) panel.close();
    }
    if (event.target.closest("a")) panel.close();
  });
  const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
  const stage=$(".pet-stage");
  const tilt=event=>{
    if (event.pointerType!=="mouse" || reducedMotion.matches) return;
    const rect=stage.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5, y=(event.clientY-rect.top)/rect.height-.5;
    launch.style.setProperty("--turn",(x*23)+"deg");
    launch.style.setProperty("--nod",(-y*16)+"deg");
    launch.style.setProperty("--lean",(x*7)+"px");
  };
  launch.addEventListener("pointerenter",event=>{
    if (event.pointerType!=="mouse") return;
    launch.dataset.greet=event.clientX < stage.getBoundingClientRect().left + stage.offsetWidth/2 ? "left" : "right";
    tilt(event);
  });
  launch.addEventListener("pointermove",tilt);
  launch.addEventListener("pointerleave",()=>{
    delete launch.dataset.greet;
    ["--turn","--nod","--lean"].forEach(name=>launch.style.removeProperty(name));
  });
  function message(kind,text,links=[]) {
    const bubble=document.createElement("div");
    bubble.className="guide-message "+kind;
    const p=document.createElement("p");
    p.textContent=text;
    bubble.append(p);
    if (links.length) {
      const list=document.createElement("div");
      list.className="guide-links";
      list.append(...links.map(item=>linkTo(item.label,item.href)));
      bubble.append(list);
    }
    thread.append(bubble);
    scroll.scrollTop=scroll.scrollHeight;
  }
  let articlePromise;
  function articles() {
    if (typeof loadNewsEntries==="function") return loadNewsEntries();
    if (!articlePromise) articlePromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="news-data.js?v=pinned-press";
      script.onload=()=>resolve(loadNewsEntries());
      script.onerror=()=>{script.remove();reject(new Error("news"));};
      document.head.append(script);
    }).catch(()=>{articlePromise=undefined;return [];});
    return articlePromise;
  }
  function updateSend() { submit.disabled=pending || !input.value.trim(); }
  async function ask(raw) {
    const question=raw.trim();
    if (!question || pending) return;
    pending=true;
    input.value="";
    updateSend();
    message("from-visitor",question);
    try {
      const items=/新闻|报道|转载|媒体/.test(question)?await articles():[];
      const reply=await guide.answer(question,lastTopic,items);
      lastTopic=reply.id || "";
      message("from-pet",reply.text,reply.links);
    } catch {
      message("from-pet","这次没能读取资料。你也可以直接查看实践记录。",[{label:"打开实践足迹",href:"fieldwork.html"}]);
    } finally { pending=false;updateSend(); }
  }
  input.addEventListener("input",updateSend);
  input.addEventListener("keydown",event=>{
    if(event.key==="Enter" && (event.isComposing || event.keyCode===229)) event.preventDefault();
  });
  $(".guide-form").addEventListener("submit",event=>{event.preventDefault();ask(input.value);});
})();
