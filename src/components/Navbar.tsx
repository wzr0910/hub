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
    <header className="sticky top-0 z-30 px-4 pt-3">
      <nav className="glass-card mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-3xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex rounded-full p-2"
            style={{ background: 'var(--gold-bg)', color: 'var(--gold-text)' }}
          >
            <Sparkles size={18} />
          </span>
          <div>
            <div className="text-lg font-semibold t-strong">PhilIntern 哲学实习助手</div>
            <div className="text-sm t-weak">为文科生的实习求职提供结构化支持</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`rounded-2xl px-3 py-2 text-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === tab.key ? 'glass-btn-gold' : 'glass-btn'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="glass-icon"
            aria-label="切换深色 / 浅色模式"
            title={darkMode ? '切到浅色玻璃' : '切到深墨夜景'}
          >
            <Moon size={16} />
          </button>
          <button onClick={onOpenSettings} className="glass-icon" aria-label="设置" title="设置">
            <Settings size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}
