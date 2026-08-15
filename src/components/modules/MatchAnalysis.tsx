import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { callOpenAI } from '../../services/openai';

export default function MatchAnalysis() {
  const [jd, setJd] = useState('');
  const [skills, setSkills] = useState('');
  const [major, setMajor] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const reply = await callOpenAI({
        moduleKey: 'match',
        fields: { jd, skills, major },
      });
      setResult(reply);
    } catch (error) {
      setResult(error instanceof Error ? error.message : '分析失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-2 text-ink dark:text-slate-100">
        <BarChart3 size={18} />
        <div>
          <div className="font-semibold">岗位匹配度分析</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">根据 JD 和现有技能，给出客观的投递建议。</div>
        </div>
      </div>
      <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="粘贴目标岗位 JD" rows={5} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
      <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="列出你已有的能力标签，如：写作、数据分析、沟通、项目管理" rows={4} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
      <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文、经济学）" className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" />
      <button onClick={handleAnalyze} className="mt-3 rounded-full bg-brand-600 px-4 py-2 text-sm text-paper" disabled={loading}>
        {loading ? '分析中…' : '开始匹配度分析'}
      </button>
        <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          {result || '分析结果会在这里呈现。'}
        </div>
    </div>
  );
}
