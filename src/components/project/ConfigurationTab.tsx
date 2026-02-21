import { useState, useCallback } from 'react';
import {
  Database, Sparkles, Cpu, Scissors, Search, MessageSquare,
  ChevronDown, ChevronUp, CheckCircle, Save, RotateCcw,
  AlertTriangle, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Config {
  vectorStore: string;
  embeddingProvider: string;
  embeddingModel: string;
  llmProvider: string;
  llmModel: string;
  temperature: number;
  maxTokens: number;
  chunkStrategy: string;
  chunkSize: number;
  chunkOverlap: number;
  retrievalStrategy: string;
  topK: number;
  reranking: boolean;
  scoreThreshold: number;
  denseWeight: number;
  systemPrompt: string;
}

const defaults: Config = {
  vectorStore: 'Pinecone',
  embeddingProvider: 'OpenAI',
  embeddingModel: 'text-embedding-3-small',
  llmProvider: 'OpenAI',
  llmModel: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1024,
  chunkStrategy: 'fixed',
  chunkSize: 512,
  chunkOverlap: 64,
  retrievalStrategy: 'dense',
  topK: 5,
  reranking: false,
  scoreThreshold: 0.7,
  denseWeight: 0.7,
  systemPrompt: `You are a helpful assistant for {company_name}. Answer questions based only on the provided context. If you cannot find the answer in the context, say 'I don't have information about that.'\n\nContext: {context}\nQuestion: {question}`,
};

/* ─── Shared Styles ─── */
const panelCls = 'bg-dark-surface border border-dark-border rounded-lg overflow-hidden mb-4';
const labelCls = 'text-xs text-[hsl(215,20%,42%)] mb-1.5 block';
const inputCls = 'w-full h-9 px-3 text-sm font-mono bg-[hsl(240,15%,4%)] border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] focus:outline-none focus:border-brand-blue transition-colors';
const selectCls = cn(inputCls, 'appearance-none cursor-pointer');
const pillActive = 'bg-brand-blue text-white border-brand-blue';
const pillInactive = 'bg-transparent text-[hsl(215,20%,42%)] border-dark-border-subtle hover:border-gray-600';

/* ─── Collapsible Panel ─── */
const Panel = ({
  icon: Icon, title, badge, expanded, onToggle, children,
}: {
  icon: React.ElementType; title: string; badge: string;
  expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) => (
  <div className={panelCls}>
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-dark-surface-raised transition-colors cursor-pointer">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-brand-blue" />
        <span className="text-sm font-semibold text-[hsl(210,40%,98%)]">{title}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] font-mono text-[hsl(215,20%,42%)] bg-dark-surface-raised border border-dark-border-subtle px-2 py-0.5 rounded">{badge}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[hsl(215,14%,35%)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[hsl(215,14%,35%)]" />}
      </div>
    </button>
    {expanded && <div className="border-t border-dark-border px-5 py-5">{children}</div>}
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
      'relative text-left bg-[hsl(240,15%,4%)] border rounded-md p-3 transition-all',
      selected ? 'border-brand-blue bg-brand-blue/[0.04]' : 'border-dark-border-subtle hover:border-gray-600'
    )}
  >
    {selected && <CheckCircle className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-brand-blue" />}
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-7 h-7 bg-dark-surface-raised border border-dark-border rounded-[5px] font-mono font-bold text-xs text-[hsl(215,20%,42%)]">{letter}</div>
      <div>
        <p className={cn('text-[13px] font-medium', selected ? 'text-[hsl(210,40%,98%)]' : 'text-[hsl(215,20%,65%)]')}>{name}</p>
        <p className="text-[11px] text-[hsl(215,14%,35%)]">{desc}</p>
        {extra}
      </div>
    </div>
  </button>
);

/* ─── Slider ─── */
const Slider = ({
  value, min, max, step, onChange, leftLabel, rightLabel,
}: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; leftLabel?: string; rightLabel?: string;
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3B82F6 ${pct}%, #1C1C28 ${pct}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[hsl(240,4%,24%)]">{leftLabel}</span>
          <span className="text-[10px] text-[hsl(240,4%,24%)]">{rightLabel}</span>
        </div>
      )}
    </div>
  );
};

/* ─── Toggle ─── */
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn('relative w-9 h-5 rounded-full transition-colors', checked ? 'bg-brand-blue' : 'bg-[hsl(240,7%,11%)]')}
  >
    <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', checked ? 'left-[18px]' : 'left-0.5')} />
  </button>
);

/* ─── Main Component ─── */
const ConfigurationTab = () => {
  const [config, setConfig] = useState<Config>({ ...defaults });
  const [saved, setSaved] = useState<Config>({ ...defaults });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    vector: true, embedding: true, llm: true, chunking: true, retrieval: true, prompt: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testQuery, setTestQuery] = useState('');

  const isDirty = JSON.stringify(config) !== JSON.stringify(saved);
  const toggle = (key: string) => setExpanded((p) => ({ ...p, [key]: !p[key] }));
  const set = useCallback(<K extends keyof Config>(key: K, val: Config[K]) => {
    setConfig((p) => ({ ...p, [key]: val }));
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved({ ...config });
      setSaving(false);
      setSaveSuccess(true);
      toast.success('Configuration saved');
      setTimeout(() => setSaveSuccess(false), 1000);
    }, 1000);
  };

  const handleReset = () => {
    setConfig({ ...defaults });
    toast.info('Configuration reset to defaults');
  };

  const embeddingModels: Record<string, string[]> = {
    OpenAI: ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002'],
    Google: ['text-embedding-004', 'text-embedding-preview'],
    Cohere: ['embed-english-v3.0', 'embed-multilingual-v3.0'],
    'Ollama (local)': ['nomic-embed-text', 'mxbai-embed-large'],
  };

  const llmModels: Record<string, string[]> = {
    OpenAI: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    Google: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    Anthropic: ['claude-3.5-sonnet', 'claude-3-haiku'],
    Ollama: ['llama-3', 'mistral-7b'],
  };

  const summaryRows = [
    ['Vector Store', `${config.vectorStore}${config.vectorStore === 'Pinecone' ? ' (ragfloe)' : ''}`],
    ['Embedding', config.embeddingModel],
    ['LLM', config.llmModel],
    ['Chunk Size', `${config.chunkSize} tokens`],
    ['Overlap', `${config.chunkOverlap} tokens`],
    ['Retrieval', `${config.retrievalStrategy.charAt(0).toUpperCase() + config.retrievalStrategy.slice(1)}, top-${config.topK}`],
    ['Reranking', config.reranking ? 'Enabled' : 'Disabled'],
    ['Temperature', config.temperature.toFixed(1)],
  ];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* LEFT COLUMN */}
        <div>
          {/* Panel 1 - Vector Store */}
          <Panel icon={Database} title="Vector Store" badge={config.vectorStore} expanded={expanded.vector} onToggle={() => toggle('vector')}>
            <p className="text-xs text-[hsl(215,20%,42%)] mb-3">Select your vector database</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'P', n: 'Pinecone', d: 'Managed cloud' },
                { l: 'pg', n: 'pgvector', d: 'PostgreSQL extension' },
                { l: 'W', n: 'Weaviate', d: 'Open source' },
                { l: 'Q', n: 'Qdrant', d: 'High performance' },
                { l: 'C', n: 'ChromaDB', d: 'Local / dev' },
              ].map((o) => (
                <OptionCard
                  key={o.n} letter={o.l} name={o.n} desc={o.d}
                  selected={config.vectorStore === o.n}
                  onClick={() => set('vectorStore', o.n)}
                  extra={o.n === 'Pinecone' && config.vectorStore === 'Pinecone' ? (
                    <span className="text-[10px] font-mono text-brand-green">Connected ✓</span>
                  ) : undefined}
                />
              ))}
            </div>
            {config.vectorStore === 'Pinecone' && (
              <div className="mt-4">
                <label className={labelCls}>Index Name</label>
                <input value="ragfloe" readOnly className={cn(inputCls, 'opacity-70')} />
                <div className="flex items-center gap-2 p-3 mt-3 rounded-md bg-brand-green/[0.04] border border-brand-green/15">
                  <CheckCircle className="w-3 h-3 text-brand-green shrink-0" />
                  <span className="text-xs text-brand-green">Connected to Pinecone index 'ragfloe' on AWS us-east-1</span>
                </div>
              </div>
            )}
          </Panel>

          {/* Panel 2 - Embedding Model */}
          <Panel icon={Sparkles} title="Embedding Model" badge={config.embeddingModel} expanded={expanded.embedding} onToggle={() => toggle('embedding')}>
            <p className="text-xs text-[hsl(215,20%,42%)] mb-3">Choose how documents are converted to vectors</p>
            <label className={labelCls}>Provider</label>
            <select value={config.embeddingProvider} onChange={(e) => { set('embeddingProvider', e.target.value); set('embeddingModel', embeddingModels[e.target.value]?.[0] || ''); }} className={selectCls}>
              {Object.keys(embeddingModels).map((p) => <option key={p}>{p}</option>)}
            </select>
            <div className="mt-3">
              <label className={labelCls}>Model</label>
              <select value={config.embeddingModel} onChange={(e) => set('embeddingModel', e.target.value)} className={selectCls}>
                {(embeddingModels[config.embeddingProvider] || []).map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-4 mt-3">
              {[['Dimensions', '1536'], ['Max tokens', '8,191'], ['Pricing', '$0.02 / 1M tokens']].map(([l, v]) => (
                <span key={l} className="text-[11px] font-mono text-[hsl(215,14%,35%)]"><span className="text-[hsl(240,4%,24%)]">{l}:</span> {v}</span>
              ))}
            </div>
            {config.embeddingModel !== defaults.embeddingModel && (
              <div className="flex items-center gap-2 p-3 mt-3 rounded-md bg-brand-amber/[0.06] border border-brand-amber/20">
                <AlertTriangle className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                <span className="text-xs text-brand-amber">Changing the model requires re-embedding all documents (47 docs). This will take approximately 2 minutes.</span>
              </div>
            )}
          </Panel>

          {/* Panel 3 - LLM Provider */}
          <Panel icon={Cpu} title="LLM Provider" badge={config.llmModel} expanded={expanded.llm} onToggle={() => toggle('llm')}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'OAI', n: 'OpenAI', d: 'GPT-4o, GPT-4 Turbo' },
                { l: 'G', n: 'Google', d: 'Gemini 1.5 Pro, Flash' },
                { l: 'A', n: 'Anthropic', d: 'Claude 3.5 Sonnet' },
                { l: '⚡', n: 'Ollama', d: 'Local / open source' },
              ].map((o) => (
                <OptionCard
                  key={o.n} letter={o.l} name={o.n} desc={o.d}
                  selected={config.llmProvider === o.n}
                  onClick={() => { set('llmProvider', o.n); set('llmModel', llmModels[o.n]?.[0] || ''); }}
                />
              ))}
            </div>
            <div className="mt-4">
              <label className={labelCls}>Model</label>
              <select value={config.llmModel} onChange={(e) => set('llmModel', e.target.value)} className={selectCls}>
                {(llmModels[config.llmProvider] || []).map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="mt-3">
              <label className={labelCls}>API Key (BYOK)</label>
              <input type="password" value="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly className={inputCls} />
              <p className="text-[11px] text-[hsl(215,14%,35%)] mt-1">sk-proj-... format expected</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <label className={labelCls}>Temperature</label>
                <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{config.temperature.toFixed(1)}</span>
              </div>
              <Slider value={config.temperature} min={0} max={1} step={0.1} onChange={(v) => set('temperature', v)} leftLabel="Precise" rightLabel="Creative" />
            </div>
            <div className="mt-3">
              <label className={labelCls}>Max Output Tokens</label>
              <input type="number" value={config.maxTokens} onChange={(e) => set('maxTokens', Number(e.target.value))} className={inputCls} />
            </div>
          </Panel>

          {/* Panel 4 - Chunking */}
          <Panel icon={Scissors} title="Chunking" badge={`${config.chunkStrategy.charAt(0).toUpperCase() + config.chunkStrategy.slice(1)} · ${config.chunkSize} tokens`} expanded={expanded.chunking} onToggle={() => toggle('chunking')}>
            <div className="flex gap-2 mb-4">
              {['fixed', 'sentence', 'paragraph', 'semantic'].map((s) => (
                <button key={s} onClick={() => set('chunkStrategy', s)} className={cn('text-xs font-mono border rounded-full px-3 py-1 transition-colors capitalize', config.chunkStrategy === s ? pillActive : pillInactive)}>{s === 'fixed' ? 'Fixed Size' : s}</button>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <label className={labelCls}>Chunk Size</label>
                <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{config.chunkSize} tokens</span>
              </div>
              <Slider value={config.chunkSize} min={128} max={4096} step={64} onChange={(v) => set('chunkSize', v)} />
              <div className="flex justify-between mt-1">
                {[128, 512, 1024, 2048, 4096].map((t) => (
                  <span key={t} className="text-[10px] text-[hsl(240,4%,24%)]">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <label className={labelCls}>Chunk Overlap</label>
                <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{config.chunkOverlap} tokens</span>
              </div>
              <Slider value={config.chunkOverlap} min={0} max={512} step={8} onChange={(v) => set('chunkOverlap', v)} />
              <p className="text-[11px] text-[hsl(215,14%,35%)] mt-1">Overlap prevents information loss at chunk boundaries.</p>
            </div>
            {/* Visual preview */}
            <div className="mt-4">
              <p className="text-[10px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-widest mb-2">PREVIEW</p>
              <div className="flex gap-0 relative h-10">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-dark-surface-raised border border-dark-border-subtle rounded flex items-center justify-center text-[10px] font-mono text-[hsl(215,20%,42%)] absolute"
                    style={{
                      width: '40%',
                      left: `${(i - 1) * 30}%`,
                      zIndex: i,
                      opacity: 0.9,
                    }}
                  >
                    chunk {i}
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Panel 5 - Retrieval */}
          <Panel icon={Search} title="Retrieval" badge={`${config.retrievalStrategy.charAt(0).toUpperCase() + config.retrievalStrategy.slice(1)} · top-${config.topK}`} expanded={expanded.retrieval} onToggle={() => toggle('retrieval')}>
            <div className="flex gap-2 mb-4">
              {['dense', 'sparse', 'hybrid'].map((s) => (
                <button key={s} onClick={() => set('retrievalStrategy', s)} className={cn('text-xs font-mono border rounded-full px-3 py-1 transition-colors capitalize', config.retrievalStrategy === s ? pillActive : pillInactive)}>{s}</button>
              ))}
            </div>
            {config.retrievalStrategy === 'hybrid' && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className={labelCls}>Dense Weight</label>
                  <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{config.denseWeight.toFixed(1)} <span className="text-[hsl(215,14%,35%)]">· Sparse: {(1 - config.denseWeight).toFixed(1)}</span></span>
                </div>
                <Slider value={config.denseWeight} min={0} max={1} step={0.1} onChange={(v) => set('denseWeight', v)} />
              </div>
            )}
            <div className="mt-4">
              <label className={labelCls}>Results to Retrieve (top-k)</label>
              <div className="flex items-center gap-2">
                <input type="number" value={config.topK} min={1} max={20} onChange={(e) => set('topK', Number(e.target.value))} className={cn(inputCls, 'w-24')} />
                <button onClick={() => set('topK', Math.max(1, config.topK - 1))} className="w-9 h-9 flex items-center justify-center border border-dark-border-subtle rounded-md text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)] transition-colors">−</button>
                <button onClick={() => set('topK', Math.min(20, config.topK + 1))} className="w-9 h-9 flex items-center justify-center border border-dark-border-subtle rounded-md text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)] transition-colors">+</button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-[13px] text-[hsl(210,40%,98%)]">Cross-Encoder Reranking</p>
                <p className="text-[11px] text-[hsl(215,14%,35%)] mt-0.5">Improves precision at the cost of ~200ms additional latency</p>
              </div>
              <Toggle checked={config.reranking} onChange={(v) => set('reranking', v)} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <label className={labelCls}>Minimum Score Threshold</label>
                <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{config.scoreThreshold.toFixed(2)}</span>
              </div>
              <Slider value={config.scoreThreshold} min={0} max={1} step={0.01} onChange={(v) => set('scoreThreshold', v)} />
              <p className="text-[11px] text-[hsl(215,14%,35%)] mt-1">Chunks below this score are excluded from context.</p>
            </div>
          </Panel>

          {/* Panel 6 - System Prompt */}
          <Panel icon={MessageSquare} title="System Prompt" badge="Custom" expanded={expanded.prompt} onToggle={() => toggle('prompt')}>
            <p className="text-xs text-[hsl(215,20%,42%)] mb-3">Customize how the AI responds to queries</p>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => set('systemPrompt', e.target.value)}
              className="w-full h-[140px] resize-y px-3.5 py-3 text-xs font-mono leading-[1.7] bg-[hsl(240,15%,4%)] border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] focus:outline-none focus:border-brand-blue transition-colors"
            />
            <div className="mt-3">
              <span className="text-[11px] text-[hsl(240,4%,24%)]">Available variables:</span>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {['{context}', '{question}', '{company_name}', '{project_name}'].map((v) => (
                  <span key={v} className="text-[10px] font-mono bg-dark-surface-raised border border-dark-border-subtle text-[hsl(215,20%,42%)] px-2 py-0.5 rounded">{v}</span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[hsl(240,4%,24%)] text-right mt-2">{config.systemPrompt.length} / 4000</p>
          </Panel>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:sticky lg:top-24 self-start">
          {/* Summary Card */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-5">
            <h3 className="text-[13px] font-semibold text-[hsl(210,40%,98%)]">Current Configuration</h3>
            <div className="flex flex-col gap-0 mt-4">
              {summaryRows.map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2.5 border-b border-dark-border last:border-0">
                  <span className="text-xs text-[hsl(215,14%,35%)]">{key}</span>
                  <span className="text-xs font-mono font-medium text-[hsl(215,20%,65%)]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unsaved changes */}
          {isDirty && (
            <div className="flex items-center gap-2.5 p-3 mt-4 rounded-md bg-brand-amber/[0.06] border border-brand-amber/20">
              <AlertTriangle className="w-3.5 h-3.5 text-brand-amber shrink-0" />
              <span className="text-xs text-brand-amber">You have unsaved changes</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={cn(
                'w-full flex items-center justify-center gap-2 text-[13px] font-medium py-2.5 rounded-md transition-colors',
                saveSuccess
                  ? 'bg-brand-green text-white'
                  : 'bg-brand-blue text-white hover:bg-brand-blue-dark disabled:opacity-40'
              )}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Configuration'}
            </button>
            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-[13px] text-[hsl(215,20%,42%)] border border-dark-border-subtle py-2.5 rounded-md hover:border-brand-red/30 hover:text-brand-red transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset to Defaults
            </button>
          </div>

          {/* Test Card */}
          <div className="bg-[hsl(240,15%,4%)] border border-dark-border rounded-lg p-4 mt-4">
            <h4 className="text-xs font-semibold text-[hsl(215,20%,65%)]">Test Your Configuration</h4>
            <p className="text-[11px] text-[hsl(215,14%,35%)] mt-1">Send a test query with the current settings</p>
            <textarea
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter a test question..."
              className="w-full h-[72px] resize-none mt-3 px-3 py-2 text-xs font-mono bg-dark-surface border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] placeholder:text-[hsl(240,4%,24%)] focus:outline-none focus:border-brand-blue transition-colors"
            />
            <button className="w-full flex items-center justify-center gap-2 mt-3 bg-brand-blue text-white text-[13px] font-medium py-2.5 rounded-md hover:bg-brand-blue-dark transition-colors">
              Run Test <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationTab;
