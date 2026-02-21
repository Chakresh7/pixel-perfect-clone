import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockProjects } from '@/services/api';
import { StatusDot } from '@/components/ragfloe/StatusDot';
import { cn } from '@/lib/utils';

/* ─── Data ─── */
const days14 = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 1, 8 + i);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const crossProjectData = days14.map((date, i) => ({
  date,
  'customer-support-bot': Math.round(80 + Math.sin(i * 0.7) * 40 + Math.random() * 30),
  'product-docs-ai': Math.round(30 + Math.sin(i * 0.5 + 1) * 20 + Math.random() * 15),
  'internal-kb': Math.round(5 + Math.random() * 10),
}));

const tokenPieData = [
  { name: 'customer-support-bot', value: 193120, fill: '#3B82F6' },
  { name: 'product-docs-ai', value: 76680, fill: '#8B5CF6' },
  { name: 'internal-kb', value: 14200, fill: '#22C55E' },
];

const costRows = [
  { label: 'Embedding generation', value: '$3.20' },
  { label: 'LLM queries', value: '$8.40' },
  { label: 'Vector store reads', value: '$0.80' },
];

const topStats = [
  { label: 'Total Queries', value: '1,842' },
  { label: 'Documents Indexed', value: '47' },
  { label: 'Active Projects', value: '3' },
  { label: 'Est. Monthly Cost', value: '$12.40', trend: '↑ $2.10', color: 'text-brand-amber' },
];

const projectColors: Record<string, string> = {
  'customer-support-bot': '#3B82F6',
  'product-docs-ai': '#8B5CF6',
  'internal-kb': '#22C55E',
};

/* ─── Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-dark-surface border border-dark-border-subtle rounded-md px-3 py-2 shadow-elevated">
        <p className="text-[11px] font-mono text-[hsl(215,20%,42%)] mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-[12px] font-mono" style={{ color: entry.color || entry.stroke }}>
            <span className="font-bold">{entry.value}</span> <span className="text-[10px] text-[hsl(215,14%,35%)]">{entry.name}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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

const Analytics = () => {
  const [range, setRange] = useState('7 days');
  const navigate = useNavigate();

  return (
    <DashboardLayout breadcrumb="Analytics">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-[hsl(210,40%,98%)] tracking-tight">Analytics</h1>
            <p className="text-[13px] font-mono text-[hsl(215,20%,42%)] mt-1">Platform-wide usage across all projects</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(215,20%,42%)]">Last</span>
            <PillTabs options={['7 days', '30 days', '90 days']} value={range} onChange={setRange} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {topStats.map((s) => (
            <div key={s.label} className={cn(cardCls, 'p-5')}>
              <p className="text-[11px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-[hsl(210,40%,98%)] mt-1 font-mono">{s.value}</p>
              {s.trend && <p className={cn('text-[11px] font-mono mt-1', s.color)}>{s.trend}</p>}
            </div>
          ))}
        </div>

        {/* Cross-project chart */}
        <div className={cn(cardCls, 'p-6 mb-4')}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)]">All Projects — Query Volume</h3>
            <div className="flex gap-3">
              {Object.entries(projectColors).map(([name, color]) => (
                <span key={name} className="flex items-center gap-1.5 text-[11px] font-mono text-[hsl(215,20%,42%)]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />{name}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={crossProjectData}>
              <defs>
                {Object.entries(projectColors).map(([name, color]) => (
                  <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C1C28" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#475569' }} tickLine={false} axisLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              {Object.entries(projectColors).map(([name, color]) => (
                <Area key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2} fill={`url(#grad-${name})`} animationDuration={400} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Comparison Table */}
        <div className={cn(cardCls, 'overflow-hidden mb-4')}>
          <div className="px-5 py-4 border-b border-dark-border">
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)]">Project Comparison</h3>
          </div>
          <div className="grid grid-cols-[2fr_120px_100px_100px_100px_100px] items-center px-5 py-2.5 bg-[hsl(240,15%,4%)] border-b border-dark-border">
            {['PROJECT', 'VECTOR STORE', 'DOCUMENTS', 'QUERIES (7D)', 'AVG LATENCY', 'STATUS'].map((h) => (
              <span key={h} className="text-[10px] uppercase font-mono text-[hsl(215,14%,35%)] tracking-wider">{h}</span>
            ))}
          </div>
          {mockProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/dashboard/projects/${p.id}`)}
              className="grid grid-cols-[2fr_120px_100px_100px_100px_100px] items-center px-5 py-3 border-b border-dark-border last:border-0 hover:bg-dark-surface-raised/50 transition-colors cursor-pointer"
            >
              <span className="text-[13px] font-mono text-[hsl(214,32%,91%)]">{p.name}</span>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{p.vectorStore}</span>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{p.documents}</span>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{p.queries.toLocaleString()}</span>
              <span className="text-xs font-mono text-[hsl(215,20%,42%)]">1.3s</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status={p.status as any} />
                <span className="text-xs font-mono text-[hsl(215,20%,42%)] capitalize">{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Usage + Costs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Token Usage Donut */}
          <div className={cn(cardCls, 'p-6')}>
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">Token Usage Breakdown</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={tokenPieData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    dataKey="value"
                    animationDuration={400}
                    stroke="none"
                  >
                    {tokenPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-mono font-bold text-[hsl(210,40%,98%)]">284K</span>
                <span className="text-[10px] font-mono text-[hsl(215,14%,35%)]">tokens</span>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {tokenPieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-mono text-[hsl(215,20%,42%)]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />{d.name}
                  </span>
                  <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{(d.value / 1000).toFixed(0)}K · {Math.round(d.value / 2840)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className={cn(cardCls, 'p-6')}>
            <h3 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">Estimated Costs</h3>
            <div className="space-y-0">
              {costRows.map((r) => (
                <div key={r.label} className="flex justify-between py-3 border-b border-dark-border">
                  <span className="text-xs font-mono text-[hsl(215,20%,42%)]">{r.label}</span>
                  <span className="text-xs font-mono text-[hsl(215,20%,65%)]">{r.value}</span>
                </div>
              ))}
              <div className="border-t border-dark-border-subtle mt-1" />
              <div className="flex justify-between py-3">
                <span className="text-xs font-mono text-[hsl(210,40%,98%)] font-bold">Total (Feb 2026)</span>
                <span className="text-xs font-mono text-[hsl(210,40%,98%)] font-bold">$12.40</span>
              </div>
            </div>
            <p className="text-[11px] text-[hsl(240,4%,24%)] mt-4">Costs are estimates based on API usage. Actual billing from providers may differ.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
