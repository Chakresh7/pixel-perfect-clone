import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

/* ─── Data ─── */
const queryData = [
  { date: 'Feb 15', queries: 142, tokens: 18400 },
  { date: 'Feb 16', queries: 198, tokens: 24200 },
  { date: 'Feb 17', queries: 87, tokens: 10800 },
  { date: 'Feb 18', queries: 64, tokens: 7900 },
  { date: 'Feb 19', queries: 312, tokens: 39800 },
  { date: 'Feb 20', queries: 276, tokens: 35400 },
  { date: 'Feb 21', queries: 163, tokens: 21200 },
];

const latencyData = [
  { date: 'Feb 15', p50: 980, p90: 2100, p95: 3200 },
  { date: 'Feb 16', p50: 1050, p90: 2300, p95: 3400 },
  { date: 'Feb 17', p50: 870, p90: 1900, p95: 2800 },
  { date: 'Feb 18', p50: 920, p90: 2000, p95: 3000 },
  { date: 'Feb 19', p50: 1200, p90: 2800, p95: 4100 },
  { date: 'Feb 20', p50: 1100, p90: 2400, p95: 3600 },
  { date: 'Feb 21', p50: 1030, p90: 2200, p95: 3300 },
];

const statusData = [
  { status: 'Success', count: 1812, fill: '#22C55E' },
  { status: 'Fallback', count: 21, fill: '#F59E0B' },
  { status: 'Failed', count: 9, fill: '#EF4444' },
];

const topQueries = [
  { q: 'What is the refund policy?', count: 284 },
  { q: 'How do I cancel my subscription?', count: 198 },
  { q: 'What payment methods are accepted?', count: 167 },
  { q: 'How long does shipping take?', count: 143 },
  { q: 'Can I change my order after placing it?', count: 98 },
];

const docPerf = [
  { name: 'product-manual.pdf', chunks: 47, citations: 892, hitRate: 94.2, lastCited: '2 min ago' },
  { name: 'api-reference.docx', chunks: 23, citations: 487, hitRate: 78.4, lastCited: '15 min ago' },
  { name: 'changelog.json', chunks: 5, citations: null, hitRate: null, lastCited: '—' },
];

const stats = [
  { label: 'Total Queries', value: '1,842', trend: '↑ 23% vs last period', color: 'text-brand-green' },
  { label: 'Avg Latency', value: '1.3s', trend: '↓ 0.2s improvement', color: 'text-brand-green' },
  { label: 'Success Rate', value: '98.4%', trend: '↑ 0.6%', color: 'text-brand-green' },
  { label: 'Tokens Used', value: '284K', trend: '↑ 31K this period', color: 'text-[hsl(215,20%,42%)]' },
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-dark-surface border border-dark-border-subtle rounded-md px-3 py-2 shadow-elevated">
        <p className="text-[11px] font-mono text-[hsl(215,20%,42%)] mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-[13px] font-mono font-bold" style={{ color: entry.color || entry.stroke }}>
            {typeof entry.value === 'number' && entry.value > 1000 ? entry.value.toLocaleString() : entry.value}
            {entry.name?.startsWith('p') ? 'ms' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Pill Tabs ─── */
const PillTabs = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex gap-1.5">
    {options.map((o) => (
      <button key={o} onClick={() => onChange(o)} className={cn(
        'text-[11px] font-mono px-3 py-1.5 rounded-md border transition-colors',
        value === o ? 'bg-brand-blue border-brand-blue text-white' : 'border-dark-border-subtle text-[hsl(215,20%,42%)] hover:text-[hsl(215,20%,65%)]'
      )}>{o}</button>
    ))}
  </div>
);

const cardCls = 'bg-dark-surface border border-dark-border rounded-lg';

/* ─── Main Component ─── */
const AnalyticsTab = () => {
  const [range, setRange] = useState('7 days');
  const [chartMode, setChartMode] = useState<'Queries' | 'Tokens'>('Queries');

  return (
    <div className="p-8">
      {/* Date Range */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(215,20%,42%)]">Last</span>
          <PillTabs options={['7 days', '30 days', '90 days']} value={range} onChange={setRange} />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className={cn(cardCls, 'p-5')}>
            <p className="text-[11px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-[hsl(210,40%,98%)] mt-1 font-mono">{s.value}</p>
            <p className={cn('text-[11px] font-mono mt-1', s.color)}>{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Queries Over Time */}
      <div className={cn(cardCls, 'p-6 mb-4')}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)]">Queries Over Time</h3>
            <p className="text-xs text-[hsl(215,14%,35%)] mt-1">Daily query volume for the last 7 days</p>
          </div>
          <PillTabs options={['Queries', 'Tokens']} value={chartMode} onChange={(v) => setChartMode(v as any)} />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={queryData}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1C28" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area type="monotone" dataKey={chartMode === 'Queries' ? 'queries' : 'tokens'} stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)" animationDuration={400} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Latency */}
      <div className={cn(cardCls, 'p-6 mb-4')}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)]">Response Latency</h3>
            <p className="text-xs text-[hsl(215,14%,35%)] mt-1">p50, p90, p95 latency over time</p>
          </div>
          <div className="flex gap-3">
            {[{ l: 'p50', c: '#22C55E' }, { l: 'p90', c: '#F59E0B' }, { l: 'p95', c: '#EF4444' }].map((x) => (
              <span key={x.l} className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: x.c }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} />{x.l}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1C28" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line type="monotone" dataKey="p50" stroke="#22C55E" strokeWidth={2} dot={false} animationDuration={400} />
            <Line type="monotone" dataKey="p90" stroke="#F59E0B" strokeWidth={2} dot={false} animationDuration={400} />
            <Line type="monotone" dataKey="p95" stroke="#EF4444" strokeWidth={2} dot={false} animationDuration={400} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Status + Top Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Query Breakdown */}
        <div className={cn(cardCls, 'p-6')}>
          <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">Query Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#64748B' }} tickLine={false} axisLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#18181F', radius: [0, 4, 4, 0] as any }} animationDuration={400}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-0">
            {[
              { l: 'Success', v: '1,812', p: '98.4%', c: 'text-brand-green' },
              { l: 'Fallback', v: '21', p: '1.1%', c: 'text-brand-amber' },
              { l: 'Failed', v: '9', p: '0.5%', c: 'text-brand-red' },
            ].map((r) => (
              <div key={r.l} className="flex justify-between py-2 border-b border-dark-border last:border-0">
                <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{r.l}</span>
                <span className={cn('text-xs font-mono', r.c)}>{r.v} · {r.p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Queries */}
        <div className={cn(cardCls, 'p-6')}>
          <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">Top Queries</h3>
          <div className="space-y-0">
            {topQueries.map((q, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-dark-border last:border-0">
                <span className="text-[11px] font-mono font-bold text-[hsl(240,4%,24%)] w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[13px] text-[hsl(215,20%,65%)] leading-snug flex-1 line-clamp-2">{q.q}</p>
                <span className="text-[10px] font-mono bg-dark-surface-raised border border-dark-border-subtle text-[hsl(215,20%,42%)] px-2 py-0.5 rounded shrink-0">{q.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Performance */}
      <div className={cn(cardCls, 'overflow-hidden')}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-dark-border">
          <div>
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)]">Document Performance</h3>
            <p className="text-xs text-[hsl(215,14%,35%)]">How often each document contributes to answers</p>
          </div>
        </div>
        <div className="grid grid-cols-[2.5fr_100px_100px_120px_100px] items-center px-5 py-2.5 bg-[hsl(240,15%,4%)] border-b border-dark-border">
          {['DOCUMENT', 'CHUNKS', 'CITATIONS', 'HIT RATE', 'LAST CITED'].map((h) => (
            <span key={h} className="text-[10px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-wider">{h}</span>
          ))}
        </div>
        {docPerf.map((d) => (
          <div key={d.name} className="grid grid-cols-[2.5fr_100px_100px_120px_100px] items-center px-5 py-3 border-b border-dark-border last:border-0 hover:bg-dark-surface-raised/50 transition-colors">
            <span className="text-[13px] font-mono text-[hsl(214,32%,91%)]">{d.name}</span>
            <span className={cn('text-xs font-mono', d.name === 'changelog.json' ? 'text-brand-amber' : 'text-[hsl(215,20%,42%)]')}>{d.chunks}</span>
            <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{d.citations ?? '—'}</span>
            <div>
              {d.hitRate != null ? (
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-mono', d.hitRate > 80 ? 'text-brand-green' : d.hitRate > 50 ? 'text-brand-amber' : 'text-brand-red')}>{d.hitRate}%</span>
                  <div className="w-12 h-1 bg-dark-surface-raised rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', d.hitRate > 80 ? 'bg-brand-green' : d.hitRate > 50 ? 'bg-brand-amber' : 'bg-brand-red')} style={{ width: `${d.hitRate}%` }} />
                  </div>
                </div>
              ) : <span className="text-xs font-mono text-[hsl(215,20%,42%)]">—</span>}
            </div>
            <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{d.lastCited}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTab;
