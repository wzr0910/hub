import { useEffect, useState } from 'react';
import { History as HistoryIcon, Copy } from 'lucide-react';
import { loadHistory, clearHistory } from '../services/openai';

const MODULE_NAMES: Record<string, string> = {
  potential: '潜力挖掘器',
  resume: '简历生成器',
  hr: 'HR 沟通助手',
  match: '匹配度分析',
  boost: '能力速成',
};

type HistoryItem = { moduleKey: string; text: string; time: number };

export default function HistoryPanel() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  const refresh = () => setItems(loadHistory());

  useEffect(() => {
    refresh();
    window.addEventListener('philintern:history', refresh);
    return () => window.removeEventListener('philintern:history', refresh);
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 剪贴板不可用时静默 */
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="glass-card mt-6 rounded-[2rem] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <HistoryIcon size={16} /> 最近生成（仅保存在本机浏览器）
        </div>
        <button
          onClick={() => {
            clearHistory();
            refresh();
          }}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          清空
        </button>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 6).map((it, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <div className="text-xs text-stone-400">
                {MODULE_NAMES[it.moduleKey] || it.moduleKey} ·{' '}
                {new Date(it.time).toLocaleString('zh-CN')}
              </div>
              <div className="truncate text-sm text-stone-700">
                {it.text
                  .split('\n')
                  .find((l) => l.trim())
                  ?.slice(0, 50) || it.text.slice(0, 50)}
              </div>
            </div>
            <button
              onClick={() => copy(it.text)}
              className="flex shrink-0 items-center gap-1 text-xs text-[#5c4033] hover:underline"
            >
              <Copy size={12} /> {copied ? '已复制' : '复制'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
