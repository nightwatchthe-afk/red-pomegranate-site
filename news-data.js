// category 按内容来源填写：团队推送用 wechat，外部媒体报道及其转载用 press。
// 新闻页置顶：给选中的 press 记录填写 pinnedOrder: 1 至 5（1 为头条）。
// 换一篇时把原来的序号移到新记录；换链接只改该记录的 originalUrl，置顶与完整列表同步。
// 公众号卡片优先使用 originalUrl。留空时可使用下方统一的临时演示链接。
const wechatPreviewUrl = "https://news.buaa.edu.cn/info/1004/69923.htm";
// 接入数据库时，将此函数改为从后端 API 读取相同字段即可。
async function loadNewsEntries() {
  return [
    {
      category: "wechat", season: "2026 年寒假", source: "石榴观察站",
      title: "丝路边疆探文脉，科技赋能谱新篇——北京航空航天大学“红石榴”社会实践队赴新疆开展民族团结实践活动",
      image: "assets/contact/winter-team.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年寒假", source: "石榴观察站",
      title: "PLOG 04 · 西陲寻迹，城蕴同心",
      image: "assets/pushes/winter-plog.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年暑假", source: "石榴观察站",
      title: "石榴向南 · PLOG 06 · 同心援疆，智绘和田",
      image: "assets/pushes/summer-plog.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年暑假", source: "石榴观察站",
      title: "成员介绍", reportTopic: true,
      image: "assets/practice/orchard.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年暑假", source: "石榴观察站",
      title: "校长座谈会纪实", reportTopic: true,
      image: "assets/pushes/meeting.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年暑假", source: "石榴观察站",
      title: "稻香书院宣讲", reportTopic: true,
      image: "assets/pushes/outdoor-talk.webp",
      originalUrl: ""
    },
    {
      category: "wechat", season: "2026 年暑假", source: "石榴观察站",
      title: "赴新疆和田开展民族团结深度实践", reportTopic: true,
      image: "assets/contact/walk.webp",
      originalUrl: ""
    },
    // 每个平台的发布版本单独一条，填写该版本的标题、日期、头图及文章地址。
    {
      category: "press", season: "2026 年暑假", source: "北航新闻网", publishedAt: "2026-09-29",
      title: "北京航空航天大学“红石榴”社会实践队深入南疆开展社会调研服务，在行走中铸牢中华民族共同体意识",
      image: "assets/visit.jpg", originalUrl: "https://news.buaa.edu.cn/info/1004/69923.htm"
    },
    {
      category: "press", season: "2026 年暑假", source: "中国日报网", publishedAt: "2026-09-04", pinnedOrder: 2,
      title: "北京航空航天大学“红石榴”实践队赴新疆阿克苏开展民族团结深度实践",
      image: "assets/press/aksu-workstation.webp", originalUrl: "https://xj.chinadaily.com.cn/a/202609/04/WS6a9a35efe4b09a165c787fe2.html"
    },
    {
      category: "press", season: "2026 年暑假", source: "同心北航", publishedAt: "2026-08-29",
      title: "北京航空航天大学“红石榴”实践队赴新疆阿克苏开展民族团结深度实践",
      image: "assets/press/aksu-field.webp", originalUrl: "https://mp.weixin.qq.com/s/ttgY52GwmEAcODeFxFSDjg"
    },
    {
      category: "press", season: "2026 年暑假", source: "同心北航", publishedAt: "2026-08-29",
      title: "北航“红石榴”实践队赴和田开展深度社会实践",
      image: "assets/contact/walk.webp", originalUrl: "https://mp.weixin.qq.com/s/Ab-EKK3m12aHCjjyUB3s9A"
    },
    {
      category: "press", season: "2026 年暑假", source: "中国新闻网", publishedAt: "2026-08-26", pinnedOrder: 3,
      title: "北航“红石榴”实践队赴和田开展深度社会实践",
      image: "assets/pushes/outdoor-talk.webp", originalUrl: "https://www.xj.chinanews.com.cn/dizhou/2026-08-26/detail-ihfirmti5851565.shtml"
    },
    {
      category: "press", season: "2026 年暑假", source: "中国新闻网", publishedAt: "2026-08-24",
      title: "北京航空航天大学“红石榴”实践队赴新疆阿克苏开展民族团结深度实践",
      image: "assets/press/aksu-exhibition.webp", originalUrl: "https://www.xj.chinanews.com.cn/dizhou/2026-08-24/detail-ihfirmti5848871.shtml"
    },
    {
      category: "press", season: "2026 年暑假", source: "和田县统战", publishedAt: "2026-08-24",
      title: "铸牢中华民族共同体意识丨北航“红石榴”实践队赴和田开展深度社会实践",
      image: "assets/contact/students.webp", originalUrl: "https://mp.weixin.qq.com/s/JE9bYmcKHk0p3Zr2txAFPA"
    },
    {
      category: "press", season: "2026 年暑假", source: "北京青年报客户端", publishedBy: "北航新闻网", publishedAt: "2026-08-24",
      title: "北航“红石榴”实践队赴新疆开展民族团结深度实践",
      image: "assets/practice.jpg", originalUrl: "https://news.buaa.edu.cn/info/1006/69621.htm"
    },
    {
      category: "press", season: "2026 年暑假", source: "和田县零距离", publishedAt: "2026-08-23",
      title: "北航“红石榴”实践队赴和田开展深度社会实践",
      image: "assets/press/hotan-museum.webp", originalUrl: "https://mp.weixin.qq.com/s/_cwOFjPzY6VMaISDTs5WOg"
    },
    {
      category: "press", season: "2026 年暑假", source: "北航软件人", publishedAt: "2026-08-21",
      title: "北京航空航天大学“红石榴”实践队赴新疆阿克苏开展民族团结深度实践",
      image: "assets/press/aksu-market.webp", originalUrl: "https://mp.weixin.qq.com/s/RjSAU9IcWEZXaTcmF62N_g"
    },
    {
      category: "press", season: "2026 年暑假", source: "北京青年报客户端", publishedAt: "2026-08-21",
      title: "北航“红石榴”实践队赴新疆开展民族团结深度实践",
      image: "assets/practice/orchard.webp", originalUrl: "https://app.bjtitle.com/5620/newshow.php?newsid=6774457&typeid=1"
    },
    {
      category: "press", season: "2026 年暑假", source: "北京航空航天大学微信公众号", publishedAt: "2026-08-18",
      title: "校长王云鹏带队赴新疆 深化校地交流合作 推动科教兴疆工作",
      image: "assets/press/xinjiang-exchange.webp", originalUrl: "https://mp.weixin.qq.com/s/CwhwO-jBvN0XNxtKLNIWBA"
    },
    {
      category: "press", season: "2026 年暑假", source: "澎湃新闻 · 澎湃号·政务", publishedAt: "2026-08-18",
      title: "校长王云鹏带队赴新疆 深化校地交流合作 推动科教兴疆工作",
      image: "assets/press/university-visit.webp", originalUrl: "https://www.thepaper.cn/newsDetail_forward_33821417"
    },
    {
      category: "press", season: "2026 年寒假", source: "北京航空航天大学微信公众号", publishedAt: "2026-03-01",
      title: "这张照片，北航学子舍不得删！",
      image: "assets/contact/winter-court.webp", originalUrl: "https://mp.weixin.qq.com/s/9e6QwX6XrtxvAra_v11iGQ"
    },
    {
      category: "press", season: "2026 年寒假", source: "同心北航", publishedAt: "2026-02-15",
      title: "北京航空航天大学“红石榴”实践队赴新疆吐鲁番开展民族团结深度实践",
      image: "assets/press/turpan-institute.webp", originalUrl: "https://mp.weixin.qq.com/s/2xjbaKivdV8gbJZNeQyhFw"
    },
    {
      category: "press", season: "2026 年寒假", source: "石河子共青团", publishedAt: "2026-02-07",
      title: "石榴行迹｜戈壁铸魂承薪火，石榴同心映边疆",
      image: "assets/press/shihezi-visit.webp", originalUrl: "https://mp.weixin.qq.com/s/6LpQqwjImCbctORHMI58lg"
    },
    {
      category: "press", season: "2026 年寒假", source: "北航软件人", publishedAt: "2026-02-02",
      title: "石榴行迹 | 丝路学府传团结薪火，数字引擎载育人新篇——北航“红石榴”社会实践队赴石河子大学座谈 共探民族团结教育新路径",
      image: "assets/press/shihezi-university.webp", originalUrl: "https://mp.weixin.qq.com/s/T1HbeADADILwAf1ZtoRkGQ"
    },
    {
      category: "press", season: "2026 年寒假", source: "可克达拉职业技术学院", publishedAt: "2026-01-29",
      title: "北京航空航天大学师生来学院交流座谈",
      image: "assets/press/kekedala-college.webp", originalUrl: "https://mp.weixin.qq.com/s/pyH6F4xZAW9e7GY0EVNcuw"
    },
    {
      category: "press", season: "2026 年寒假", source: "北航软件人", publishedAt: "2026-01-28",
      title: "石榴行迹｜火洲叩问千年路，石榴花开万里情",
      image: "assets/press/turpan-old-city.webp", originalUrl: "https://mp.weixin.qq.com/s/MT7DddMQ5zlhg0fjzLy3_A"
    },
    {
      category: "press", season: "2026 年寒假", source: "人民日报客户端", publishedAt: "2026-01-27", pinnedOrder: 4,
      title: "北京航空航天大学“红石榴”实践队赴新疆吐鲁番开展民族团结深度实践",
      image: "assets/contact/history.webp", originalUrl: "https://www.peopleapp.com/column/30051309591-500007327415"
    },
    {
      category: "press", season: "2026 年寒假", source: "中国新闻网", publishedAt: "2026-01-26",
      title: "北京航空航天大学“红石榴”实践队赴新疆吐鲁番开展民族团结深度实践",
      image: "assets/press/turpan-visit.webp", originalUrl: "https://www.xj.chinanews.com.cn/dizhou/2026-01-26/detail-ihezhfas0229288.shtml"
    },
    {
      category: "press", season: "2026 年寒假", source: "北航新闻网", publishedAt: "2026-01-26",
      title: "北航携手新疆维吾尔自治区共建昆仑智能装备实验室",
      image: "assets/press/kunlun-lab.webp", originalUrl: "https://news.buaa.edu.cn/info/1002/68088.htm"
    },
    {
      category: "press", season: "2026 年寒假", source: "青年北航", publishedAt: "2026-01-24",
      title: "校长王云鹏看望慰问软件学院寒假社会实践队师生",
      image: "assets/press/winter-roundtable.webp", originalUrl: "https://mp.weixin.qq.com/s/G4MKCuiz1Etxh0_Ur7VH-Q"
    },
    {
      category: "press", season: "2026 年寒假", source: "北航软件人", publishedAt: "2026-01-24",
      title: "队员风采｜石榴结籽，科技铸疆，红石榴实践队成员亮相",
      image: "assets/contact/winter-team.webp", originalUrl: "https://mp.weixin.qq.com/s/PD6YhSuZoq9OUG9Nck5CIg"
    },
    {
      category: "press", season: "2026 年寒假", source: "中国青年网",
      title: "北疆千里行：科技赋能民族团结实践",
      image: "assets/practice/museum.webp", originalUrl: "",
      archivedUrl: "https://xiaoyuan.cycnet.com.cn/s?uid=9359260", unavailableNote: "原文已不可访问"
    },
    {
      category: "press", source: "光明日报客户端", publishedBy: "石榴观察站", publishedAt: "2026-11-07",
      title: "石榴声音 | 《光明日报》专题报道：青春与青春的相逢——北京航空航天大学“红石榴”党建工作站的育人观察",
      image: "assets/press/workstation-team.webp", originalUrl: "https://mp.weixin.qq.com/s/i33nqewWxTi4bGv-kTETQw"
    },
    {
      category: "press", source: "光明日报客户端", publishedBy: "北航新闻网", publishedAt: "2026-11-06",
      title: "青春与青春的相逢——北京航空航天大学“红石榴”党建工作站的育人观察",
      image: "assets/press/workstation-classroom.webp", originalUrl: "https://news.buaa.edu.cn/info/1002/70245.htm"
    },
    {
      category: "press", source: "光明日报客户端", publishedAt: "2026-11-04", pinnedOrder: 1,
      title: "青春与青春的相逢——北京航空航天大学“红石榴”党建工作站的育人观察",
      image: "assets/press/workstation-fieldwork.webp", originalUrl: "https://app.gmdaily.cn/as/opened/n/382e5e24178a4dda91427a48683b0c76"
    },
    {
      category: "press", source: "北航新闻网", publishedAt: "2026-05-11", pinnedOrder: 5,
      title: "北航师生在北京高校铸牢中华民族共同体意识宣讲展示活动中斩获多个奖项",
      image: "assets/talk.jpg", originalUrl: "https://news.buaa.edu.cn/info/1002/68892.htm"
    }
  ];
}
