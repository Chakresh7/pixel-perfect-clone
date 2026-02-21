import { RagButton } from '@/components/ragfloe/Button';
import { RagBadge } from '@/components/ragfloe/Badge';
import { RagInput } from '@/components/ragfloe/Input';
import { RagCard } from '@/components/ragfloe/Card';
import { CodeBlock } from '@/components/ragfloe/CodeBlock';
import { StatusDot } from '@/components/ragfloe/StatusDot';
import { DataTable } from '@/components/ragfloe/DataTable';
import { SectionLabel } from '@/components/ragfloe/SectionLabel';
import { EmptyState } from '@/components/ragfloe/EmptyState';
import { FolderOpen } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8 space-y-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tightest mb-2">RagFloe Design System</h1>
        <p className="text-muted-foreground text-sm">Component showcase — all foundation pieces.</p>
      </div>

      {/* Section Label */}
      <section>
        <SectionLabel>Section Labels</SectionLabel>
        <div className="mt-2 flex gap-4">
          <SectionLabel variant="light">Light Label</SectionLabel>
          <SectionLabel variant="dark">Dark Label</SectionLabel>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <SectionLabel>Buttons</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-3">
          <RagButton variant="primary">Primary</RagButton>
          <RagButton variant="primary-dark">Primary Dark</RagButton>
          <RagButton variant="ghost">Ghost</RagButton>
          <RagButton variant="danger">Danger</RagButton>
          <RagButton variant="primary" loading>Loading</RagButton>
          <RagButton variant="primary" size="sm">Small</RagButton>
          <RagButton variant="primary" size="lg">Large</RagButton>
        </div>
      </section>

      {/* Badges */}
      <section>
        <SectionLabel>Badges</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-3">
          <RagBadge variant="success">Success</RagBadge>
          <RagBadge variant="warning">Warning</RagBadge>
          <RagBadge variant="error">Error</RagBadge>
          <RagBadge variant="info">Info</RagBadge>
          <RagBadge variant="neutral">Neutral</RagBadge>
          <RagBadge variant="active" pulse>Active</RagBadge>
          <RagBadge variant="indexing" pulse>Indexing</RagBadge>
        </div>
      </section>

      {/* Status Dots */}
      <section>
        <SectionLabel>Status Dots</SectionLabel>
        <div className="mt-3 flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm"><StatusDot status="active" /> Active</span>
          <span className="flex items-center gap-2 text-sm"><StatusDot status="indexing" /> Indexing</span>
          <span className="flex items-center gap-2 text-sm"><StatusDot status="failed" /> Failed</span>
          <span className="flex items-center gap-2 text-sm"><StatusDot status="queued" /> Queued</span>
        </div>
      </section>

      {/* Input */}
      <section>
        <SectionLabel>Inputs</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <RagInput label="Project Name" placeholder="my-rag-project" variant="light" />
          <RagInput label="API Key" placeholder="sk-..." variant="light" error="Required field" />
        </div>
      </section>

      {/* Cards */}
      <section>
        <SectionLabel>Cards</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <RagCard variant="light" hover>
            <div className="p-4">
              <p className="font-semibold text-sm">Light Card</p>
              <p className="text-xs text-gray-500 mt-1">Hover for shadow effect</p>
            </div>
          </RagCard>
          <RagCard variant="dark" hover>
            <div className="p-4">
              <p className="font-semibold text-sm text-gray-100">Dark Card</p>
              <p className="text-xs text-gray-500 mt-1">Hover for border effect</p>
            </div>
          </RagCard>
        </div>
      </section>

      {/* Code Block */}
      <section>
        <SectionLabel>Code Block</SectionLabel>
        <div className="mt-3">
          <CodeBlock
            title="api-example.js"
            language="javascript"
            code={`const response = await fetch("https://api.ragfloe.com/v1/query", {
  method: "POST",
  headers: { "Authorization": "Bearer sk-..." },
  body: JSON.stringify({ query: "How do I reset my password?" })
});
# Returns relevant documents and AI answer
const data = await response.json();
console.log(data.answer); // 1204 queries processed`}
          />
        </div>
      </section>

      {/* Data Table */}
      <section>
        <SectionLabel>Data Table</SectionLabel>
        <div className="mt-3">
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'type', label: 'Type', width: '80px' },
              { key: 'status', label: 'Status', width: '120px' },
              { key: 'chunks', label: 'Chunks', width: '80px' },
            ]}
            rows={[
              { name: 'product-manual.pdf', type: 'PDF', status: 'completed', chunks: '47' },
              { name: 'api-reference.docx', type: 'DOCX', status: 'completed', chunks: '23' },
              { name: 'changelog.json', type: 'JSON', status: 'processing', chunks: '—' },
            ]}
            onRowClick={(row) => console.log(row)}
          />
        </div>
      </section>

      {/* Empty State */}
      <section>
        <SectionLabel>Empty State</SectionLabel>
        <div className="mt-3">
          <EmptyState
            icon={FolderOpen}
            title="No documents yet"
            description="Upload your first document to start building your knowledge base."
            action={{ label: 'Upload Document', onClick: () => {} }}
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
