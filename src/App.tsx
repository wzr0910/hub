import { useEffect, useMemo, useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('philintern-dark-mode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('philintern-dark-mode', String(darkMode));
  }, [darkMode]);

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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-paper text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenSettings={() => setSettingsOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-accent to-ink p-6 text-white shadow-md">
          <div className="text-sm uppercase tracking-[0.3em] text-white/80">哲学系实习助手</div>
          <h1 className="mt-2 text-3xl font-semibold">面向文科生的实习求职辅助站</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85">
            这里汇聚了简历素材挖掘、岗位匹配、HR 沟通与能力提升建议，帮助你从“不会写简历”到“能清晰表达自己的价值”。
          </p>
        </section>
          <section className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="font-medium">当前模块：{tabs[activeTab as keyof typeof tabs]}</div>
            <div className="text-slate-600 dark:text-slate-400">支持中文输入，所有结果默认以中文输出。</div>
          </section>
          {component}
        </main>
        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}
