import { useState } from 'react';
import {
  Code, Layout, Copy, Check, MessageCircle, Key,
  Plus, MoreHorizontal, AlertTriangle, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockApiKeys } from '@/services/api';
import { toast } from 'sonner';
import type { ApiKey } from '@/types';

/* ─── Helpers ─── */
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

/* ─── Syntax-highlighted code block ─── */
const DeployCodeBlock = ({
  code,
  highlightRules,
}: {
  code: string;
  highlightRules?: { pattern: RegExp; color: string }[];
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlight = (line: string) => {
    if (!highlightRules) return <span className="text-[hsl(215,20%,65%)]">{line}</span>;
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;
    while (remaining.length > 0) {
      let earliest = -1;
      let bestMatch: RegExpMatchArray | null = null;
      let bestRule: (typeof highlightRules)[0] | null = null;
      for (const rule of highlightRules) {
        const m = remaining.match(rule.pattern);
        if (m && m.index !== undefined && (earliest === -1 || m.index < earliest)) {
          earliest = m.index;
          bestMatch = m;
          bestRule = rule;
        }
      }
      if (bestMatch && bestRule && earliest !== -1) {
        if (earliest > 0) {
          parts.push(<span key={key++} className="text-[hsl(215,20%,65%)]">{remaining.slice(0, earliest)}</span>);
        }
        parts.push(<span key={key++} style={{ color: bestRule.color }}>{bestMatch[0]}</span>);
        remaining = remaining.slice(earliest + bestMatch[0].length);
      } else {
        parts.push(<span key={key++} className="text-[hsl(215,20%,65%)]">{remaining}</span>);
        break;
      }
    }
    return <>{parts}</>;
  };

  return (
    <div className="relative bg-dark-bg border border-dark-border-subtle rounded-md border-l-2 border-l-brand-blue p-3.5">
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-mono text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors"
      >
        {copied ? <><Check className="w-3 h-3 text-brand-green" /> <span className="text-brand-green">Copied!</span></> : <><Copy className="w-3 h-3" /> Copy</>}
      </button>
      <pre className="font-mono text-[11px] leading-[1.7] overflow-x-auto pr-16">
        {code.split('\n').map((line, i) => (
          <div key={i}>{highlight(line)}</div>
        ))}
      </pre>
    </div>
  );
};

/* ─── curl highlight rules ─── */
const curlRules = [
  { pattern: /curl -X POST/g, color: '#F0ABFC' },
  { pattern: /-[Hd]/g, color: '#60A5FA' },
  { pattern: /"[^"]*"/g, color: '#86EFAC' },
];
const jsonRules = [
  { pattern: /"[^"]+"\s*:/g, color: '#60A5FA' },
  { pattern: /:\s*"[^"]*"/g, color: '#86EFAC' },
  { pattern: /:\s*[\d.]+/g, color: '#F0ABFC' },
];
const pythonRules = [
  { pattern: /import|from|print/g, color: '#F0ABFC' },
  { pattern: /"[^"]*"/g, color: '#86EFAC' },
  { pattern: /\b(ragfloe|client|response)\b/g, color: '#60A5FA' },
];
const jsRules = [
  { pattern: /const|await|async/g, color: '#F0ABFC' },
  { pattern: /'[^']*'/g, color: '#86EFAC' },
  { pattern: /\b(fetch|JSON|response|data)\b/g, color: '#60A5FA' },
];

const curlCode = `curl -X POST \\
  https://api.ragfloe.io/v1/projects/proj_1/query \\
  -H "X-API-Key: rf_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What is the refund policy?",
    "top_k": 5
  }'`;

const responseCode = `{
  "answer": "Premium subscribers can request...",
  "sources": [
    {
      "document": "product-manual.pdf",
      "score": 0.94,
      "text": "...customers may return..."
    }
  ],
  "usage": {
    "tokens_input": 1247,
    "latency_ms": 1354
  }
}`;

const pythonCode = `import ragfloe

client = ragfloe.Client(
  api_key="rf_live_xxxx"
)

response = client.query(
  project_id="proj_1",
  message="What is refund policy?"
)

print(response.answer)`;

const jsCode = `const response = await fetch(
  'https://api.ragfloe.io/v1/projects/proj_1/query',
  {
    method: 'POST',
    headers: {
      'X-API-Key': 'rf_live_xxxx',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'What is refund policy?'
    })
  }
);
const data = await response.json();`;

/* ─── Section Label ─── */
const SLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-widest mb-2">{children}</p>
);

/* ─── REST API Card ─── */
const RestApiCard = () => {
  const [sdkTab, setSdkTab] = useState<'curl' | 'python' | 'javascript'>('curl');
  const [endpointCopied, setEndpointCopied] = useState(false);
  const endpoint = 'https://api.ragfloe.io/v1/projects/proj_1/query';

  const handleCopyEndpoint = () => {
    copyToClipboard(endpoint);
    setEndpointCopied(true);
    setTimeout(() => setEndpointCopied(false), 1500);
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-center w-9 h-9 bg-dark-surface-raised border border-dark-border-subtle rounded-lg">
        <Code className="w-[18px] h-[18px] text-brand-blue" />
      </div>
      <h3 className="text-base font-semibold text-[hsl(210,40%,98%)] mt-3">REST API</h3>
      <p className="text-[13px] text-[hsl(215,20%,42%)] mt-1 leading-relaxed">
        Query your RAG pipeline programmatically from any language or framework.
      </p>
      <div className="border-t border-dark-border my-5" />

      <SLabel>ENDPOINT</SLabel>
      <div className="bg-dark-bg border border-dark-border-subtle rounded-md border-l-2 border-l-brand-blue flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 text-[9px] font-mono text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-1.5 py-0.5 rounded-[3px]">POST</span>
          <span className="font-mono text-xs text-[hsl(215,20%,65%)] truncate">{endpoint}</span>
        </div>
        <button onClick={handleCopyEndpoint} className="flex items-center gap-1 text-[11px] font-mono text-[hsl(215,14%,35%)] hover:text-[hsl(215,20%,65%)] transition-colors shrink-0 ml-2">
          {endpointCopied ? <><Check className="w-3 h-3 text-brand-green" /><span className="text-brand-green">Copied!</span></> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>

      <div className="mt-4">
        <SLabel>EXAMPLE REQUEST</SLabel>
        <DeployCodeBlock code={sdkTab === 'curl' ? curlCode : sdkTab === 'python' ? pythonCode : jsCode} highlightRules={sdkTab === 'curl' ? curlRules : sdkTab === 'python' ? pythonRules : jsRules} />
      </div>

      <div className="mt-4">
        <SLabel>EXAMPLE RESPONSE</SLabel>
        <DeployCodeBlock code={responseCode} highlightRules={jsonRules} />
      </div>

      <div className="flex gap-1.5 mt-5">
        {(['curl', 'python', 'javascript'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSdkTab(t)}
            className={cn(
              'text-[11px] font-mono px-3 py-1.5 rounded-md transition-colors capitalize',
              sdkTab === t
                ? 'bg-dark-surface-raised border border-dark-border-subtle text-[hsl(215,20%,65%)]'
                : 'text-[hsl(240,4%,24%)] hover:text-[hsl(215,20%,42%)]'
            )}
          >
            {t === 'javascript' ? 'JavaScript' : t === 'python' ? 'Python' : 'curl'}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Embed Widget Card ─── */
const colorSwatches = [
  { value: '#3B82F6', tw: 'bg-brand-blue' },
  { value: '#8B5CF6', tw: 'bg-[#8B5CF6]' },
  { value: '#22C55E', tw: 'bg-brand-green' },
  { value: '#F59E0B', tw: 'bg-brand-amber' },
  { value: '#EF4444', tw: 'bg-brand-red' },
];

const EmbedWidgetCard = () => {
  const [color, setColor] = useState('#3B82F6');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [greeting, setGreeting] = useState('Hi! How can I help you today?');
  const [copied, setCopied] = useState(false);

  const embedCode = `<script
  src="https://widget.ragfloe.io/v1/widget.js"
  data-project-token="rf_widget_a8x2k9m"
  data-position="${position}"
  data-color="${color}"
  data-greeting="${greeting}"
  defer
></script>`;

  const handleCopyEmbed = () => {
    copyToClipboard(embedCode);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-center w-9 h-9 bg-dark-surface-raised border border-dark-border-subtle rounded-lg">
        <Layout className="w-[18px] h-[18px] text-brand-blue" />
      </div>
      <h3 className="text-base font-semibold text-[hsl(210,40%,98%)] mt-3">Embed Widget</h3>
      <p className="text-[13px] text-[hsl(215,20%,42%)] mt-1 leading-relaxed">
        Add an AI chat widget to any website with a single script tag.
      </p>
      <div className="border-t border-dark-border my-5" />

      {/* Live Preview */}
      <SLabel>LIVE PREVIEW</SLabel>
      <div className="relative bg-dark-bg border border-dark-border-subtle rounded-lg p-5 h-[140px] overflow-hidden">
        <div className="bg-dark-surface rounded-md w-full h-full p-4 relative">
          {/* Shimmer bars */}
          <div className="space-y-2.5">
            <div className="h-2.5 w-3/4 rounded bg-dark-surface-raised" />
            <div className="h-2.5 w-1/2 rounded bg-dark-surface-raised" />
            <div className="h-2.5 w-2/3 rounded bg-dark-surface-raised" />
          </div>
          {/* Chat popup */}
          <div
            className={cn(
              'absolute bottom-12 w-[180px] bg-dark-surface border border-dark-border rounded-lg p-2.5 shadow-elevated',
              position === 'bottom-right' ? 'right-3' : 'left-3'
            )}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-mono text-[8px] text-[hsl(215,20%,65%)]">customer-support-bot</span>
            </div>
            <p className="text-[9px] text-[hsl(215,20%,42%)] mb-1.5">{greeting.slice(0, 30)}{greeting.length > 30 ? '…' : ''}</p>
            <div className="h-4 bg-dark-surface-raised rounded border border-dark-border-subtle" />
          </div>
          {/* Widget button */}
          <button
            className={cn(
              'absolute w-10 h-10 rounded-full flex items-center justify-center animate-[float_2s_ease-in-out_infinite]',
              position === 'bottom-right' ? 'bottom-2 right-3' : 'bottom-2 left-3'
            )}
            style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}66` }}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Customization */}
      <div className="mt-5">
        <SLabel>CUSTOMIZATION</SLabel>
        <p className="text-xs text-[hsl(215,20%,42%)] mb-2">Primary Color</p>
        <div className="flex gap-2">
          {colorSwatches.map((s) => (
            <button
              key={s.value}
              onClick={() => setColor(s.value)}
              className={cn(
                'w-6 h-6 rounded-full border-2 transition-transform',
                color === s.value ? 'border-white scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: s.value }}
            />
          ))}
        </div>

        <p className="text-xs text-[hsl(215,20%,42%)] mt-4 mb-2">Position</p>
        <div className="flex gap-2">
          {(['bottom-right', 'bottom-left'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={cn(
                'text-[11px] font-mono px-3 py-1.5 rounded-md border transition-colors',
                position === pos
                  ? 'bg-dark-surface-raised border-brand-blue text-[hsl(215,20%,65%)]'
                  : 'border-dark-border-subtle text-[hsl(240,4%,24%)] hover:text-[hsl(215,20%,42%)]'
              )}
            >
              {pos === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
            </button>
          ))}
        </div>

        <p className="text-xs text-[hsl(215,20%,42%)] mt-4 mb-2">Greeting Message</p>
        <input
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          className="w-full h-8 px-3 text-xs font-mono bg-dark-surface border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] focus:outline-none focus:border-brand-blue transition-colors"
        />
      </div>

      {/* Embed Code */}
      <div className="mt-5">
        <SLabel>EMBED CODE</SLabel>
        <DeployCodeBlock code={embedCode} highlightRules={[
          { pattern: /data-[\w-]+/g, color: '#60A5FA' },
          { pattern: /"[^"]*"/g, color: '#86EFAC' },
          { pattern: /<\/?script|defer|src/g, color: '#F0ABFC' },
        ]} />
        <button
          onClick={handleCopyEmbed}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-brand-blue text-white text-[13px] font-medium py-2.5 rounded-md hover:bg-brand-blue-dark transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to clipboard!' : 'Copy Embed Code'}
        </button>
      </div>
    </div>
  );
};

/* ─── API Keys Section ─── */
const ApiKeysSection = () => {
  const [keys, setKeys] = useState<ApiKey[]>([...mockApiKeys]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'form' | 'success'>('form');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('never');
  const [generatedKey, setGeneratedKey] = useState('');
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const maskedKeys: Record<string, string> = {
    key_1: 'rf_live_••••••••••••••••3f9a',
    key_2: 'rf_live_••••••••••••••••7c2e',
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      const key = `rf_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
      setGeneratedKey(key);
      setKeys((prev) => [
        ...prev,
        { id: `key_${Date.now()}`, name: newKeyName, created: 'Just now', lastUsed: 'Never' },
      ]);
      setModalStep('success');
      setCreating(false);
    }, 1000);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setRevokeConfirm(null);
    toast.success('API key revoked successfully');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalStep('form');
    setNewKeyName('');
    setNewKeyExpiry('never');
    setGeneratedKey('');
  };

  return (
    <>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[hsl(210,40%,98%)]">API Keys</h3>
            <p className="text-xs text-[hsl(215,14%,35%)] mt-0.5">Manage authentication keys for this project</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-mono text-[hsl(215,20%,42%)] border border-dark-border-subtle px-3 py-1.5 rounded-md hover:border-gray-600 hover:text-[hsl(215,20%,65%)] transition-colors"
          >
            <Plus className="w-3 h-3" /> Create New Key
          </button>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_150px_150px_100px] items-center px-5 py-2.5 bg-[hsl(240,15%,4%)] border-b border-dark-border">
            {['NAME', 'CREATED', 'LAST USED', ''].map((h) => (
              <span key={h || 'actions'} className="text-[10px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-wider">{h}</span>
            ))}
          </div>
          {keys.map((k) => (
            <div key={k.id} className="grid grid-cols-[2fr_150px_150px_100px] items-center px-5 py-3 border-b border-dark-border last:border-0 hover:bg-dark-surface-raised/50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Key className="w-3 h-3 text-[hsl(215,20%,42%)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-mono text-[hsl(214,32%,91%)]">{k.name}</p>
                  <p className="text-[11px] font-mono text-[hsl(240,4%,24%)]">{maskedKeys[k.id] || 'rf_live_••••••••••••••••xxxx'}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{k.created}</span>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{k.lastUsed}</span>
              <div className="flex items-center gap-1.5 justify-end">
                {revokeConfirm === k.id ? (
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleRevoke(k.id)} className="text-[11px] font-mono text-brand-red hover:underline">Confirm</button>
                    <button onClick={() => setRevokeConfirm(null)} className="text-[11px] font-mono text-[hsl(215,20%,42%)] hover:underline">Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setRevokeConfirm(k.id)} className="text-[11px] font-mono text-[hsl(215,20%,42%)] border border-transparent hover:border-brand-red/30 hover:text-brand-red px-2 py-1 rounded transition-colors">Revoke</button>
                    <button className="p-1 text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)] transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[4px]" onClick={handleCloseModal}>
          <div className="bg-dark-surface border border-dark-border rounded-[10px] p-6 w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            {modalStep === 'form' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[hsl(210,40%,98%)]">Create API Key</h3>
                  <button onClick={handleCloseModal} className="text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)]"><X className="w-4 h-4" /></button>
                </div>
                <div className="border-t border-dark-border mb-4" />
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[hsl(215,20%,42%)] mb-1.5 block">Key Name</label>
                    <input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. Production Widget"
                      className="w-full h-9 px-3 text-sm font-mono bg-dark-surface-raised border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] placeholder:text-[hsl(240,4%,24%)] focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[hsl(215,20%,42%)] mb-1.5 block">Expires</label>
                    <select
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(e.target.value)}
                      className="w-full h-9 px-3 text-sm font-mono bg-dark-surface-raised border border-dark-border-subtle rounded-md text-[hsl(215,20%,65%)] focus:outline-none focus:border-brand-blue transition-colors appearance-none"
                    >
                      <option value="never">Never</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-md bg-brand-amber/[0.06] border border-brand-amber/20">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-amber shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-amber">The key will only be shown once. Store it securely.</p>
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={handleCloseModal} className="text-[13px] text-[hsl(215,20%,42%)] border border-dark-border-subtle px-4 py-2 rounded-md hover:border-gray-600 hover:text-[hsl(215,20%,65%)] transition-colors">Cancel</button>
                  <button
                    onClick={handleCreate}
                    disabled={!newKeyName.trim() || creating}
                    className="text-[13px] font-medium text-white bg-brand-blue px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
                  >
                    {creating ? 'Creating…' : 'Create Key'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[hsl(210,40%,98%)]">API Key Created</h3>
                  <button onClick={handleCloseModal} className="text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)]"><X className="w-4 h-4" /></button>
                </div>
                <div className="border-t border-dark-border mb-4" />
                <div className="p-3 bg-dark-bg border border-brand-green/30 rounded-md">
                  <p className="font-mono text-xs text-brand-green break-all">{generatedKey}</p>
                </div>
                <p className="text-xs text-brand-amber mt-3">Copy this key now. You won't be able to see it again.</p>
                <div className="flex justify-end mt-5">
                  <button onClick={handleCloseModal} className="text-[13px] font-medium text-white bg-brand-blue px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors">Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Main Deploy Tab ─── */
const DeployTab = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RestApiCard />
      <EmbedWidgetCard />
    </div>
    <ApiKeysSection />
  </div>
);

export default DeployTab;
