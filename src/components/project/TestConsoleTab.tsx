import { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Settings as SettingsIcon, SendHorizontal, FileText, ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  sources?: Source[];
  latency?: string;
}

interface Source {
  doc: string;
  score: number;
  text: string;
  page: string;
}

const initialSources: Source[] = [
  { doc: 'product-manual.pdf', score: 0.94, text: '...customers may return any product within 30 days of the original purchase date with proof of receipt. Refunds are processed within 5-7 business days...', page: 'Page 4 · Chunk 12' },
  { doc: 'product-manual.pdf', score: 0.87, text: '...premium plan subscribers are eligible for priority refund processing. Contact the enterprise support team at...', page: 'Page 8 · Chunk 23' },
  { doc: 'api-reference.docx', score: 0.71, text: '...refund_status endpoint returns the current status of a refund request including estimated completion date...', page: 'Page 12 · Chunk 5' },
];

const initialMessages: Message[] = [
  { id: '1', role: 'user', text: 'What is the refund policy for premium subscriptions?' },
  {
    id: '2', role: 'ai',
    text: 'Based on the documentation, premium subscription holders can request a full refund within 30 days of their initial purchase. After 30 days, refunds are evaluated on a case-by-case basis. To initiate a refund, contact support@company.com with your order ID.',
    sources: initialSources,
    latency: '1.2s',
  },
];

const pipelineSteps = [
  { name: 'Query Embedded', duration: '42ms', done: true },
  { name: 'Vector Retrieved', duration: '234ms', done: true },
  { name: 'Chunks Reranked', duration: '187ms', done: true },
  { name: 'Response Generated', duration: '891ms', done: true },
];

const fakeResponses = [
  'Based on the available documentation, the system supports multiple authentication methods including OAuth 2.0, API key-based authentication, and JWT tokens. For production environments, we recommend using OAuth 2.0 with PKCE flow for enhanced security.',
  'The rate limiting policy allows up to 1,000 requests per minute for Starter plans and 10,000 requests per minute for Enterprise plans. Rate limit headers are included in every response to help you monitor your usage.',
  'To integrate the widget, add the provided script tag to your HTML. The widget automatically adapts to your site\'s theme and supports custom styling through CSS variables. See the customization guide for detailed options.',
];

const TestConsoleTab = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({ '2': true });
  const [activeSources, setActiveSources] = useState<Source[]>(initialSources);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, typing, scrollToBottom]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || typing) return;
    setInput('');

    const userMsg: Message = { id: String(Date.now()), role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200));
    setTyping(false);

    const answer = fakeResponses[Math.floor(Math.random() * fakeResponses.length)];
    const newSources: Source[] = [
      { doc: 'product-manual.pdf', score: +(Math.random() * 0.3 + 0.7).toFixed(2), text: '...relevant chunk text from the document matching the query...', page: `Page ${Math.floor(Math.random() * 20 + 1)} · Chunk ${Math.floor(Math.random() * 50 + 1)}` },
      { doc: 'api-reference.docx', score: +(Math.random() * 0.3 + 0.5).toFixed(2), text: '...another matching chunk with relevant information about the topic...', page: `Page ${Math.floor(Math.random() * 15 + 1)} · Chunk ${Math.floor(Math.random() * 30 + 1)}` },
    ];

    const aiId = String(Date.now() + 1);
    // Stream effect
    let streamed = '';
    const aiMsg: Message = { id: aiId, role: 'ai', text: '', sources: newSources, latency: `${(Math.random() * 1.5 + 0.8).toFixed(1)}s` };
    setMessages((prev) => [...prev, aiMsg]);
    setActiveSources(newSources);
    setExpandedSources((prev) => ({ ...prev, [aiId]: true }));

    for (let i = 0; i < answer.length; i += 3) {
      streamed = answer.slice(0, i + 3);
      const s = streamed;
      setMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, text: s } : m));
      await new Promise((r) => setTimeout(r, 15));
    }
    setMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, text: answer } : m));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleClear = () => {
    setMessages([]);
    setActiveSources([]);
    setExpandedSources({});
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px-110px)]">
      {/* Chat panel */}
      <div className="flex-1 lg:w-[55%] flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div>
            <div className="text-sm font-semibold text-[#F8FAFC]">Test Console</div>
            <div className="font-mono text-[11px] text-[#475569] mt-0.5">ragfloe / customer-support-bot</div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleClear} className="p-[7px] rounded-md text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8] transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-[7px] rounded-md text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8] transition-colors">
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-5 bg-[#0D0D14] space-y-4">
          {messages.map((m) => (
            <div key={m.id}>
              {m.role === 'user' ? (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-[#475569] mb-1">You</span>
                  <div className="bg-brand-blue text-white rounded-xl rounded-br-sm px-3.5 py-2.5 max-w-[70%] text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-dark-surface-raised border border-dark-border-subtle flex items-center justify-center">
                    <span className="font-mono text-[9px] text-white">RF</span>
                  </div>
                  <div className="min-w-0 max-w-[75%]">
                    <div className="bg-dark-surface border border-dark-border rounded-xl rounded-tl-sm px-3.5 py-3 text-sm text-[#E2E8F0] leading-relaxed">
                      {m.text}
                      {!m.text && <span className="text-[#64748B]">...</span>}
                    </div>
                    {m.sources && m.text && (
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => setExpandedSources((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
                          className="flex items-center gap-1 font-mono text-[11px] text-brand-blue hover:underline"
                        >
                          {m.sources.length} sources retrieved
                          {expandedSources[m.id] ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                        </button>
                        {m.latency && <span className="font-mono text-[11px] text-[#475569]">{m.latency}</span>}
                        <button className="text-gray-700 hover:text-[#94A3B8] transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {expandedSources[m.id] && m.sources && (
                      <div className="mt-2 space-y-1.5">
                        {m.sources.map((s, j) => (
                          <div key={j} className="font-mono text-[10px] text-[#64748B] bg-dark-surface border border-dark-border rounded px-2.5 py-1.5 truncate">
                            <FileText className="w-2.5 h-2.5 inline mr-1" />{s.doc} · <span className="text-brand-green">{s.score}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-dark-surface-raised border border-dark-border-subtle flex items-center justify-center">
                <span className="font-mono text-[9px] text-white">RF</span>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-xl rounded-tl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-dark-border px-6 py-4 bg-dark-bg">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3.5 py-2.5 text-sm text-[#E2E8F0] placeholder-[#475569] resize-none min-h-[44px] max-h-[120px] focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue/10"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || typing}
              className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                input.trim() && !typing
                  ? 'bg-brand-blue hover:bg-brand-blue-dark'
                  : 'bg-dark-border'
              }`}
            >
              <SendHorizontal className={`w-4 h-4 ${input.trim() && !typing ? 'text-white' : 'text-[#475569]'}`} />
            </button>
          </div>
          <p className="font-mono text-[11px] text-gray-700 mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      {/* Source inspector */}
      <div className="hidden lg:flex flex-col w-[45%] border-l border-dark-border bg-dark-bg overflow-y-auto">
        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase text-[#475569] tracking-wide">Retrieved Chunks</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#64748B]">{activeSources.length} chunks</span>
              {activeSources.length > 0 && (
                <span className="font-mono text-[11px] text-brand-green">
                  avg {(activeSources.reduce((a, s) => a + s.score, 0) / activeSources.length).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Source cards */}
          <div className="space-y-3">
            {activeSources.map((s, i) => (
              <div key={i} className="bg-dark-surface border border-dark-border rounded-md p-4 hover:border-dark-border-subtle transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#64748B]">
                    <FileText className="w-2.5 h-2.5" />{s.doc}
                  </span>
                  <span className="font-mono text-xs font-semibold text-brand-green">{s.score}</span>
                </div>
                <div className="h-0.5 bg-dark-border rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.score * 100}%`,
                      background: 'linear-gradient(90deg, #22C55E, #3B82F6)',
                    }}
                  />
                </div>
                <p className="font-mono text-xs text-[#94A3B8] leading-relaxed italic line-clamp-3">{s.text}</p>
                <p className="font-mono text-[10px] text-gray-700 mt-2">{s.page}</p>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div className="mt-4 pt-4 border-t border-dark-border">
            <span className="font-mono text-[11px] uppercase text-[#475569] tracking-wide">Pipeline Execution</span>
            <div className="flex flex-col gap-2 mt-3">
              {pipelineSteps.map((step) => (
                <div key={step.name} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                  <span className="font-mono text-xs text-[#64748B]">{step.name}</span>
                  <span className="font-mono text-xs text-gray-700 ml-auto">{step.duration}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1 border-t border-dark-border mt-1">
                <span className="font-mono text-xs text-[#94A3B8] font-medium">Total: 1,354ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConsoleTab;
