import { useState } from 'react';
import { Copy, MessageCircle } from 'lucide-react';
import { callOpenAI } from '../../services/openai';
import { copyTextToClipboard } from '../../utils/export';

export default function HRCommunication() {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [strengths, setStrengths] = useState('');
  const [question, setQuestion] = useState('');
  const [major, setMajor] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const reply = await callOpenAI({
        moduleKey: 'hr',
        fields: { role, company, name, strengths, question, major },
      });
      setResult(reply);
    } catch (error) {
      setResult(error instanceof Error ? error.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await copyTextToClipboard(result);
    alert('内容已复制到剪贴板');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-2 text-ink dark:text-slate-100">
        <MessageCircle size={18} />
        <div>
          <div className="font-semibold">HR 沟通助手</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">生成打招呼话术与 HR 常见问题回答参考。</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="目标岗位" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="公司名称" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的姓名" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <input value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="1-2 个核心优势" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="HR 可能问的问题" rows={4} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" />
        <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文）" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" />
      </div>
      <button onClick={handleGenerate} className="mt-3 rounded-full bg-brand-600 px-4 py-2 text-sm text-paper" disabled={loading}>
        {loading ? '生成中…' : '生成话术'}
      </button>
        <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <div className="mb-2 flex justify-end">
          <button onClick={handleCopy} className="rounded-full border border-slate-300 p-2 text-sm" title="复制内容">
            <Copy size={14} />
          </button>
        </div>
        {result || '生成结果会展示在这里。'}
      </div>
    </div>
  );
}
