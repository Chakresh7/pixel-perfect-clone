import { motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, FolderOpen, FileText, Key, Settings, Plus } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: FolderOpen, label: 'Projects', active: true },
  { icon: FileText, label: 'Documents', active: false },
  { icon: Key, label: 'API Keys', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const projects = [
  { name: 'customer-support-bot', store: 'Pinecone', model: 'GPT-4o', status: 'Active', statusColor: 'green' },
  { name: 'product-docs-ai', store: 'Pinecone', model: 'Claude 3.5', status: 'Active', statusColor: 'green' },
  { name: 'internal-kb', store: 'pgvector', model: 'GPT-4o', status: 'Indexing', statusColor: 'amber' },
];

const stats = [
  { value: '3', label: 'PROJECTS' },
  { value: '47', label: 'DOCUMENTS' },
  { value: '1,842', label: 'QUERIES' },
  { value: '1.3s', label: 'AVG LATENCY' },
];

const DashboardMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
    className="max-w-[960px] mx-auto mt-16 rounded-xl border border-gray-200 overflow-hidden shadow-mockup"
  >
    {/* Browser bar */}
    <div className="flex items-center gap-2 h-9 bg-gray-100 border-b border-gray-200 px-4">
      <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
      <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
      <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
      <div className="flex-1 mx-3 h-[22px] rounded border border-gray-200 bg-white flex items-center px-2.5">
        <span className="font-mono text-[10px] text-gray-400">app.ragfloe.io/dashboard</span>
      </div>
    </div>

    {/* Dashboard body */}
    <div className="flex h-[420px] bg-dark-bg">
      {/* Sidebar */}
      <div className="hidden sm:flex flex-col w-[180px] bg-[#0D0D14] border-r border-dark-border flex-shrink-0">
        {/* Org */}
        <div className="px-3 pt-4 pb-3.5 border-b border-dark-border">
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#94A3B8]">
            Chakresh kumar's Org <ChevronDown className="w-2 h-2 text-[#475569]" />
          </div>
          <div className="flex items-center gap-1 mt-1 font-mono text-[9px] text-[#475569]">
            <FolderOpen className="w-2.5 h-2.5" /> Default
          </div>
        </div>

        {/* Nav */}
        <div className="mt-2 flex-1">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-[7px] text-[11px] cursor-pointer ${
                item.active
                  ? 'text-[#F8FAFC] bg-dark-surface-raised border-r-2 border-r-brand-blue'
                  : 'text-[#64748B]'
              }`}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Bottom user */}
        <div className="border-t border-dark-border px-3 py-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-dark-surface-raised flex items-center justify-center text-[8px] text-white font-mono">
            CK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#64748B] truncate">Chakresh Kumar</div>
          </div>
          <span className="font-mono text-[9px] text-[#475569] bg-dark-border px-1 py-0.5 rounded-[3px]">Starter</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-semibold text-[#F8FAFC] font-mono">Projects</span>
          <button className="flex items-center gap-1 bg-brand-blue text-white text-[10px] px-2.5 py-1 rounded">
            <Plus className="w-3 h-3" /> New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-dark-surface border border-dark-border rounded-md px-3 py-2.5">
              <div className="text-base font-bold text-[#F8FAFC] font-mono">{s.value}</div>
              <div className="text-[8px] uppercase text-[#475569] font-mono tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-dark-surface border border-dark-border rounded-md overflow-hidden">
          <div className="grid grid-cols-4 bg-[#0D0D14] border-b border-dark-border px-3 py-[7px]">
            {['NAME', 'VECTOR STORE', 'MODEL', 'STATUS'].map((h) => (
              <span key={h} className="text-[8px] uppercase font-mono text-[#475569] tracking-wide">{h}</span>
            ))}
          </div>
          {projects.map((p, i) => (
            <div key={i} className={`grid grid-cols-4 px-3 py-[9px] ${i < projects.length - 1 ? 'border-b border-[#18181B]' : ''}`}>
              <span className="font-mono text-[10px] text-[#E2E8F0] truncate">{p.name}</span>
              <span className="font-mono text-[10px] text-[#64748B]">{p.store}</span>
              <span className="font-mono text-[10px] text-[#64748B]">{p.model}</span>
              <span>
                <span className={`inline-flex items-center font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                  p.statusColor === 'green'
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {p.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardMockup;
