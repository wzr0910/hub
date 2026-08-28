import { Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
}

const tabs = [
  { key: 'portfolio', label: '产品案例' },
  { key: 'potential', label: '潜力挖掘器' },
  { key: 'resume', label: '简历生成器' },
  { key: 'hr', label: 'HR 沟通助手' },
  { key: 'match', label: '匹配度分析' },
  { key: 'boost', label: '能力速成' },
];

export default function Navbar({ activeTab, onSelectTab, onOpenSettings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 px-4 pt-3">
      <nav className="glass mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[2rem] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex rounded-full p-2"
            style={{ background: 'rgba(139,157,119,0.18)', color: '#5c4033' }}
          >
            <Sparkles size={18} />
          </span>
          <div>
            <div className="text-lg font-bold text-stone-800">PhilIntern 文科生AI求职助手</div>
            <div className="text-sm text-stone-500">为文科生的实习求职提供结构化支持</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`rounded-full px-3 py-2 text-sm transition-colors duration-300 ${
                activeTab === tab.key ? 'glass-btn-gold' : 'glass-btn'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenSettings} className="glass-icon" aria-label="设置" title="设置">
            <Settings size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}
