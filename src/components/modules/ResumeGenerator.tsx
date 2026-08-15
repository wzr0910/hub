import { useState } from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import { callOpenAI } from '../../services/openai';
import { copyTextToClipboard, downloadTextFile } from '../../utils/export';

export default function ResumeGenerator() {
  const [jobTitle, setJobTitle] = useState('');
  const [jd, setJd] = useState('');
  const [material, setMaterial] = useState('');
  const [major, setMajor] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const reply = await callOpenAI({
        moduleKey: 'resume',
        fields: { jobTitle, jd, material, major },
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
    alert('简历内容已复制到剪贴板');
  };

  const handleDownload = () => {
    if (!result) return;
    downloadTextFile(`${jobTitle || 'resume'}.md`, result);
  };

  return (
    <div className="grid gap-4 glass-card p-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 t-strong">
          <FileText size={18} />
          <div>
            <div className="font-semibold">多岗位简历生成器</div>
            <div className="text-sm t-weak">输入岗位和素材库，生成可直接投递的简历版本。</div>
          </div>
        </div>
        <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="岗位名称" className="w-full glass-input" />
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="岗位JD" rows={4} className="w-full glass-input" />
        <textarea value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="可粘贴材料库，包含经历、能力、项目" rows={5} className="w-full glass-input" />
        <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="你的专业/背景（选填，如：哲学、中文、经济学）" className="w-full glass-input" />
        <button onClick={handleGenerate} className="glass-btn-gold px-4 py-2 text-sm" disabled={loading}>
          {loading ? '生成中…' : '生成简历版本'}
        </button>
      </div>
      <div className="glass-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold t-strong">简历预览</div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="glass-icon" title="复制内容">
              <Copy size={14} />
            </button>
            <button onClick={handleDownload} className="glass-icon" title="下载为 .md">
              <Download size={14} />
            </button>
          </div>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-7 t-body">{result || '生成结果会显示在这里。'}</div>
      </div>
    </div>
  );
}
