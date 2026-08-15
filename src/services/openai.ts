// ============================================================================
// 真实分析引擎（纯前端规则计算，不调用任何 AI / 网络 / 密钥）
// ----------------------------------------------------------------------------
// 设计目标：所有输出都基于你输入的内容“真实计算”出来，而不是套模板。
//   - 从 JD 中识别岗位要求的硬技能（词库匹配）
//   - 识别岗位类型（产品 / 运营 / 内容 / 市场 / 数据 / 咨询 / 设计 …）
//   - 解析你填写的技能，与 JD 要求做交集计算，得出匹配度
//   - 识别你的专业背景，把文科训练映射到可迁移的职场能力
// 全部运行在浏览器本地，0 成本、0 延迟、可离线使用。
// ============================================================================

export type ModuleKey = 'potential' | 'resume' | 'hr' | 'match' | 'boost';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AnalysisFields {
  jobTitle?: string;
  jd?: string;
  material?: string;
  role?: string;
  company?: string;
  name?: string;
  strengths?: string;
  question?: string;
  skills?: string;
  major?: string;
}

// ---------------------------------------------------------------------------
// 1) 硬技能词库：每个能力有一组触发词，用来在 JD / 文本中“命中”
// ---------------------------------------------------------------------------
interface SkillDef {
  id: string;
  label: string;
  keywords: string[];
}

const SKILLS: SkillDef[] = [
  { id: 'data', label: '数据分析', keywords: ['数据', '数据分析', '统计', '指标', '报表', '可视化', '量化', '数值', '建模', '看板', '漏斗', '归因', 'bi'] },
  { id: 'writing', label: '内容写作', keywords: ['写作', '文案', '内容', '编辑', '撰稿', '公众号', '新媒体', '文章', '软文', '排版', '选题', '校对', '稿'] },
  { id: 'research', label: '用户/需求研究', keywords: ['用户研究', '调研', '访谈', '需求', '用户体验', '用户画像', '同理心', '问卷'] },
  { id: 'comm', label: '沟通协调', keywords: ['沟通', '协调', '对接', '跨部门', '谈判', '表达', '演讲', '汇报', '客户', '商务'] },
  { id: 'ops', label: '运营管理', keywords: ['运营', '增长', '留存', '活跃', '转化', '活动', '社群', '私域', '拉新', '促活', '用户增长'] },
  { id: 'product', label: '产品能力', keywords: ['产品', 'prd', '需求文档', '原型', '产品规划', '功能设计', '迭代', '竞品分析'] },
  { id: 'mkt', label: '市场营销', keywords: ['营销', '品牌', '推广', '投放', '广告', '渠道', '市场', '传播', '曝光', '种草'] },
  { id: 'design', label: '设计能力', keywords: ['设计', 'ui', 'ux', '互动', '视觉', '排版', 'figma', 'ps', '海报', '配图', '审美', '插画'] },
  { id: 'dev', label: '编程开发', keywords: ['开发', '编程', '前端', '后端', '代码', '工程师', 'java', 'python', 'javascript', 'html', 'css', 'react', '全栈', '算法', 'c++', 'go'] },
  { id: 'pm', label: '项目管理', keywords: ['项目管理', '项目推进', '排期', '进度', '统筹', '落地', '跟进', '里程碑', 'owner'] },
  { id: 'eng', label: '英语能力', keywords: ['英语', '英文', '翻译', 'cet', '六级', '雅思', '托福', '英语流利', '读写', 'bilingual'] },
  { id: 'biz', label: '商业分析', keywords: ['商业', '战略', '行业研究', '竞品分析', '商业模式', '市场分析', '咨询', '洞察', '行研'] },
  { id: 'info', label: '信息检索', keywords: ['检索', '调研', '研究', '文献', '资料', '信息整理', '案头', '查资料'] },
  { id: 'team', label: '团队协作/领导力', keywords: ['带领', '组织', '领导', '主持', '负责人', '统筹团队', '带项目'] },
  { id: 'logic', label: '批判性思维/逻辑', keywords: ['逻辑', '批判性', '论证', '思辨', '抽象', '结构化'] },
  { id: 'learn', label: '快速学习', keywords: ['学习', '上手', '自驱', '快速适应', '抗压', '自学'] },
  { id: 'law', label: '法律合规', keywords: ['法律', '合规', '合同', '法务', '法规'] },
  { id: 'finance', label: '财务/会计', keywords: ['财务', '会计', '核算', '预算', '审计', '税务'] },
  { id: 'video', label: '视频/多媒体', keywords: ['视频', '剪辑', '拍摄', '短视频', '直播', '配音', '后期'] },
  { id: 'social', label: '社交媒体', keywords: ['社交媒体', '微博', '小红书', '抖音', '双微', '社媒', 'kol', '粉丝'] },
];

function skillLabel(id: string): string {
  return SKILLS.find((s) => s.id === id)?.label ?? id;
}

// ---------------------------------------------------------------------------
// 2) 岗位类型识别库
// ---------------------------------------------------------------------------
interface JobTypeRule {
  id: string;
  label: string;
  signals: string[];
  topSkills: string[];
}

const JOB_TYPES: JobTypeRule[] = [
  { id: 'product', label: '产品 / 产品运营', signals: ['产品经理', '产品运营', 'prd', '需求文档', '原型', '功能设计', '产品设计', '产品实习', '产品岗', '产品助理'], topSkills: ['product', 'data', 'research'] },
  { id: 'content', label: '内容 / 新媒体运营', signals: ['新媒体', '公众号', '内容运营', '短视频', '文案', '选题', '社区运营', '内容实习', '新媒体实习', '内容策划'], topSkills: ['writing', 'social', 'design', 'video'] },
  { id: 'userops', label: '用户 / 活动运营', signals: ['用户运营', '活动运营', '增长', '社群', '拉新', '留存', '促活', '运营实习', '用户增长'], topSkills: ['ops', 'comm', 'data'] },
  { id: 'mkt', label: '市场 / 品牌营销', signals: ['市场营销', '品牌', '推广', '投放', '广告', '市场部', '传播', '市场实习', '品牌实习', '营销实习', '市场策划'], topSkills: ['mkt', 'writing', 'data'] },
  { id: 'data', label: '数据分析', signals: ['数据分析师', '数据运营', '商业分析', '数据岗', '量化', '数据实习', '数据分析实习', '数据'], topSkills: ['data', 'biz'] },
  { id: 'consult', label: '商业分析 / 战略咨询', signals: ['咨询', '行业研究', '战略', '行研', '商业分析', '洞察', '咨询实习', '商业分析实习'], topSkills: ['biz', 'info', 'data'] },
  { id: 'design', label: '设计', signals: ['设计师', 'ui', 'ux', '视觉设计', '交互设计', '设计实习', 'ui设计', '美工'], topSkills: ['design'] },
  { id: 'dev', label: '技术开发', signals: ['开发工程师', '前端', '后端', '算法', '程序员', '全栈', '研发', '开发实习', '前端实习', '后端实习', '算法实习'], topSkills: ['dev'] },
  { id: 'hr', label: '人力资源 / 行政', signals: ['人力资源', 'hr', '招聘', '培训', '员工关系', '行政', 'hr实习', '人力实习', '招聘实习'], topSkills: ['comm', 'pm'] },
  { id: 'sales', label: '销售 / 商务', signals: ['销售', '商务', 'bd', '客户经理', '渠道拓展', '大客户', '销售实习', '商务实习'], topSkills: ['comm', 'mkt'] },
  { id: 'research', label: '研究 / 调研', signals: ['研究', '调研', '政策研究', '课题', '学术', '研究院', '研究实习', '调研实习'], topSkills: ['info', 'logic', 'writing'] },
  { id: 'ngo', label: '公益 / 综合实习', signals: ['公益', 'ngo', '非盈利', '志愿者', '项目官员'], topSkills: ['pm', 'comm'] },
  { id: 'general', label: '通用 / 综合岗位', signals: [], topSkills: [] },
];

// ---------------------------------------------------------------------------
// 3) 文理科 → 职场可迁移能力映射表
// ---------------------------------------------------------------------------
interface MajorDef {
  keys: string[];
  label: string;
  competencies: string[];
  suggested: string[];
}

const MAJORS: MajorDef[] = [
  { keys: ['哲学'], label: '哲学', competencies: ['批判性思维', '逻辑论证', '概念拆解', '文本分析', '长文写作'], suggested: ['商业分析 / 战略咨询', '内容写作', '产品'] },
  { keys: ['历史'], label: '历史学', competencies: ['信息检索', '因果分析', '长篇写作', '史料考证'], suggested: ['行业研究', '内容写作', '咨询'] },
  { keys: ['中文', '汉语言', '文学'], label: '中文 / 文学', competencies: ['写作', '文本分析', '编辑', '共情沟通', '文化审美'], suggested: ['内容 / 新媒体', '品牌', '编辑出版'] },
  { keys: ['新闻', '传播', '传媒'], label: '新闻 / 传播', competencies: ['采写', '选题', '公共沟通', '多媒体'], suggested: ['新媒体运营', '市场 / 公关', '内容'] },
  { keys: ['社会学'], label: '社会学', competencies: ['田野调研', '访谈', '群体洞察', '基础数据分析'], suggested: ['用户研究', '运营', '咨询'] },
  { keys: ['经济'], label: '经济学', competencies: ['数据敏感', '模型思维', '政策分析', '市场直觉'], suggested: ['商业分析', '数据分析', '金融'] },
  { keys: ['政治', '国关', '国际关系'], label: '政治学 / 国关', competencies: ['政策分析', '论证', '公共沟通'], suggested: ['战略咨询', '公关', '政策研究'] },
  { keys: ['心理'], label: '心理学', competencies: ['用户洞察', '行为分析', '访谈', '实验设计'], suggested: ['用户研究', '产品', 'HR'] },
  { keys: ['外语', '语言', '英语', '翻译'], label: '外语 / 语言', competencies: ['翻译', '跨文化沟通', '信息检索'], suggested: ['翻译', '市场 / 出海', '内容'] },
  { keys: ['法学', '法律'], label: '法学', competencies: ['逻辑', '合规意识', '论证', '文本细读'], suggested: ['法务 / 合规', '咨询', '内容'] },
  { keys: ['艺术', '设计'], label: '艺术 / 设计', competencies: ['审美', '视觉表达', '创意'], suggested: ['设计', '内容', '品牌'] },
  { keys: ['商', '管理', '工商'], label: '商科 / 管理', competencies: ['项目管理', '商业直觉', '沟通'], suggested: ['产品', '运营', '咨询'] },
];

// ---------------------------------------------------------------------------
// 4) 能力差距 → 0 成本行动建议（不花钱）
// ---------------------------------------------------------------------------
const ACTION_PLAN: Record<string, string> = {
  data: '用 Excel 做一份你感兴趣话题的数据透视表 / 图表（B 站搜“Excel 数据透视表 教程”，免费），再写 3 句话结论。',
  writing: '开一个公众号 / Notion 文档，连续写 3 篇你专业相关的短评或书评，积累可展示的内容作品。',
  research: '挑一个你喜欢的品牌 / 行业，写一份 1000 字竞品或行业分析，结构：背景 → 现状 → 问题 → 建议。',
  comm: '主动牵头一件小事（组织一次聚餐、对接一次活动赞助），并把过程写成“如何协调多方达成共识”的复盘。',
  ops: '运营一个 50 人以上的社群 / 小组（班级群、兴趣群都行），记录“拉新 - 活跃 - 转化”的尝试与数据。',
  product: '用 Figma（免费）画一个你常用 App 的功能改版原型，并写一页 PRD：解决什么问题、给谁用、怎么衡量。',
  mkt: '为你喜欢的一个产品，写一版小红书 / 朋友圈推广文案 + 投放思路，说明目标人群和卖点。',
  design: '用 Canva / Figma（免费）做一套 3 张的公众号封面或海报，重点练排版与配色。',
  dev: '跟着免费教程（如 freeCodeCamp）用 HTML/CSS 做一个个人主页，或写 3 个 Python 小脚本处理日常数据。',
  pm: '把你做过的某件事按“目标 - 排期 - 风险 - 结果”拆成项目复盘，体现推进与落地能力。',
  eng: '每天精读 1 篇行业英文报道并摘 5 个表达；或用英语写一段 1 分钟自我介绍录音，反复打磨。',
  biz: '选一家公司，公开资料做“它靠什么赚钱”的商业分析，输出一页纸结论。',
  info: '练“30 分钟搞定一个主题资料”：定关键词 → 多渠道检索 → 输出带出处的要点清单。',
  team: '在小组作业 / 社团里主动担任负责人，记录你如何分工、排期、推动大家按时交付。',
  logic: '把一道你专业里的复杂问题，拆成“定义 → 子问题 → 论证 → 结论”的结构化笔记，作为思维样本。',
  learn: '在简历里准备 1 个“一周自学并产出成果”的例子（比如一周学会剪视频并发布）。',
  law: '读 1 份与你目标行业相关的合同 / 法规要点，写一页“风险与合规注意事项”。',
  finance: '用 Excel 复算一份公开的上市公司简易财报关键指标（营收、毛利、费用率）。',
  video: '用手机 + 免费剪辑软件剪一条 60 秒短视频，主题可以是你专业的趣味科普。',
  social: '运营一个小红书 / 微博账号，围绕一个垂直主题发 5 篇内容，记录阅读与互动数据。',
};

const GENERIC_ACTION = '围绕这项能力，找一个你生活里的小场景做成一件可展示的事，并用“做了什么 + 结果如何”记录下来。';

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------
function detectSkills(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const s of SKILLS) {
    if (s.keywords.some((k) => lower.includes(k.toLowerCase()))) found.push(s.id);
  }
  return found;
}

function recognizeType(title = '', jd = ''): { rule: JobTypeRule; score: number; signals: string[] } {
  const text = `${title} ${jd}`.toLowerCase();
  let best = JOB_TYPES[JOB_TYPES.length - 1]; // general
  let bestScore = 0;
  let bestSignals: string[] = [];
  for (const rule of JOB_TYPES) {
    if (rule.signals.length === 0) continue;
    const signals = rule.signals.filter((s) => text.includes(s.toLowerCase()));
    if (signals.length > bestScore) {
      best = rule;
      bestScore = signals.length;
      bestSignals = signals;
    }
  }
  return { rule: best, score: bestScore, signals: bestSignals.map((s) => s.replace(/\b/g, '')) };
}

function detectMajor(...texts: string[]): MajorDef | null {
  const blob = texts.join(' ');
  for (const m of MAJORS) {
    if (m.keys.some((k) => blob.includes(k))) return m;
  }
  return null;
}

function parseUserSkills(text: string): { ids: Set<string>; raw: string[] } {
  const ids = new Set<string>();
  const raw: string[] = [];
  if (!text) return { ids, raw };
  const tokens = text
    .split(/[，,、；;\n/ \t]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  for (const tok of tokens) {
    const lower = tok.toLowerCase();
    const hit = SKILLS.find((s) => s.label === tok || s.keywords.some((k) => lower.includes(k.toLowerCase())));
    if (hit) ids.add(hit.id);
    else raw.push(tok);
  }
  return { ids, raw };
}

function computeMatch(jdSkills: string[], userIds: Set<string>, userRaw: string[]): { matched: string[]; missing: string[]; score: number | null } {
  if (jdSkills.length === 0) return { matched: [], missing: [], score: null };
  const matched: string[] = [];
  const missing: string[] = [];
  for (const id of jdSkills) {
    const def = SKILLS.find((s) => s.id === id);
    if (!def) {
      matched.push(id);
      continue;
    }
    const hit = userIds.has(id) || userRaw.some((r) => def.keywords.some((k) => r.toLowerCase().includes(k.toLowerCase())));
    (hit ? matched : missing).push(id);
  }
  return {
    matched,
    missing,
    score: Math.round((matched.length / jdSkills.length) * 100),
  };
}

function labels(ids: string[]): string {
  return ids.map(skillLabel).join('、') || '（暂未识别到明确技能）';
}

function listItems(ids: string[]): string {
  if (ids.length === 0) return '• （暂未识别到明确技能要求）';
  return ids.map((id) => `• ${skillLabel(id)}`).join('\n');
}

// ---------------------------------------------------------------------------
// 各模块真实分析
// ---------------------------------------------------------------------------
function buildPotential(f: AnalysisFields): string {
  const jd = (f.jd || '').trim();
  const title = (f.jobTitle || '').trim();
  if (!jd && !title) return '请先在上方填写「岗位名称」和「岗位描述（JD）」，我才能基于真实内容为你挖掘亮点。';

  const { rule, signals } = recognizeType(title, jd);
  const jdSkills = detectSkills(jd);
  const major = detectMajor(f.major || '');
  const focus = jdSkills.length ? jdSkills : rule.topSkills;

  const lines: string[] = [];
  lines.push('【潜力挖掘器 · 真实分析结果】');
  lines.push('');
  lines.push(`岗位类型识别：${rule.label}` + (signals.length ? `（识别依据：JD 中出现「${signals.join('、')}」）` : '（未命中强信号，按通用逻辑处理）'));
  lines.push('');
  lines.push('我从你提供的 JD 中提取出的关键能力要求：');
  lines.push(listItems(jdSkills));
  lines.push('');
  lines.push('下面请你用 STAR 法（情境 - 任务 - 行动 - 结果）逐条回忆经历。针对上面的能力，我为你定制了挖掘问题：');
  lines.push('');

  const prompts = [
    '请回忆一次你「主动解决问题」的经历：当时面对什么情境？你承担了什么任务？做了什么？最后结果怎样？',
    '有没有哪次你用「数据 / 逻辑」说服了别人或做成了决定？哪怕是一次课堂展示、一篇论文的数据引用、一次社团决策。',
    '有没有和「人」打交道的经历：协调过矛盾、推动过合作、服务过用户？具体怎么做的？',
    '有没有一件你「从 0 到 1」做成的小事：发起一个项目、组织一次活动、运营一个账号？你扮演了什么角色？',
  ];
  focus.slice(0, 3).forEach((id, i) => {
    lines.push(`★ 围绕【${skillLabel(id)}】的挖掘问题：`);
    lines.push(prompts[i] || prompts[3]);
    lines.push('');
  });

  if (major) {
    lines.push(`💡 你是${major.label}背景，天然具备${major.competencies.join('、')}。在挖掘时，可以专门回想这些能力在${rule.label}岗位上如何体现——它们往往就是你最被低估、却最该写进简历的亮点。`);
    lines.push('');
  }
  lines.push('把上面的回忆写成「做了什么 + 用了什么能力 + 结果如何」三句话，就是一段能写进简历的亮点。');
  lines.push('');
  lines.push('（说明：以上分析完全基于你输入的 JD 真实计算得出，未调用任何 AI。）');

  return lines.join('\n');
}

function buildResume(f: AnalysisFields): string {
  const jd = (f.jd || '').trim();
  const title = (f.jobTitle || '').trim();
  const material = (f.material || '').trim();
  if (!jd && !title) return '请先填写「岗位名称」和「岗位 JD」，我才能对照你的素材生成简历。';
  if (!material) return '请先在「素材库」粘贴你的经历 / 能力（每段一行），我会自动对照 JD 抽取可写进简历的亮点。';

  const { rule, signals } = recognizeType(title, jd);
  const jdSkills = detectSkills(jd);
  const major = detectMajor(f.major || '', material);
  const items = material.split('\n').map((s) => s.trim()).filter(Boolean);

  // 把素材按 JD 技能归类（一行可对应多个技能）
  const evidenceBySkill: Record<string, string[]> = {};
  for (const id of jdSkills) {
    const def = SKILLS.find((s) => s.id === id)!;
    const matched = items.filter((it) => def.keywords.some((k) => it.toLowerCase().includes(k.toLowerCase())));
    if (matched.length) evidenceBySkill[id] = matched;
  }

  const lines: string[] = [];
  lines.push(`# 简历草稿 · 对标【${title || rule.label}】`);
  lines.push('');
  lines.push('## 求职意向');
  lines.push(`目标岗位：${title || rule.label}` + (signals.length ? `（JD 强信号：${signals.join('、')}）` : ''));
  lines.push('期望城市 / 实习时间：[请补充]');
  lines.push('');
  lines.push('## 教育背景');
  lines.push('[你的学校] · [专业] · [年级 / 学历]　|　GPA / 排名：[请补充]');
  lines.push('');
  lines.push('## 相关经历（由你的素材库对照 JD 自动生成）');

  if (jdSkills.length === 0) {
    lines.push('• （JD 中未识别到明确技能关键词，已直接展示你的素材，建议你对照岗位要求再补充量化结果）');
    items.forEach((it) => lines.push(`• ${it}`));
  } else {
    const used = new Set<string>();
    for (const id of jdSkills) {
      const ev = evidenceBySkill[id];
      if (ev && ev.length) {
        ev.forEach((e) => {
          used.add(e);
          lines.push(`• 【${skillLabel(id)}】${e}`);
        });
      } else {
        lines.push(`• 【${skillLabel(id)}】（待补充）建议补充一段能证明该能力的具体事例，例如：你如何用${skillLabel(id)}解决某个真实问题、结果如何。`);
      }
    }
    const others = items.filter((it) => !used.has(it));
    if (others.length) {
      lines.push('');
      lines.push('## 其他经历 / 补充');
      others.forEach((o) => lines.push(`• ${o}`));
    }
  }
  lines.push('');
  lines.push('## 技能特长（从素材中识别）');
  const matSkills = detectSkills(material);
  lines.push(matSkills.length ? matSkills.map((id) => `• ${skillLabel(id)}`).join('\n') : '• （素材中未识别到标准技能词，请补充你掌握的工具 / 能力，例如 Excel、公众号写作、Python）');
  lines.push('');
  lines.push('## 自我评价');
  if (major) {
    lines.push(`我是${major.label}背景，天然具备${major.competencies.join('、')}等能力，这些在${rule.label}岗位上能直接转化为${jdSkills.map(skillLabel).slice(0, 3).join('、') || '研究、表达与执行'}优势。目标是进入${major.suggested.join(' / ')}方向，已通过上面的经历积累对应证据。`);
  } else {
    lines.push(`我具备${matSkills.map(skillLabel).slice(0, 4).join('、') || '快速学习、沟通与执行'}等能力，能快速上手${rule.label}岗位；简历中已用具体经历佐证，欢迎进一步沟通。`);
  }
  lines.push('');
  lines.push('（说明：以上简历由你输入的素材与 JD 真实比对生成，未调用任何 AI。）');

  return lines.join('\n');
}

function buildHR(f: AnalysisFields): string {
  const role = (f.role || '').trim();
  const company = (f.company || '').trim();
  const name = (f.name || '').trim();
  const strengths = (f.strengths || '').trim();
  const question = (f.question || '').trim();
  if (!role) return '请先填写「目标岗位」，我才能为你生成针对性的 HR 沟通话术。';

  const { rule, signals } = recognizeType(role, '');
  const major = detectMajor(f.major || '', strengths);
  const parsed = parseUserSkills(strengths);
  const strengthLabels = [...parsed.ids].map(skillLabel);
  const strengthText = strengthLabels.length ? strengthLabels.join('、') : strengths || '我的专业训练带来的思维与表达能力';

  const lines: string[] = [];
  lines.push('【HR 沟通助手 · 真实生成结果】');
  lines.push('');

  // 打招呼话术
  const who = name ? `${name}，` : '';
  const comp = company ? `贵司（${company}）` : '贵司';
  lines.push('---- 打招呼话术 ----');
  lines.push(
    `您好，${who}我是[学校][专业]的学生。看到${comp}在招${role}，我特别感兴趣。我擅长的${strengthText}，和岗位要求的${rule.topSkills.map(skillLabel).slice(0, 2).join('、') || '核心能力'}很契合。` +
      (major ? `虽然我是${major.label}背景，但${major.competencies.slice(0, 2).join('、')}的训练让我能快速理解业务、清晰表达方案。` : '我有较强的学习与执行力，能快速上手岗位工作。') +
      '希望能有机会进一步沟通，谢谢！',
  );
  lines.push('');

  // HR 问题回答
  lines.push('---- HR 常见问题回答参考 ----');
  if (question) {
    lines.push(`你提到的问题：${question}`);
    lines.push('');
    const q = question.toLowerCase();
    let kind = 'general';
    if (/(为什么|为何).*(专业|哲学|文科|不对口|跨专业)/.test(q)) kind = 'major';
    else if (/(为什么|为何).*(公司|你们|这个岗位|选我们)/.test(q)) kind = 'company';
    else if (/(缺点|不足|弱点|短板)/.test(q)) kind = 'weakness';
    else if (/(薪资|工资|待遇|期望|薪酬)/.test(q)) kind = 'salary';
    else if (/(自我介绍|介绍自己|说一下你|聊聊你)/.test(q)) kind = 'intro';
    else if (/(加班|抗压|压力)/.test(q)) kind = 'pressure';

    const scaffolds: Record<string, string[]> = {
      major: [
        '核心逻辑：把专业训练转译为岗位需要的能力，而不是解释“为什么学这个”。',
        major ? `话术要点：① 说明${major.label}训练给我的是${major.competencies.slice(0, 2).join('、')}；② 举一个用这些能力做成的事；③ 点出它和${rule.label}的关联。` : '话术要点：① 说明专业训练给我的是逻辑、表达与学习能力；② 举一个用这些能力做成的事；③ 点出它和岗位的关联。',
        '示例：我学的不只是知识，而是“把一个模糊问题拆成清晰问题”的方法——这和岗位要求的分析、表达本质相通；我缺的直接经验可以用学习能力快速补上。',
      ],
      company: ['核心逻辑：证明你了解并认同这家公司，而不是空泛夸奖。', `话术要点：① 说清你观察到的${company || '公司'}的一个特点 / 业务；② 说明你的${strengthText}能在其中发挥作用；③ 表达长期意愿。`, '示例：我关注到贵司在[某业务]上的做法，我认为自己的[能力]能帮上忙，也希望在这个方向上长期成长。'],
      weakness: ['核心逻辑：说一个真实但可控的短板 + 你已经在补。', '话术要点：① 选一个非核心能力的短板；② 说明你用什么方法在改进；③ 不辩解、不假装完美。', '示例：我在[某工具/数据]上还不够熟练，但已经在用免费教程练习，并在[某项目]中实际用起来了。'],
      salary: ['核心逻辑：先表达意愿与价值，再给区间，不抢先报价。', '话术要点：① 表示更看重成长与匹配；② 给一个基于市场行情的区间；③ 留协商空间。', '示例：我更看重岗位本身和成长空间，薪资方面希望参考贵司实习生的统一标准，具体可以再沟通。'],
      intro: ['核心逻辑：用“我是谁 + 我做过什么 + 我为什么适合”三段式。', `话术要点：① 背景：${major ? major.label + '背景' : '在校学生'}；② 亮点：一段最相关的经历；③ 动机：为什么是${role}。`, '示例：我是[背景]，曾[做过什么、结果如何]，因此对[岗位]很感兴趣也较有准备。'],
      pressure: ['核心逻辑：用具体方法证明你能扛事，而不是空说“我能抗压”。', '话术要点：① 说明你常用的拆解压力的方法；② 举一个 deadline 紧仍交付的例子；③ 强调结果。', '示例：我习惯把大任务拆成小节点排期推进，曾在[某次]时间内完成[某事]，结果[如何]。'],
      general: [`核心逻辑：先复述你对${role}的理解，再落到你的可迁移优势。`, `话术要点：① 一句话概括岗位核心；② 用${strengthText}对应；③ 给一个最小证据。`, '示例：我理解这个岗位关键是[核心要求]，而我在[能力]上有过[证据]，可以较快上手。'],
    };
    scaffolds[kind].forEach((s) => lines.push(`• ${s}`));
  } else {
    lines.push('（在「HR 可能问的问题」里填一个问题，我会按问题类型给你对应的回答框架。）');
    lines.push('• 常见类型已覆盖：专业不对口、为什么选我们、缺点、薪资期望、自我介绍、抗压能力。');
  }
  lines.push('');
  lines.push('（说明：以上话术基于你填写的岗位与优势真实生成，未调用任何 AI。）');

  return lines.join('\n');
}

function buildMatch(f: AnalysisFields): string {
  const jd = (f.jd || '').trim();
  const skillsText = (f.skills || '').trim();
  if (!jd) return '请先粘贴目标岗位的 JD，我才能识别要求并和你的技能做匹配。';
  if (!skillsText) return '请在「你已有的能力标签」里列出你的技能（用逗号分隔，例如：写作、数据分析、沟通），我才能计算匹配度。';

  const { rule, signals } = recognizeType('', jd);
  const jdSkills = detectSkills(jd);
  const major = detectMajor(f.major || '', skillsText);
  const parsed = parseUserSkills(skillsText);
  const m = computeMatch(jdSkills, parsed.ids, parsed.raw);

  const lines: string[] = [];
  lines.push('【岗位匹配度分析 · 真实计算结果】');
  lines.push('');
  lines.push(`岗位类型识别：${rule.label}` + (signals.length ? `（依据：${signals.join('、')}）` : ''));
  lines.push('');
  lines.push('---- JD 要求的能力 ----');
  lines.push(listItems(jdSkills));
  lines.push('');
  lines.push('---- 你的能力（已解析） ----');
  lines.push(parsed.ids.size ? [...parsed.ids].map(skillLabel).join('、') : '（未匹配到标准技能词）');
  if (parsed.raw.length) lines.push(`另外你填写的标签：${parsed.raw.join('、')}`);
  lines.push('');

  if (m.score === null) {
    lines.push('⚠️ JD 中未识别到明确的技能关键词，无法计算精确匹配度。建议你补充更具体的 JD（含工具 / 动作词，如“数据分析”“撰写文案”）。');
  } else {
    lines.push(`---- 匹配度 ----`);
    lines.push(`硬性要求匹配度：约 ${m.score}%（已匹配 ${m.matched.length} / ${jdSkills.length} 项）`);
    lines.push('');
    if (m.matched.length) {
      lines.push('✅ 已匹配的能力：');
      lines.push('• ' + m.matched.map(skillLabel).join('\n• '));
      lines.push('');
    }
    if (m.missing.length) {
      lines.push('🔸 主要差距（JD 要求但暂未体现）：');
      lines.push('• ' + m.missing.map(skillLabel).join('\n• '));
      lines.push('');
    }
    // 建议
    let advice = '';
    if (m.score >= 70) advice = '匹配度较高，可直接投递，并在简历 / 沟通中重点突出已匹配的能力证据。';
    else if (m.score >= 40) advice = '匹配度中等：已具备部分核心能力，建议先用小项目补足差距项（见“能力速成”模块），再投递更稳妥。';
    else advice = '匹配度偏低：差距项较多，建议优先补足 1-2 项最关键的差距能力，或优先投递要求更贴近你现状的岗位。';
    lines.push('---- 投递建议 ----');
    lines.push(advice);
    if (major) {
      lines.push('');
      lines.push(`补充：你是${major.label}背景，可迁移能力（${major.competencies.join('、')}）能覆盖部分软性要求，可在简历中显式点出，抵消硬技能差距的观感。`);
    }
  }
  lines.push('');
  lines.push('（说明：以上匹配度为基于词库的真实计算，未调用任何 AI。）');

  return lines.join('\n');
}

function buildBoost(f: AnalysisFields): string {
  const jd = (f.jd || '').trim();
  const skillsText = (f.skills || '').trim();
  if (!jd) return '请先粘贴目标岗位的 JD，我才能找出差距并生成提升计划。';

  const { rule } = recognizeType('', jd);
  const jdSkills = detectSkills(jd);
  const major = detectMajor(f.major || '', skillsText);
  const parsed = parseUserSkills(skillsText);
  const m = computeMatch(jdSkills, parsed.ids, parsed.raw);
  const missing = m.missing.length ? m.missing : rule.topSkills.filter((id) => !parsed.ids.has(id));

  const lines: string[] = [];
  lines.push('【能力速成与行动清单 · 真实生成】');
  lines.push('');
  lines.push(`对标岗位类型：${rule.label}`);
  lines.push('');

  if (missing.length === 0) {
    lines.push('🎉 当前 JD 要求的能力你基本都已具备，无需大量补课。建议把精力放在“做出可展示的作品”和“打磨简历表达”上。');
    lines.push('');
    lines.push('---- 14 天巩固计划 ----');
    lines.push('第 1-3 天：挑 1 个最相关的经历，写成带数据 / 结果的简历亮点。');
    lines.push('第 4-7 天：做 1 件能公开展示的小作品（内容稿 / 分析页 / 原型）。');
    lines.push('第 8-11 天：针对目标公司做 1 份“我为什么适合”的匹配说明。');
    lines.push('第 12-14 天：模拟 1 次 HR 面试问答，录下来回看改进。');
    lines.push('');
    lines.push('（全部为 0 成本自学，无需购买任何课程 / 工具。）');
    return lines.join('\n');
  }

  lines.push('---- 识别出的能力差距 ----');
  missing.forEach((id) => lines.push(`• ${skillLabel(id)}`));
  lines.push('');
  lines.push('---- 针对差距的 0 成本行动（不用花钱）----');
  missing.forEach((id, i) => {
    lines.push(`${i + 1}. 补【${skillLabel(id)}】：${ACTION_PLAN[id] || GENERIC_ACTION}`);
  });
  if (major) {
    lines.push(`${missing.length + 1}. 借力专业背景：你来自${major.label}，天然具备${major.competencies.join('、')}，在作品 / 简历里点明这些可迁移能力，能减少对硬技能差距的顾虑。`);
  }
  lines.push('');

  // 14 天计划：把差距分成两半
  const half = Math.ceil(missing.length / 2);
  const first = missing.slice(0, half);
  const second = missing.slice(half);
  lines.push('---- 14 天快速计划 ----');
  lines.push(`第 1-7 天（攻克：${first.map(skillLabel).join('、') || '基础准备'}）`);
  first.forEach((id, i) => lines.push(`  Day ${i + 1}-${i + 2}：${ACTION_PLAN[id] || GENERIC_ACTION}`));
  lines.push(`第 8-14 天（攻克：${second.map(skillLabel).join('、') || '作品打磨'}）`);
  second.forEach((id, i) => lines.push(`  Day ${8 + i}-${9 + i}：${ACTION_PLAN[id] || GENERIC_ACTION}`));
  lines.push('');
  lines.push('---- 30 天进阶（在 14 天成果上）----');
  lines.push('第 15-21 天：把前两周产出整合成 1 份作品集（Notion / 个人主页，免费）。');
  lines.push('第 22-27 天：针对目标岗位再补 1 项最关键的差距能力，做出第 2 个作品。');
  lines.push('第 28-30 天：用作品集改写简历经历，并模拟 1 次面试。');
  lines.push('');
  lines.push('（说明：以上计划基于 JD 与你现状的真实差距生成，全部 0 成本，未调用任何 AI。）');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 统一入口（保持原调用名 callOpenAI，便于组件最小改动）
// ---------------------------------------------------------------------------
export async function callOpenAI({
  moduleKey,
  fields,
}: {
  moduleKey: ModuleKey;
  fields: AnalysisFields;
}): Promise<string> {
  // 轻微延时，保留“分析中”的加载体验（纯本地计算，实际很快）
  await new Promise((resolve) => setTimeout(resolve, 250));

  switch (moduleKey) {
    case 'potential':
      return buildPotential(fields);
    case 'resume':
      return buildResume(fields);
    case 'hr':
      return buildHR(fields);
    case 'match':
      return buildMatch(fields);
    case 'boost':
      return buildBoost(fields);
    default:
      return '暂不支持该模块。';
  }
}
