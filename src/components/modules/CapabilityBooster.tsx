import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { callOpenAI } from '../../services/openai';

export default function CapabilityBooster() {
  const [jd, setJd] = useState('');
  const [skills, setSkills] = useState('');
  const [major, setMajor] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const reply = await callOpenAI({
        moduleKey: 'boost',
        fields: { jd, skills, major },
      });
      setResult(reply);
    } catch (error) {
      setResult(error instanceof Error ? error.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="mb-4 flex items-center gap-2 t-strong">
        <Rocket size={18} />
        <div>
          <div className="font-semibold">能力速成与行动清单</div>
          <div className="text-sm t-weak">根据差距生成 14 天 / 30 天快速提升计划。</div>
        </div>
      </div>
      <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="目标岗位 JD" rows={4} className="w-full glass-input" />
      <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="你当前的技能和资源" rows={4} className="mt-3 w-full glass-input" />
      <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文、经济学）" className="mt-3 w-full glass-input" />
      <button onClick={handleGenerate} className="mt-3 glass-btn-gold px-4 py-2 text-sm" disabled={loading}>
        {loading ? '生成中…' : '生成提升计划'}
      </button>
        <div className="mt-4 whitespace-pre-wrap glass-card p-4 text-sm leading-7 t-body">
          {result || '提升行动清单会显示在这里。'}
        </div>
    </div>
  );
}
