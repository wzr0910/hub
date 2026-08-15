import { X } from 'lucide-react';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export default function Settings({ open, onClose }: SettingsProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-paper p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-ink dark:text-slate-100">部署设置</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">本项目为纯静态网页，内置“规则分析引擎”，所有结果都在你的浏览器里实时计算，无需任何密钥、服务端或付费。</div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          本页面为纯静态版本，所有分析由浏览器内置的规则引擎完成（从 JD 提取技能、识别岗位类型、计算匹配度），可部署到任意静态托管平台（如 Vercel / GitHub Pages），无需配置任何环境变量或密钥，也无需付费。
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-slate-300 px-4 py-2 text-sm">关闭</button>
        </div>
      </div>
    </div>
  );
}
