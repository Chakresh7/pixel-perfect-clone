import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderOpen, FileText, MessageSquare, Zap, Plus, TrendingUp,
  Search, MoreHorizontal, ChevronRight, Upload, Code,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { RagBadge } from '@/components/ragfloe/Badge';
import { mockProjects, mockStats } from '@/services/api';

const stats = [
  { label: 'TOTAL PROJECTS', icon: FolderOpen, value: String(mockStats.projects), trend: '+1 this month', positive: true },
  { label: 'DOCUMENTS INDEXED', icon: FileText, value: String(mockStats.documents), trend: '+12 this week', positive: true },
  { label: 'TOTAL QUERIES', icon: MessageSquare, value: '1,842', trend: '+284 today', positive: true },
  { label: 'AVG LATENCY', icon: Zap, value: mockStats.avgLatency, trend: 'p95: 3.2s', positive: false },
];

const quickActions = [
  { icon: Upload, title: 'Upload Documents', sub: 'Add PDFs, docs, or JSON to your project', route: '/dashboard/projects/proj_1/documents' },
  { icon: MessageSquare, title: 'Test Console', sub: 'Query your RAG pipeline interactively', route: '/dashboard/projects/proj_1/test' },
  { icon: Code, title: 'API Reference', sub: 'View endpoints and start integrating', route: '#', external: true },
];

const gridCols = 'grid-cols-[2fr_120px_120px_80px_100px_100px_80px]';

const Overview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout breadcrumb="Overview">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-7">
          <div>
            <h1 className="text-[22px] font-bold text-[#F8FAFC] tracking-tight">Dashboard</h1>
            <p className="text-[13px] font-mono text-[#64748B] mt-1">Chakresh kumar's Org · Starter plan</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <a href="#" className="inline-flex items-center text-[13px] text-[#64748B] border border-dark-border-subtle rounded-md px-3 py-1.5 hover:border-gray-600 hover:text-[#94A3B8] transition-colors">
              Documentation ↗
            </a>
            <button
              onClick={() => navigate('/dashboard/new')}
              className="inline-flex items-center gap-1.5 bg-brand-blue text-white text-[13px] font-medium px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-dark-surface border border-dark-border rounded-lg p-5 h-[120px] animate-shimmer" />
              ))
            : stats.map((s) => (
                <div key={s.label} className="bg-dark-surface border border-dark-border rounded-lg p-5 hover:border-dark-border-subtle transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase text-[#475569] tracking-wide">{s.label}</span>
                    <s.icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="font-mono text-[30px] font-bold text-[#F8FAFC] tracking-tight mt-3">{s.value}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {s.positive && <TrendingUp className="w-2.5 h-2.5 text-brand-green" />}
                    <span className={`text-xs ${s.positive ? 'text-brand-green' : 'text-[#64748B]'}`}>{s.trend}</span>
                  </div>
                </div>
              ))}
        </div>

        {/* Projects table */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-[#F8FAFC]">Your Projects</h2>
              <span className="font-mono text-[11px] text-[#64748B] bg-dark-border px-2 py-0.5 rounded">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#475569]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-48 h-8 pl-8 pr-3 bg-dark-surface border border-dark-border rounded-md font-mono text-xs text-[#E2E8F0] placeholder-[#475569] focus:border-brand-blue focus:outline-none transition-colors"
                />
              </div>
              <Link to="/dashboard/new" className="text-[13px] text-brand-blue hover:underline">New Project</Link>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className={`hidden lg:grid ${gridCols} bg-[#0D0D14] border-b border-dark-border px-5 py-2.5`}>
              {['NAME', 'VECTOR STORE', 'LLM MODEL', 'DOCS', 'QUERIES', 'STATUS', ''].map((h) => (
                <span key={h || 'action'} className="font-mono text-[10px] uppercase text-[#475569] tracking-wide">{h}</span>
              ))}
            </div>

            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-4 border-b border-[#18181B] last:border-0">
                  <div className="h-4 animate-shimmer rounded w-full" style={{ animationDelay: `${i * 100}ms` }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 rounded-lg bg-dark-surface-raised flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-[15px] text-[#94A3B8] font-medium mt-4">No projects yet</p>
                <p className="text-[13px] text-[#475569] mt-1">Create your first project to start building.</p>
                <button
                  onClick={() => navigate('/dashboard/new')}
                  className="mt-5 inline-flex items-center gap-1.5 bg-brand-blue text-white text-[13px] font-medium px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> New Project
                </button>
              </div>
            ) : (
              filtered.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dashboard/projects/${p.id}/documents`)}
                  className={`grid grid-cols-1 lg:grid-cols-[2fr_120px_120px_80px_100px_100px_80px] items-center px-5 py-3.5 cursor-pointer hover:bg-dark-surface-raised transition-colors ${
                    i < filtered.length - 1 ? 'border-b border-[#18181B]' : ''
                  }`}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-brand-green' : 'bg-brand-amber'}`} />
                    <span className="font-mono text-[13px] font-medium text-[#E2E8F0]">{p.name}</span>
                  </div>
                  {/* Vector store */}
                  <div className="hidden lg:block">
                    <span className="font-mono text-[11px] text-[#64748B] bg-dark-surface-raised border border-dark-border-subtle rounded px-2 py-0.5">{p.vectorStore}</span>
                  </div>
                  {/* LLM */}
                  <div className="hidden lg:block">
                    <span className="font-mono text-[11px] text-[#64748B] bg-dark-surface-raised border border-dark-border-subtle rounded px-2 py-0.5">{p.llm}</span>
                  </div>
                  {/* Docs */}
                  <span className="hidden lg:block font-mono text-[13px] text-[#64748B]">{p.documents}</span>
                  {/* Queries */}
                  <span className="hidden lg:block font-mono text-[13px] text-[#64748B]">{p.queries.toLocaleString()}</span>
                  {/* Status */}
                  <div className="hidden lg:block">
                    <RagBadge variant={p.status === 'active' ? 'active' : 'indexing'} pulse>
                      {p.status === 'active' ? 'Active' : 'Indexing'}
                    </RagBadge>
                  </div>
                  {/* Actions */}
                  <div className="hidden lg:flex items-center gap-2 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/${p.id}/documents`); }}
                      className="font-mono text-[11px] text-[#64748B] border border-dark-border px-2 py-1 rounded hover:border-[#94A3B8] hover:text-[#94A3B8] transition-colors"
                    >
                      Connect →
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[#475569] hover:text-[#94A3B8] transition-colors"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.title}
              to={a.route}
              target={a.external ? '_blank' : undefined}
              className="flex items-center gap-4 bg-dark-surface border border-dark-border rounded-lg p-5 hover:border-dark-border-subtle hover:bg-dark-surface-raised cursor-pointer transition-all duration-150"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dark-surface-raised border border-dark-border-subtle flex items-center justify-center">
                <a.icon className="w-[18px] h-[18px] text-[#64748B]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#E2E8F0]">{a.title}</div>
                <div className="text-xs text-[#475569] mt-0.5">{a.sub}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
