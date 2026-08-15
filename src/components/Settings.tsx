import { X } from 'lucide-react';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export default function Settings({ open, onClose }: SettingsProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-800/40 px-4">
      <div className="glass w-full max-w-md p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-stone-800">部署设置</div>
            <div className="mt-1 text-sm leading-6 text-stone-500">
              本项目为纯静态网页，内置"规则分析引擎"，所有结果都在你的浏览器里实时计算，无需任何密钥、服务端或付费。
            </div>
          </div>
          <button onClick={onClose} className="glass-icon shrink-0" aria-label="关闭">
            <X size={16} />
          </button>
        </div>
        <div className="glass rounded-[2rem] p-4 text-sm leading-7 text-stone-600">
          本页面为纯静态版本，所有分析由浏览器内置的规则引擎完成（从 JD 提取技能、识别岗位类型、计算匹配度），可部署到任意静态托管平台（如 Vercel / GitHub Pages），无需配置任何环境变量或密钥，也无需付费。
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="glass-btn px-4 py-2 text-sm">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
