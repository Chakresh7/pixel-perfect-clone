import { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud, FileText, Trash2, X, Link as LinkIcon, Database as DbIcon,
  Search,
} from 'lucide-react';
import { RagBadge } from '@/components/ragfloe/Badge';
import { mockDocuments } from '@/services/api';
import type { Document } from '@/types';

const formatPills = ['PDF', 'DOCX', 'DOC', 'JSON', 'TXT', 'MD'];

const DocumentsTab = () => {
  const [docs, setDocs] = useState<Document[]>(mockDocuments);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Simulate upload
    const name = e.dataTransfer.files[0]?.name || 'uploaded-file.pdf';
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      name,
      type: name.split('.').pop()?.toUpperCase() || 'PDF',
      status: 'processing',
      chunks: null,
      uploaded: 'just now',
    };
    setDocs((prev) => [newDoc, ...prev]);
    // Simulate completion
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => d.id === newDoc.id ? { ...d, status: 'completed', chunks: Math.floor(Math.random() * 40) + 5 } : d)
      );
    }, 2000);
  }, []);

  return (
    <div className="p-8">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-[10px] bg-[#0D0D14] p-10 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? 'border-brand-blue bg-brand-blue/[0.04]' : 'border-dark-border-subtle'
        }`}
      >
        <input ref={fileRef} type="file" className="hidden" multiple />
        <UploadCloud className={`w-9 h-9 mx-auto ${dragOver ? 'text-brand-blue' : 'text-brand-blue'}`} />
        <p className="text-[15px] font-medium text-[#94A3B8] mt-4">
          {dragOver ? 'Drop your files here' : 'Drag & drop files here'}
        </p>
        <p className="text-[13px] text-[#475569] mt-1">or click to browse your computer</p>
        <div className="flex justify-center gap-2 flex-wrap mt-4">
          {formatPills.map((f) => (
            <span key={f} className="font-mono text-[10px] text-[#64748B] bg-dark-surface border border-dark-border-subtle rounded px-2 py-0.5">{f}</span>
          ))}
        </div>
      </div>

      {/* Upload actions */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-[11px] text-gray-700">Max 50MB per file · Supported: PDF, DOCX, JSON, TXT, MD</span>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B] border border-dark-border px-2.5 py-1 rounded-md hover:border-gray-600 hover:text-[#94A3B8] transition-colors">
            <LinkIcon className="w-3 h-3" /> Ingest from URL
          </button>
          <button className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B] border border-dark-border px-2.5 py-1 rounded-md hover:border-gray-600 hover:text-[#94A3B8] transition-colors">
            <DbIcon className="w-3 h-3" /> Connect Database
          </button>
        </div>
      </div>

      {/* Documents header */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#F8FAFC]">Documents</h3>
          <span className="font-mono text-[11px] text-[#64748B] bg-dark-border px-2 py-0.5 rounded">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-[30px] bg-dark-surface border border-dark-border rounded-md font-mono text-xs text-[#94A3B8] px-3 focus:border-brand-blue focus:outline-none"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#475569]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-44 h-[30px] pl-7 pr-3 bg-dark-surface border border-dark-border rounded-md font-mono text-xs text-[#E2E8F0] placeholder-[#475569] focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-[2.5fr_70px_100px_60px_90px_60px] bg-[#0D0D14] border-b border-dark-border px-5 py-2.5">
          {['FILENAME', 'TYPE', 'STATUS', 'CHUNKS', 'UPLOADED', ''].map((h) => (
            <span key={h || 'act'} className="font-mono text-[10px] uppercase text-[#475569] tracking-wide">{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 rounded-lg bg-dark-surface-raised flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <p className="text-[15px] text-[#94A3B8] font-medium mt-4">No documents yet</p>
            <p className="text-[13px] text-[#475569] mt-1">Upload your first file to start indexing.</p>
          </div>
        ) : (
          filtered.map((d, i) => (
            <div key={d.id}>
              <div className={`grid grid-cols-1 md:grid-cols-[2.5fr_70px_100px_60px_90px_60px] items-center px-5 py-3.5 hover:bg-dark-surface-raised transition-colors ${
                i < filtered.length - 1 ? 'border-b border-[#18181B]' : ''
              }`}>
                {/* Filename */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-dark-surface-raised flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>
                  <span className="font-mono text-[13px] text-[#E2E8F0]">{d.name}</span>
                </div>
                {/* Type */}
                <span className="hidden md:inline font-mono text-[10px] text-[#64748B] bg-dark-surface-raised border border-dark-border-subtle rounded px-2 py-0.5 w-fit">{d.type}</span>
                {/* Status */}
                <div className="hidden md:block">
                  <RagBadge
                    variant={d.status === 'completed' ? 'success' : d.status === 'processing' ? 'warning' : 'error'}
                    pulse={d.status === 'processing'}
                  >
                    {d.status === 'completed' ? 'Completed' : d.status === 'processing' ? 'Processing' : 'Failed'}
                  </RagBadge>
                </div>
                {/* Chunks */}
                <span className="hidden md:block font-mono text-[13px] text-[#64748B]">{d.chunks ?? '—'}</span>
                {/* Uploaded */}
                <span className="hidden md:block text-xs text-[#475569]">{d.uploaded}</span>
                {/* Action */}
                <div className="hidden md:flex justify-end">
                  <button
                    onClick={() => d.status === 'processing' ? handleDelete(d.id) : handleDelete(d.id)}
                    className="p-1 text-gray-700 hover:text-brand-red transition-colors"
                  >
                    {d.status === 'processing' ? <X className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {/* Processing progress bar */}
              {d.status === 'processing' && (
                <div className="px-5 pb-3">
                  <div className="h-[3px] bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-amber rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
