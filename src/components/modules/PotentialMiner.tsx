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
 <div className="space-y-4 glass-card p-4">
 <div className="flex items-center gap-2 t-strong">
 <Sparkles size={18} />
 <div>
 <div className="font-semibold">潜力挖掘器</div>
 <div className="text-sm t-weak">输入目标职位和 JD，我会基于真实内容引导你挖掘可写进简历的亮点。</div>
 </div>
 </div>
 <div className="grid gap-3 md:grid-cols-2">
 <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="例如：游戏策划实习生" className="glass-input" />
 <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文）" className="glass-input" />
 <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="粘贴 JD 或描述岗位要求" rows={5} className="glass-input md:col-span-2" />
 </div>
 <button onClick={handleSubmit} className="glass-btn-gold px-4 py-2 text-sm" disabled={loading}>
 {loading ? '分析中…' : '开始挖掘'}
 </button>
 <div className="glass-card p-4 whitespace-pre-wrap text-sm leading-7 t-body">
 {result || '分析结果会显示在这里。'}
 </div>
 </div>
 );
}
