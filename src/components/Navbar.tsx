import { Moon, Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const tabs = [
  { key: 'portfolio', label: '产品案例' },
  { key: 'potential', label: '潜力挖掘器' },
  { key: 'resume', label: '简历生成器' },
  { key: 'hr', label: 'HR 沟通助手' },
  { key: 'match', label: '匹配度分析' },
  { key: 'boost', label: '能力速成' },
];

export default function Navbar({ activeTab, onSelectTab, onOpenSettings, darkMode, onToggleDarkMode }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-paper/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-teal-600 p-2 text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-lg font-semibold text-ink dark:text-slate-100">PhilIntern 哲学实习助手</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">为文科生的实习求职提供结构化支持</div>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`rounded-full px-3 py-2 text-sm transition ${
                activeTab === tab.key
                  ? 'bg-teal-600 text-white dark:bg-teal-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
            aria-label="切换暗色模式"
          >
            <Moon size={16} />
          </button>
          <button
            onClick={onOpenSettings}
            className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
            aria-label="设置"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
