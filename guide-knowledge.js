// Each topic pairs example questions with a published answer and its actual reading destination.
const shixiaoliuGuide = (() => {
  const trail = "fieldwork.html#";
  const topics = [
    ["places", "我们去过哪些地方", "走过哪些城市 实践足迹 去过哪里 去了哪儿 路线 地图 地点有哪些 八个地方 新疆哪几站",
      "我们在新疆记录了八个地方。寒假走访石河子、吐鲁番、伊宁市和可克达拉市，暑假到了乌鲁木齐、阿拉尔、阿克苏和和田。你想先看哪一站？", trail+"winter"],
    ["winter", "看寒假实践记录", "寒假有哪些活动 寒假去了哪里 冬天做了什么 冬季行程 寒假实践",
      "寒假，我们在石河子记录老军垦的口述，在吐鲁番走访坎儿井和社区，又到伊犁追寻各族群众同修一渠的历史。", trail+"winter"],
    ["summer", "看暑假实践记录", "暑假去了哪里 夏天有哪些活动 暑期行程 暑期社会实践 暑假做了什么",
      "2026 年 8 月，来自 13 个学院的 26 名本硕博学子赴新疆实践。我们走进高校、果园和社区，记录南疆的产业、生态与生活。",trail+"summer"],
    ["film", "看暑期总结视频", "视频在哪 暑期影片 夏天拍的片子 录的片子 拍的片子 纪录片 看短片 播放暑假总结片 实践回顾视频 片长",
      "暑期总结视频长 1 分 28 秒，收在 2026 年暑假实践记录里。打开后点封面就能播放。",trail+"summer-film"],
    ["shihezi", "石河子实践记录", "石河子 老军垦 兵团 军垦博物馆 口述史 创业记忆",
      "在石河子，我们走进兵团军垦博物馆和社区，听老军垦讲创业往事，也和石河子大学师生聊了怎样把这些故事带进课堂。",trail+"shihezi"],
    ["turpan", "吐鲁番实践记录", "吐鲁番 坎儿井 地下引水 荣耀之家 壁画 文书 火洲",
      "在吐鲁番，我们沿坎儿井了解地下引水工程，在新城西门村与居民围坐交谈，也走进吐鲁番学研究院了解壁画复原和出土文书识别。",trail+"turpan"],
    ["yining", "伊宁市实践记录", "伊宁 伊犁 伊犁师范大学 湟渠 修渠",
      "在伊犁师范大学，我们和师生交流戍边故事与数字绘本，也探讨怎样用数字模型记录湟渠。",trail+"yining"],
    ["kekedala", "可克达拉实践记录", "可克达拉 可职院 数字绘本",
      "在可克达拉职业技术学院，我们向师生展示了红色故事数字绘本，一起讨论如何把戍边故事带进实践教学。",trail+"kekedala"],
    ["urumqi", "乌鲁木齐实践记录", "乌鲁木齐 新疆大学 高校走访",
      "在新疆大学，我们与当地师生交流，了解校园里各民族学生的交流活动和民族团结教育实践。",trail+"urumqi"],
    ["aral", "阿拉尔实践记录", "阿拉尔 塔里木大学 沙漠之门 沙漠边缘",
      "我们参观了塔里木大学校史馆，和校方讨论实践共建，还去沙漠之门观察了沙漠边缘的生态环境。",trail+"aral"],
    ["aksu", "阿克苏实践记录", "阿克苏 苹果 果园 红旗坡 品种 种植 种果树 果农 果树 溯源 柯柯牙 防护林 治沙",
      "在阿克苏红旗坡，我们向果农了解品种更新和种植管理，又走访企业，追踪苹果的分级、加工和品牌溯源。在柯柯牙纪念馆，我们还了解了果园背后的治沙造林史。",trail+"aksu"],
    ["hotan", "和田实践记录", "和田 稻香村 庭院经济 和田博物馆 村庄故事 一户一业态",
      "在和田，我们走进稻香村，了解居民如何把庭院经营成小产业；也参观了和田博物馆，和当地单位讨论用数字影像记录村庄故事。",trail+"hotan"],
    ["team", "认识红石榴", "你们是谁 实践队简介 团队介绍 北航是哪个学校 石榴结籽 科技铸疆 口号 团队特色",
      "我们是北京航空航天大学红石榴实践队，口号是“石榴结籽，科技铸疆”。队员们把田野调查和数字技术结合起来，记录新疆各族群众共同生活的故事。","index.html#about"],
    ["history","看团队发展历程","什么时候成立 哪一年成立 工作室 历史 发展历程",
      "2023 年，北航软件学院分团委牵头成立红石榴工作室。实践队从边疆采集故事，宣讲团再把一线见闻带回校园。","team.html#history"],
    ["members","了解团队成员","有多少人 几个学院 多少名队员 专业 人数 成员 分工 组成",
      "寒假队伍有来自 8 个学院的 19 名同学，分为调研、技术、宣传三个组。暑期有来自 13 个学院的 26 名本硕博学子。","team.html#members"],
    ["faculty","查看指导教师","指导老师 指导教师 谁带队 带队老师 教师名单",
      "寒假由高宁、盛律指导，李慧、刘泽京带队。暑期由邓攀、盛律指导，李慧、谢文婧带队。","team.html#faculty"],
    ["reports","看调研报告","报告 咨政 建议 研究成果 调研报告 产业链建议 农文旅",
      "团队的报告涉及实践育人、阿克苏林果产业数字化与农文旅融合，也记录了社区服务和和田庭院经济。","results.html#reports"],
    ["digital","看数字作品","数字作品 互动游戏 吉祥物 石小榴是谁 动画 重走戍边路 一颗苹果的故事",
      "石小榴就是我，是从队徽发展而来的吉祥物。团队还把戍边经历做成互动作品《重走戍边路》，用果园的一线素材制作了《一颗苹果的故事》。","results.html#digital"],
    ["awards","查看荣誉成果","拿过什么奖 奖项 荣誉 获奖 一等奖 挑战杯",
      "官网收录了寒假社会观察实践计划一等奖、宣讲团的两个精品奖项，以及“红脉数基”项目的创新创业成果。","results.html#honors"],
    ["press","查看新闻报道","媒体 报纸 新闻 报道 转载 新闻报道 哪些媒体",
      "这里收录了各家媒体发布的实践报道，点文章标题就能阅读相应版本。","press.html"],
    ["posts","看公众号推送","公众号推送 PLOG 实践推文 微信文章 石榴观察站发了什么",
      "团队公众号叫“石榴观察站”。官网按寒暑假整理了推送，有正式原文的卡片会显示“阅读微信原文”。","index.html#wechat-posts"],
    ["contact","联系实践队","联系方式 电子邮箱 电子信 写信 邮件 怎么联系 合作 投稿 联系你们 发邮件",
      "团队邮箱是 buaahongshiliu@163.com。可以写信聊实践合作，也可以通过“联系我们”找到公众号。","contact.html#contact"],
    ["qr","看公众号二维码","公众号叫什么 如何关注 扫码 二维码 微信号",
      "我们的公众号叫“石榴观察站”，打开二维码，用微信扫一扫或长按识别就能关注。","assets/contact/wechat.png"]
  ].map(([id,label,terms,answer,href]) => ({id,label,terms:terms.split(" "),answer,href}));
  const byId = new Map(topics.map(topic => [topic.id,topic]));
  const stops = topics.filter(topic => topic.href === trail + topic.id && !["winter","summer"].includes(topic.id));
  const normalize = text => text.toLowerCase().replace(/[\p{P}\p{Z}]/gu,"");
  const grams = text => new Set(Array.from({length:Math.max(0,text.length-1)},(_,i)=>text.slice(i,i+2)));
  const examples = topics.map(topic => ({
    topic, samples:[topic.label,...topic.terms].map(sample=>normalize(sample))
  }));
  function score(query, sample) {
    if (query.includes(sample)) return 1 + Math.min(sample.length,8)/8;
    const a=grams(query), b=grams(sample);
    let hits=0;
    for (const word of b) if (a.has(word)) hits++;
    return hits / Math.sqrt(a.size*b.size || 1);
  }
  // A compact Chinese Model2Vec vocabulary is loaded only when the visitor opens the guide.
  const size=128;
  let semanticIndex;
  async function buildIndex() {
    const [terms,bytes]=await Promise.all(["terms.json","vectors.bin"].map(async file=>{
      const response=await fetch("assets/guide/"+file);
      if (!response.ok) throw new Error("guide index unavailable");
      return file.endsWith(".json")?response.json():response.arrayBuffer();
    }));
    const rows=new Map(terms.map((term,i)=>[term,i]));
    const vectors=new Int8Array(bytes);
    if (rows.size*size!==vectors.length) throw new Error("invalid guide index");
    function embed(text) {
      const out=new Float32Array(size);
      for (let at=0;at<text.length;) {
        let length=Math.min(8,text.length-at);
        let row;
        while(length>0) {
          row=rows.get(text.slice(at,at+length));
          if (row!==undefined) break;
          length--;
        }
        at+=Math.max(1,length);
        if (row!==undefined) for(let d=0;d<size;d++) out[d]+=vectors[row*size+d];
      }
      const norm=Math.hypot(...out) || 1;
      return out.map(x=>x/norm);
    }
    const documents=examples.map(({topic,samples})=>({topic,vectors:[...samples,topic.terms.join(" ")].map(embed)}));
    return question=>{
      const query=embed(question);
      const ranked=documents.map(item=>({
        topic:item.topic,
        score:Math.max(...item.vectors.map(v=>v.reduce((sum,x,i)=>sum+x*query[i],0)))
      })).sort((a,b)=>b.score-a.score);
      return ranked[0].score>.68 && ranked[0].score-ranked[1].score>.045 ? ranked[0].topic : null;
    };
  }
  function warmup() {
    if (!semanticIndex) semanticIndex=buildIndex().catch(()=>null);
    return semanticIndex;
  }
  const action = topic => ({label:topic.label,href:topic.href});
  async function answer(question, previous, articles) {
    const q=normalize(question);
    const places=stops.filter(stop=>stop.terms.some(term=>q.includes(term)));
    const prior=byId.get(previous);
    if (/招新|怎么加入|报名|招募|下一次|明年|下一季|下一站|电话号码|手机号/.test(q))
      return {text:"这项安排或联系方式在已公开的队伍资料中还没有说明。你可以发邮件到 buaahongshiliu@163.com 向实践队确认。",links:[action(byId.get("contact"))]};
    if (/寒假|寒期|冬季/.test(q) && /视频|影片|短片/.test(q))
      return {text:"寒假已经有图文实践记录。官网目前可以播放的是暑期总结视频。",links:["winter","film"].map(id=>action(byId.get(id)))};
    if (/报道|媒体|新闻|转载/.test(q)) {
      const wanted=places.length ? places : (prior && stops.includes(prior) && /那里|那边|相关|这站/.test(q) ? [prior] : []);
      const season=/寒假|冬季/.test(q)?"寒假":/暑假|暑期/.test(q)?"暑假":"";
      const sources=articles.filter(e=>q.includes(e.source)).map(e=>e.source);
      const found=articles.filter(e=>e.category==="press" && /^https?:\/\//.test(e.originalUrl)
        && (!wanted.length || wanted.some(stop=>stop.terms.some(term=>e.title.includes(term))))
        && (!season || e.season?.includes(season)) && (!sources.length || sources.includes(e.source)));
      const links=found.slice(0,3).map(e=>({label:(e.publishedBy || e.source)+" · "+e.title,href:e.originalUrl}));
      return {id:wanted[0]?.id || "press",text:links.length?"这些报道可以直接打开阅读。":"目前没有找到符合这个条件的报道，可以查看新闻目录。",links:[...links,action(byId.get("press"))]};
    }
    if (/你好|您好|^嗨$/.test(q) && q.length<7)
      return {text:"你好，我是石小榴。想先去哪里看看？也可以问我关于队员、成果或实践视频的问题。",links:["places","film"].map(id=>action(byId.get(id)))};
    const ranked=examples.map(({topic,samples})=>({topic,weight:Math.max(...samples.map(sample=>score(q,sample)))})).sort((a,b)=>b.weight-a.weight);
    const lexical=ranked[0];
    const model=lexical.weight<1 ? await warmup() : null;
    let best=lexical.weight>=1 ? lexical.topic : model?.(q);
    if (!best && lexical.weight>=.46) best=lexical.topic;
    if (/视频|影片|总结片/.test(q)) best=byId.get("film");
    else if (/多少人|几个人|多少名|几个学院|队伍规模/.test(q)) best=byId.get("members");
    else if (places.length && !/作品|建议|报告|动画/.test(q)) best=places[0];
    else if (/哪些地方|哪些城市|哪几个城市|去了哪里|去过哪|哪几站|哪几个地方/.test(q))
      best=byId.get(/暑期|暑假/.test(q)?"summer":/寒假/.test(q)?"winter":"places");
    if (!best && prior && /那里|那一站|这一站|具体呢|详细|怎么去看/.test(q)) best=prior;
    if (!best) return {text:"我在公开的队伍资料里还没找到这个问题的答案。可以换个地点或活动名称问我，或直接联系实践队。",links:["places","contact"].map(id=>action(byId.get(id)))};
    if (places.length>1 && stops.includes(best)) return {id:best.id,text:places.map(s=>s.answer).join("\n"),links:places.map(action)};
    const links=best.id==="places"?stops.map(action):[action(best)];
    return {id:best.id,text:best.answer,links};
  }
  return {answer,byId,warmup};
})();
