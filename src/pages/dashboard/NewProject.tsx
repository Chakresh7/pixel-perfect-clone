import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, CheckCircle, UploadCloud, FileText, X, Info, ArrowLeft, ArrowRight, Loader2,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ─── Types ─── */
interface UploadedFile { name: string; size: number; id: string; }

const steps = ['Basics', 'Pipeline', 'Data'] as const;

/* ─── Progress Indicator ─── */
const Progress = ({ current }: { current: number }) => (
  <div className="flex items-center w-full max-w-[360px] mx-auto mb-12">
    {steps.map((label, i) => (
      <div key={label} className="flex items-center flex-1 last:flex-initial">
        <div className="flex flex-col items-center">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold border-2 transition-colors',
            i < current ? 'bg-brand-green border-brand-green text-white' :
            i === current ? 'border-brand-blue text-brand-blue bg-transparent' :
            'border-dark-border-subtle text-[hsl(240,4%,24%)] bg-transparent'
          )}>
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={cn(
            'text-[10px] font-mono mt-2',
            i < current ? 'text-brand-green' : i === current ? 'text-[hsl(215,20%,65%)]' : 'text-[hsl(240,4%,24%)]'
          )}>{label}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={cn('flex-1 h-px mx-3 mt-[-18px]', i < current ? 'bg-brand-green' : 'bg-dark-border-subtle')} />
        )}
      </div>
    ))}
  </div>
);

/* ─── Option Card ─── */
const OptionCard = ({
  letter, name, desc, selected, extra, onClick,
}: {
  letter: string; name: string; desc: string; selected: boolean; extra?: React.ReactNode; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'relative text-left bg-[hsl(240,15%,4%)] border rounded-lg px-4 py-3.5 transition-all',
      selected ? 'border-brand-blue bg-brand-blue/[0.04]' : 'border-dark-border-subtle hover:border-brand-blue/40 hover:bg-brand-blue/[0.02]'
    )}
  >
    {selected && <CheckCircle className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-brand-blue" />}
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 bg-dark-surface border border-dark-border rounded-md font-mono font-bold text-xs text-[hsl(215,20%,42%)]">{letter}</div>
      <div>
        <p className={cn('text-[13px] font-medium', selected ? 'text-[hsl(210,40%,98%)]' : 'text-[hsl(215,20%,65%)]')}>{name}</p>
        <p className="text-[11px] text-[hsl(240,4%,24%)] mt-0.5">{desc}</p>
        {extra}
      </div>
    </div>
  </button>
);

/* ─── Shared styles ─── */
const labelCls = 'text-[13px] font-medium text-[hsl(215,20%,65%)] mb-1.5 block';
const inputCls = 'w-full h-11 px-4 text-[15px] font-mono bg-dark-surface border border-dark-border rounded-md text-[hsl(210,40%,98%)] placeholder:text-[hsl(240,4%,24%)] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/10 transition-colors';
const sectionLabel = 'text-xs uppercase font-mono text-[hsl(215,14%,35%)] tracking-widest';

const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* ─── Main Component ─── */
const NewProject = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  // Step 2
  const [vectorStore, setVectorStore] = useState('Pinecone');
  const [llmProvider, setLlmProvider] = useState('OpenAI');
  const [llmModel, setLlmModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');

  // Step 3
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const validateName = (v: string) => {
    if (v.length < 2) return 'Name must be at least 2 characters';
    if (v.length > 60) return 'Name must be 60 characters or less';
    if (!/^[a-zA-Z0-9-]+$/.test(v)) return 'Only letters, numbers, and hyphens';
    return '';
  };

  const goTo = (next: number) => {
    setAnimDir(next > step ? 'right' : 'left');
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 150);
  };

  const handleStep1Continue = () => {
    const err = validateName(name);
    if (err) { setNameError(err); setNameTouched(true); return; }
    goTo(1);
  };

  const handleStep2Continue = () => {
    if (llmProvider !== 'Ollama' && !apiKey) {
      toast.error('API key is required');
      return;
    }
    goTo(2);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    const valid = dropped.filter((f) => /\.(pdf|docx|json|txt|md)$/i.test(f.name));
    if (valid.length < dropped.length) toast.error('Some files have unsupported formats');
    setFiles((prev) => [...prev, ...valid.map((f) => ({ name: f.name, size: f.size, id: Math.random().toString(36).slice(2) }))]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected.map((f) => ({ name: f.name, size: f.size, id: Math.random().toString(36).slice(2) }))]);
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
      toast.success(`Project '${slug}' created successfully`);
      setTimeout(() => navigate(`/dashboard/projects/proj_1/documents`), 800);
    }, 1500);
  };

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h1 className="text-2xl font-bold text-[hsl(210,40%,98%)] tracking-tight">Name your project</h1>
            <p className="text-sm text-[hsl(215,20%,42%)] mt-2 leading-relaxed">Give your project a name. Each project is an isolated pipeline with its own config.</p>
            <div className="mt-8">
              <label className={labelCls}>Project name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); if (nameTouched) setNameError(validateName(e.target.value)); }}
                onBlur={() => { setNameTouched(true); setNameError(validateName(name)); }}
                placeholder="e.g. customer-support-bot"
                className={cn(inputCls, nameError && nameTouched && 'border-brand-red focus:border-brand-red')}
              />
              {nameError && nameTouched ? (
                <p className="text-[11px] font-mono text-brand-red mt-1.5">{nameError}</p>
              ) : (
                <p className="text-[11px] font-mono text-[hsl(240,4%,24%)] mt-1.5">Your project ID: {slug || '...'}</p>
              )}
            </div>
            <div className="mt-5">
              <label className={labelCls}>Description <span className="text-[hsl(240,4%,24%)]">(optional)</span></label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What data will this project contain?"
                rows={3}
                className={cn(inputCls, 'h-auto py-3 resize-none')}
              />
            </div>
            <button onClick={handleStep1Continue} disabled={name.length < 2} className="w-full h-11 mt-8 bg-brand-blue text-white text-[15px] font-semibold rounded-md hover:bg-brand-blue-dark transition-colors disabled:opacity-40">
              Continue <ArrowRight className="inline w-4 h-4 ml-1" />
            </button>
            <p className="text-center mt-4">
              <button onClick={() => navigate('/dashboard')} className="text-[13px] text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors">
                <ArrowLeft className="inline w-3.5 h-3.5 mr-1" /> Back to projects
              </button>
            </p>
          </div>
        );

      case 1:
        return (
          <div>
            <h1 className="text-2xl font-bold text-[hsl(210,40%,98%)] tracking-tight">Configure your pipeline</h1>
            <p className="text-sm text-[hsl(215,20%,42%)] mt-2 leading-relaxed">Choose your vector store and LLM. You can change these later.</p>

            <div className="mt-8">
              <p className={sectionLabel}>Vector Store</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { l: 'P', n: 'Pinecone', d: 'Managed cloud vector DB' },
                  { l: 'pg', n: 'pgvector', d: 'PostgreSQL + vector search' },
                  { l: 'W', n: 'Weaviate', d: 'Open source, self-hosted' },
                  { l: 'Q', n: 'Qdrant', d: 'High-performance ANN' },
                  { l: 'C', n: 'ChromaDB', d: 'Local development' },
                ].map((o) => (
                  <OptionCard key={o.n} letter={o.l} name={o.n} desc={o.d} selected={vectorStore === o.n} onClick={() => setVectorStore(o.n)}
                    extra={o.n === 'Pinecone' ? <span className="inline-block text-[9px] font-mono text-brand-green bg-brand-green/[0.08] border border-brand-green/20 px-1.5 py-0.5 rounded-[3px] mt-1">Connected ✓</span> : undefined}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className={sectionLabel}>LLM Provider</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { l: 'OAI', n: 'OpenAI', d: 'GPT-4o, GPT-4 Turbo, GPT-3.5' },
                  { l: 'G', n: 'Google', d: 'Gemini 1.5 Pro, Flash' },
                  { l: 'A', n: 'Anthropic', d: 'Claude 3.5 Sonnet, Haiku' },
                  { l: '⚡', n: 'Ollama', d: 'Local, open source models' },
                ].map((o) => (
                  <OptionCard key={o.n} letter={o.l} name={o.n} desc={o.d} selected={llmProvider === o.n} onClick={() => setLlmProvider(o.n)} />
                ))}
              </div>
              {llmProvider === 'OpenAI' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className={labelCls}>Model</label>
                    <select value={llmModel} onChange={(e) => setLlmModel(e.target.value)} className={cn(inputCls, 'appearance-none cursor-pointer h-9 text-sm')}>
                      <option>gpt-4o</option><option>gpt-4-turbo</option><option>gpt-3.5-turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>OpenAI API Key <Info className="inline w-3 h-3 text-[hsl(215,14%,35%)] ml-1" /></label>
                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-proj-..." className={cn(inputCls, 'h-9 text-sm')} />
                    <p className="text-[11px] text-brand-blue mt-1 cursor-pointer hover:underline">Don't have a key? Get one at platform.openai.com ↗</p>
                  </div>
                </div>
              )}
              {llmProvider === 'Ollama' && (
                <div className="mt-4">
                  <label className={labelCls}>Ollama Base URL</label>
                  <input value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} className={cn(inputCls, 'h-9 text-sm')} />
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className={sectionLabel}>Embedding Model</p>
              <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} className={cn(inputCls, 'appearance-none cursor-pointer h-9 text-sm mt-2')}>
                <optgroup label="OpenAI">
                  <option value="text-embedding-3-small">text-embedding-3-small ★ Recommended</option>
                  <option value="text-embedding-3-large">text-embedding-3-large</option>
                  <option value="text-embedding-ada-002">ada-002</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="text-embedding-004">text-embedding-004</option>
                </optgroup>
                <optgroup label="Cohere">
                  <option value="embed-english-v3.0">embed-english-v3.0</option>
                </optgroup>
              </select>
              <div className="flex items-start gap-2.5 p-3 mt-3 bg-[hsl(240,15%,4%)] border border-dark-border rounded-md">
                <Info className="w-3.5 h-3.5 text-[hsl(215,20%,42%)] shrink-0 mt-0.5" />
                <p className="text-xs text-[hsl(215,20%,42%)]">text-embedding-3-small outputs 1536-dimensional vectors. This matches your existing Pinecone index dimensions.</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => goTo(0)} className="text-[13px] text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors">
                <ArrowLeft className="inline w-3.5 h-3.5 mr-1" /> Back
              </button>
              <button onClick={handleStep2Continue} className="bg-brand-blue text-white text-[13px] font-semibold px-6 py-2.5 rounded-md hover:bg-brand-blue-dark transition-colors">
                Continue <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h1 className="text-2xl font-bold text-[hsl(210,40%,98%)] tracking-tight">Add your first document</h1>
            <p className="text-sm text-[hsl(215,20%,42%)] mt-2 leading-relaxed">Upload files to start indexing. You can always add more later.</p>

            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'mt-8 border-2 border-dashed rounded-[10px] bg-[hsl(240,15%,4%)] p-9 text-center cursor-pointer transition-colors',
                dragOver ? 'border-brand-blue bg-brand-blue/[0.04]' : 'border-dark-border-subtle'
              )}
            >
              <UploadCloud className="w-9 h-9 text-brand-blue mx-auto" />
              <p className="text-[15px] text-[hsl(215,20%,65%)] mt-4">Drop files here or click to upload</p>
              <p className="text-[13px] text-[hsl(215,14%,35%)] mt-1">PDF, DOCX, JSON, TXT up to 50MB each</p>
              <div className="flex justify-center gap-2 mt-4">
                {['PDF', 'DOCX', 'JSON', 'TXT', 'MD'].map((f) => (
                  <span key={f} className="text-[10px] font-mono text-[hsl(215,20%,42%)] bg-dark-surface-raised border border-dark-border-subtle px-2 py-0.5 rounded">{f}</span>
                ))}
              </div>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.json,.txt,.md" onChange={handleFileSelect} className="hidden" />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 bg-dark-surface border border-dark-border rounded-md px-4 py-3">
                    <FileText className="w-4 h-4 text-[hsl(215,20%,42%)] shrink-0" />
                    <span className="text-[13px] font-mono text-[hsl(214,32%,91%)] flex-1 truncate">{f.name}</span>
                    <span className="text-[11px] font-mono text-[hsl(215,14%,35%)]">{formatSize(f.size)}</span>
                    <span className="text-[10px] font-mono text-brand-green bg-brand-green/[0.08] border border-brand-green/20 px-1.5 py-0.5 rounded-[3px]">Ready</span>
                    <button onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((x) => x.id !== f.id)); }} className="text-[hsl(240,4%,24%)] hover:text-brand-red transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-center mt-4">
              <button onClick={handleCreate} className="text-[13px] text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors">
                Skip for now — I'll add documents later →
              </button>
            </p>

            <button
              onClick={handleCreate}
              disabled={creating || created}
              className={cn(
                'w-full h-11 mt-8 text-[15px] font-semibold rounded-md transition-all',
                created ? 'bg-brand-green text-white' : 'bg-brand-blue text-white hover:bg-brand-blue-dark disabled:opacity-60'
              )}
            >
              {creating ? <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" /> Creating your project...</> :
               created ? <><CheckCircle className="inline w-4 h-4 mr-2" /> Project created!</> :
               <>Create Project <ArrowRight className="inline w-4 h-4 ml-1" /></>}
            </button>

            <p className="text-center mt-3">
              <button onClick={() => goTo(1)} className="text-[13px] text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors">
                <ArrowLeft className="inline w-3.5 h-3.5 mr-1" /> Back
              </button>
            </p>
          </div>
        );

      default: return null;
    }
  };

  return (
    <DashboardLayout breadcrumb={['Projects', 'New Project']}>
      <div className="py-12 px-8">
        <div className="max-w-[600px] mx-auto">
          <Progress current={step} />
          <div
            className={cn(
              'transition-all duration-150',
              animating && animDir === 'right' && 'opacity-0 -translate-x-2.5',
              animating && animDir === 'left' && 'opacity-0 translate-x-2.5',
            )}
          >
            {stepContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
