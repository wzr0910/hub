import { AlertCircle, ArrowRight, CheckCircle2, Code2, GitBranch, Lightbulb, Layers, Sparkles, Target, Users } from 'lucide-react';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center gap-2 text-ink dark:text-slate-100">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-3 space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50 via-sky-50 to-cyan-50 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:from-teal-950/40 dark:via-purple-950/30 dark:to-pink-950/30">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
          <Sparkles size={18} />
          <span className="text-xs font-medium uppercase tracking-widest">Product Case Study · 产品案例</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl dark:text-slate-100">
          PhilIntern · 文科生求职辅助工具
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
          一个从用户痛点出发、由非工程师借助 AI 编程工具（Vibe Coding）从 0 到 1 落地的网页产品案例。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/60">
            <div className="text-xs text-slate-500 dark:text-slate-400">角色</div>
            <div className="mt-1 text-sm font-medium text-ink dark:text-slate-100">产品负责人 / Vibe Coding 实践者</div>
          </div>
          <div className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/60">
            <div className="text-xs text-slate-500 dark:text-slate-400">时间</div>
            <div className="mt-1 text-sm font-medium text-ink dark:text-slate-100">2026.06 – 至今</div>
          </div>
          <div className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/60">
            <div className="text-xs text-slate-500 dark:text-slate-400">已上线</div>
            <div className="mt-1 text-sm font-medium text-ink dark:text-slate-100">GitHub Pages / CloudStudio</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">Vibe Coding</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">用户研究</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">需求设计</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">从 0 到 1 落地</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">移动端适配</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300">双通道部署</span>
        </div>
      </div>

      {/* 1. 为什么做 */}
      <Section icon={<Target size={18} />} title="1. 为什么要做这个产品">
        <p>
          在和身边哲学、中文、社会学专业的同学聊求职时，发现一个普遍现象：
          <strong className="text-ink dark:text-slate-100"> 不是不努力，是「不知道该怎么把文科经历翻译成职场语言」</strong>。
        </p>
        <p>
          具体表现为三大困境：
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong className="text-ink dark:text-slate-100">JD 读不懂</strong>：互联网岗位描述充斥陌生术语（"用户增长 / 策略运营 / 数据驱动"），不知道到底要什么能力。</li>
          <li><strong className="text-ink dark:text-slate-100">素材翻译难</strong>：明明做了很多事（读书、社团、辩论、写作），但简历上不知道"我有什么可写"。</li>
          <li><strong className="text-ink dark:text-slate-100">面试准备散</strong>：面对 HR 的犀利问题（"你为什么投这个岗""你的优势是什么"），没有结构化准备工具。</li>
        </ul>
        <p>
          市面上的求职产品多面向计算机/商科背景，缺少对人文专业的「能力映射」。于是有了做这个产品的动机。
        </p>
      </Section>

      {/* 2. 用户与痛点 */}
      <Section icon={<Users size={18} />} title="2. 用户与痛点">
        <p>
          <strong className="text-ink dark:text-slate-100">目标用户</strong>：哲学、中文、历史、社会学等人文专业的本科在校生，准备找第一份或第二份实习。
        </p>
        <p>
          <strong className="text-ink dark:text-slate-100">需求来源</strong>：
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>与身边同学的日常交流，观察大家求职时的共同卡点</li>
          <li>复盘自己过往求职经历中遇到的真实问题</li>
          <li>参考文科生求职的普遍讨论（社群、经验帖等公开信息）</li>
        </ul>
        <p>
          <strong className="text-ink dark:text-slate-100">核心痛点（按普遍程度梳理，数据为示意）</strong>：
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>不知道 JD 里的"黑话"到底在要求什么（最普遍）</li>
          <li>经历写不进简历，因为不会"翻译"</li>
          <li>面试没有针对性准备</li>
          <li>不确定自己够不够格投某岗位</li>
          <li>差距大但不知道怎么补</li>
        </ol>
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          💡 说明：本案例基于个人求职观察与公开经验整理，上述痛点排序为示意性归纳，非严格统计结果。
        </p>
      </Section>

      {/* 3. 需求梳理 */}
      <Section icon={<Layers size={18} />} title="3. 需求梳理：从痛点拆出 5 类核心需求">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">用户痛点</th>
                <th className="px-3 py-2 text-left font-medium">对应需求</th>
                <th className="px-3 py-2 text-left font-medium">产品模块</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td className="px-3 py-2">JD 读不懂</td><td className="px-3 py-2">把岗位要求拆成具体能力清单</td><td className="px-3 py-2 font-medium">潜力挖掘器</td></tr>
              <tr><td className="px-3 py-2">素材翻译难</td><td className="px-3 py-2">从经历中找到可写进简历的亮点</td><td className="px-3 py-2 font-medium">简历生成器</td></tr>
              <tr><td className="px-3 py-2">面试没底</td><td className="px-3 py-2">提前准备 HR 常见问题的回答</td><td className="px-3 py-2 font-medium">HR 沟通助手</td></tr>
              <tr><td className="px-3 py-2">不知够不够格</td><td className="px-3 py-2">评估自己与岗位的匹配度</td><td className="px-3 py-2 font-medium">匹配度分析</td></tr>
              <tr><td className="px-3 py-2">差距大不会补</td><td className="px-3 py-2">给出可执行的能力提升清单</td><td className="px-3 py-2 font-medium">能力速成</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          设计原则：<strong>不堆功能，每个模块只解决一个具体问题</strong>，降低使用门槛。
        </p>
      </Section>

      {/* 4. 产品设计 */}
      <Section icon={<Sparkles size={18} />} title="4. 产品设计：5 大功能模块">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: '潜力挖掘器',
              pain: '不知道简历写什么',
              logic: '输入 JD → 引擎识别岗位类型与关键能力 → 用 STAR 法则引导用户回忆经历',
            },
            {
              name: '简历生成器',
              pain: '简历不会针对岗位改',
              logic: '输入 JD + 素材库 → 引擎按技能维度匹配素材 → 生成结构化简历草稿',
            },
            {
              name: 'HR 沟通助手',
              pain: '面试不知道怎么答',
              logic: '输入岗位 + HR 常见问题 → 结合文科专业映射给出参考话术',
            },
            {
              name: '匹配度分析',
              pain: '不知道够不够格',
              logic: '计算 JD 要求的技能集与自身技能集的交集，给出匹配度与差距清单',
            },
            {
              name: '能力速成',
              pain: '差距大怎么补',
              logic: '基于差距按优先级生成可执行的行动清单（含免费学习资源）',
            },
          ].map((m) => (
            <div key={m.name} className="rounded-2xl border border-slate-200 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="font-semibold text-ink dark:text-slate-100">{m.name}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">痛点：{m.pain}</div>
              <div className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{m.logic}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. 实现路径 */}
      <Section icon={<Code2 size={18} />} title="5. 实现路径：Vibe Coding 实践">
        <p>
          作为非工程师，借助 AI 编程工具独立完成了从 0 到 1 的落地。完整路径：
        </p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            <strong className="text-ink dark:text-slate-100">需求拆解 → 文档化</strong>：将产品想法转化为可执行的功能规格（输入字段、输出结构、模块边界）
          </li>
          <li>
            <strong className="text-ink dark:text-slate-100">AI 协作开发</strong>：用 AI 编程工具实现前端逻辑、UI 组件、响应式布局。负责<strong>提需求、验收、修细节</strong>
          </li>
          <li>
            <strong className="text-ink dark:text-slate-100">工程化问题自己解决</strong>：遇到构建路径（构建白屏）、移动端适配（横向溢出）、部署报错等问题，独立排查修复
          </li>
          <li>
            <strong className="text-ink dark:text-slate-100">上线部署</strong>：完成 GitHub Pages + CloudStudio 双通道部署，确保任何时候都能访问（GitHub 慢时有备用）
          </li>
          <li>
            <strong className="text-ink dark:text-slate-100">质量验证</strong>：用无头浏览器（Headless Edge + CDP）实测 5 个模块在不同输入下的真实计算结果；验证手机端无横向溢出
          </li>
        </ol>
        <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
          💡 Vibe Coding 不是"让 AI 写代码"，而是<strong>人能定义清楚要什么、AI 来实现、人来验收</strong>。这套流程可复用于任何小型工具类产品。
        </p>
      </Section>

      {/* 6. 迭代历程 */}
      <Section icon={<GitBranch size={18} />} title="6. 迭代历程">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <ol className="space-y-2 text-xs leading-6">
            <li><strong className="text-ink dark:text-slate-100">v1.0（2026.06）</strong> · 上线首个版本：5 大模块雏形，使用前端 mock 模板生成结果</li>
            <li><strong className="text-ink dark:text-slate-100">v1.1（2026.07）</strong> · 修复部署白屏问题（构建路径冲突 + 部署平台 rewrite 规则）</li>
            <li><strong className="text-ink dark:text-slate-100">v1.2（2026.08）</strong> · 用纯前端规则引擎替换 mock，输出<strong>随用户输入真实变化</strong>的结果</li>
            <li><strong className="text-ink dark:text-slate-100">v1.3（2026.08）</strong> · 深色模式适配、移动端横向溢出修复、增加"专业/背景"输入字段</li>
            <li><strong className="text-ink dark:text-slate-100">v1.4（本版本）</strong> · 增加"产品思考"案例页，让产品本身成为作品集</li>
          </ol>
        </div>
      </Section>

      {/* 7. 复盘 */}
      <Section icon={<CheckCircle2 size={18} />} title="7. 复盘：做得好的与待改进的">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={14} /> 做得好的
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-6">
              <li>从痛点出发，产品定位清晰（不堆功能）</li>
              <li>单人借助 AI 工具实现产品落地，验证 Vibe Coding 可行性</li>
              <li>双通道部署确保任何时候都能访问</li>
              <li>规则引擎让结果随输入真实变化，避免"假 AI"质疑</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <AlertCircle size={14} /> 待改进的
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-6">
              <li>缺少用户数据埋点，不知道哪个模块用得多</li>
              <li>文案仍偏工程师视角，部分提示对文科生不够友好</li>
              <li>没有用户登录体系，无法沉淀个人素材库</li>
              <li>移动端体验仍可继续打磨（小屏输入框适配）</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 8. 下一步 */}
      <Section icon={<Lightbulb size={18} />} title="8. 下一步计划">
        <ul className="list-disc space-y-1 pl-6">
          <li>增加"AI 模拟面试"模块（基于真实 JD 出题与反馈）</li>
          <li>接入轻量用户系统（localStorage 即可），支持素材沉淀</li>
          <li>扩展岗位类型识别（当前 12 类，目标覆盖 20+ 类）</li>
          <li>做用户埋点，驱动数据化迭代</li>
        </ul>
      </Section>

      {/* Footer CTA */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50 p-5 text-center shadow-sm sm:p-6 dark:border-slate-800 dark:from-slate-900 dark:to-teal-950/40">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          以上是 PhilIntern 的产品思考。完整可访问版本：
        </p>
        <a
          href="https://wzr0910.github.io/hub/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-paper transition hover:bg-slate-800 dark:bg-accent dark:text-slate-950 dark:hover:bg-teal-300"
        >
          打开 PhilIntern <ArrowRight size={16} />
        </a>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          本页作为面试时的"产品案例"参考，配合简历中的项目描述使用。
        </p>
      </div>
    </div>
  );
}