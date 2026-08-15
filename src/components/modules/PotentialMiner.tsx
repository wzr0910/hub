import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { callOpenAI } from '../../services/openai';

export default function PotentialMiner() {
  const [jobTitle, setJobTitle] = useState('');
  const [jd, setJd] = useState('');
  const [major, setMajor] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobTitle || !jd) return;
    setLoading(true);
    try {
      const reply = await callOpenAI({
        moduleKey: 'potential',
        fields: { jobTitle, jd, major },
      });
      setResult(reply);
    } catch (error) {
      setResult(error instanceof Error ? error.message : '分析失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center gap-2 text-ink dark:text-slate-100">
        <Sparkles size={18} />
        <div>
          <div className="font-semibold">潜力挖掘器</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">输入目标职位和 JD，我会基于真实内容引导你挖掘可写进简历的亮点。</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="例如：游戏策划实习生" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文）" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="粘贴 JD 或描述岗位要求" rows={5} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" />
      </div>
      <button onClick={handleSubmit} className="rounded-full bg-ink px-4 py-2 text-sm text-paper" disabled={loading}>
        {loading ? '分析中…' : '开始挖掘'}
      </button>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        {result || '分析结果会显示在这里。'}
      </div>
    </div>
  );
}
