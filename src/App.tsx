import { useMemo, useState } from 'react';
import { ArrowRight, Bot, Compass, FileText, Sparkles, Target } from 'lucide-react';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import Portfolio from './components/modules/Portfolio';
import PotentialMiner from './components/modules/PotentialMiner';
import ResumeGenerator from './components/modules/ResumeGenerator';
import HRCommunication from './components/modules/HRCommunication';
import MatchAnalysis from './components/modules/MatchAnalysis';
import CapabilityBooster from './components/modules/CapabilityBooster';

const tabs = {
  portfolio: '产品案例 · Portfolio',
  potential: '潜力挖掘器',
  resume: '多岗位简历生成器',
  hr: 'HR 沟通助手',
  match: '岗位匹配度分析',
  boost: '能力速成与行动清单',
};

// 引导入口：用户一进来先看到的 3 条主路径
const guides = [
  {
    key: 'potential',
    icon: <Compass size={20} />,
    title: '挖掘我的亮点',
    desc: '经历不少，但不知道简历写什么？先让工具帮你梳理。',
  },
  {
    key: 'resume',
    icon: <FileText size={20} />,
    title: '生成一份简历',
    desc: '粘贴岗位 JD，生成一份能直接投递的简历草稿。',
  },
  {
    key: 'match',
    icon: <Target size={20} />,
    title: '看看岗位匹配',
    desc: '不确定自己够不够格？测一下匹配度和差距。',
  },
];

// 每个模块底部的「下一步」指引，形成一条清晰路径
const nextStep: Record<string, { to: string; text: string }> = {
  portfolio: { to: 'potential', text: '想看它怎么用？先从「潜力挖掘器」挖出你的亮点' },
  potential: { to: 'resume', text: '亮点挖好了，下一步：用「简历生成器」生成能投的简历' },
  resume: { to: 'match', text: '简历有了，下一步：用「匹配度分析」看看和岗位的差距' },
  match: { to: 'hr', text: '知道差距了，下一步：用「HR 沟通助手」准备面试话术' },
  hr: { to: 'boost', text: '话术备好了，下一步：用「能力速成」补足差距、制定计划' },
  boost: { to: 'potential', text: '计划有了，回到「潜力挖掘器」继续打磨你的素材' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('potential');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const component = useMemo(() => {
    switch (activeTab) {
      case 'portfolio':
        return <Portfolio />;
      case 'resume':
        return <ResumeGenerator />;
      case 'hr':
        return <HRCommunication />;
      case 'match':
        return <MatchAnalysis />;
      case 'boost':
        return <CapabilityBooster />;
      case 'potential':
      default:
        return <PotentialMiner />;
    }
  }, [activeTab]);

  const go = (key: string) => {
    setActiveTab(key);
    document.getElementById('module-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ns = nextStep[activeTab];

  return (
    <div className="scene">
      <Navbar
        activeTab={activeTab}
        onSelectTab={go}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero：琥珀暖色块，有机风强调色 */}
        <section className="mb-6 rounded-[2rem] bg-[#d4a373] p-6 text-stone-800 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles size={16} /> 哲学系 · AI 实习助手
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">把文科经历，翻译成职场语言</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">
            六个工具，陪你走完从「不知道怎么写简历」到「自信投递」的全过程。先选一个起点：
          </p>
        </section>

        {/* 三张入口卡（与引导区同级，不嵌套在卡片内） */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {guides.map((g) => (
            <button
              key={g.key}
              onClick={() => go(g.key)}
              className="group flex flex-col items-start rounded-[2rem] border border-stone-200 bg-white p-4 text-left shadow-sm transition-colors duration-300 hover:bg-stone-50"
            >
              <span className="inline-flex rounded-2xl border border-stone-200 bg-[#faf6f1] p-2 text-stone-800">
                {g.icon}
              </span>
              <div className="mt-3 font-semibold text-stone-800">{g.title}</div>
              <div className="mt-1 text-xs leading-5 text-stone-500">{g.desc}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#9a6a2f] transition-[gap] duration-300 group-hover:gap-2">
                开始 <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <p className="mb-4 text-center text-xs text-stone-500">或点击顶部菜单，浏览全部 6 个工具。</p>

        {/* 模块区 */}
        <section id="module-area" className="scroll-mt-20">
          <div className="glass mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[2rem] px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-medium text-stone-800">
              <span className="glass-chip text-[#9a6a2f]">当前</span>
              {tabs[activeTab as keyof typeof tabs]}
            </div>
            <div className="text-stone-500">支持中文输入，结果默认以中文输出</div>
          </div>

          {component}

          {/* AI 指引：下一步建议 */}
          {ns && (
            <div className="glass-card mt-6 flex flex-col items-start gap-3 rounded-[2rem] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex rounded-full p-1.5"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
                >
                  <Bot size={16} />
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#9a6a2f]">小菲的建议 · 下一步</div>
                  <div className="text-sm text-stone-600">{ns.text}</div>
                </div>
              </div>
              <button
                onClick={() => go(ns.to)}
                className="glass-btn-gold shrink-0 px-4 py-2 text-sm"
              >
                去 {tabs[ns.to as keyof typeof tabs].split(' ')[0]} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </section>
      </main>
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
