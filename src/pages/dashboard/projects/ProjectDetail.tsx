import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Database, Cpu, FileText, Activity, Settings as SettingsIcon,
  MessageSquare,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DocumentsTab from '@/components/project/DocumentsTab';
import TestConsoleTab from '@/components/project/TestConsoleTab';
import { StatusDot } from '@/components/ragfloe/StatusDot';
import { mockProjects } from '@/services/api';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'documents', label: 'Documents' },
  { key: 'configuration', label: 'Configuration' },
  { key: 'test', label: 'Test Console' },
  { key: 'deploy', label: 'Deploy' },
  { key: 'analytics', label: 'Analytics' },
];

const ProjectDetail = () => {
  const { id, tab: urlTab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(urlTab || 'documents');

  const project = mockProjects.find((p) => p.id === id) || mockProjects[0];
  const status = project.status as 'active' | 'indexing' | 'failed';

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <DashboardLayout breadcrumb={['Projects', project.name]}>
      {/* Project header */}
      <div className="px-8 pt-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusDot status={status} />
              <span className="font-mono text-[11px] text-[#64748B]">{project.name}</span>
            </div>
            <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {[
                { icon: Database, text: project.vectorStore },
                { icon: Cpu, text: project.llm },
                { icon: FileText, text: `${project.documents} documents` },
                { icon: Activity, text: `${project.queries.toLocaleString()} queries` },
              ].map((m) => (
                <span key={m.text} className="flex items-center gap-1.5 font-mono text-[11px] text-[#475569]">
                  <m.icon className="w-2.5 h-2.5" /> {m.text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button className="p-[7px] rounded-md text-[#64748B] border border-dark-border hover:bg-dark-surface hover:text-[#94A3B8] transition-colors">
              <SettingsIcon className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] border border-dark-border px-3 py-1.5 rounded-md hover:border-gray-600 hover:text-[#94A3B8] transition-colors">
              View API Docs ↗
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className="inline-flex items-center gap-1.5 bg-brand-blue text-white text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-brand-blue-dark transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Test
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-dark-border flex overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={cn(
              'px-5 py-3.5 text-[13px] border-b-2 transition-all duration-150 whitespace-nowrap',
              activeTab === t.key
                ? 'text-[#F8FAFC] font-medium border-brand-blue'
                : 'text-[#64748B] border-transparent hover:text-[#94A3B8]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'documents' && <DocumentsTab />}
      {activeTab === 'test' && <TestConsoleTab />}
      {activeTab === 'configuration' && (
        <div className="p-8"><p className="text-sm text-[#64748B]">Configuration — coming soon.</p></div>
      )}
      {activeTab === 'deploy' && (
        <div className="p-8"><p className="text-sm text-[#64748B]">Deploy — coming soon.</p></div>
      )}
      {activeTab === 'analytics' && (
        <div className="p-8"><p className="text-sm text-[#64748B]">Analytics — coming soon.</p></div>
      )}
    </DashboardLayout>
  );
};

export default ProjectDetail;
