import type { Organization, Project, Document, ApiKey } from '@/types';

export const mockOrg: Organization = {
  id: 'org_1',
  name: "Chakresh kumar's Org",
  plan: 'starter',
};

export const mockProjects: Project[] = [
  { id: 'proj_1', name: 'customer-support-bot', vectorStore: 'Pinecone', llm: 'GPT-4o', documents: 24, queries: 1204, status: 'active' },
  { id: 'proj_2', name: 'product-docs-ai', vectorStore: 'Pinecone', llm: 'Claude 3.5', documents: 18, queries: 538, status: 'active' },
  { id: 'proj_3', name: 'internal-kb', vectorStore: 'pgvector', llm: 'GPT-4o', documents: 5, queries: 100, status: 'indexing' },
];

export const mockDocuments: Document[] = [
  { id: 'doc_1', name: 'product-manual.pdf', type: 'PDF', status: 'completed', chunks: 47, uploaded: '2h ago' },
  { id: 'doc_2', name: 'api-reference.docx', type: 'DOCX', status: 'completed', chunks: 23, uploaded: '1d ago' },
  { id: 'doc_3', name: 'changelog.json', type: 'JSON', status: 'processing', chunks: null, uploaded: 'just now' },
];

export const mockApiKeys: ApiKey[] = [
  { id: 'key_1', name: 'Production Widget', created: 'Feb 15, 2026', lastUsed: '2 min ago' },
  { id: 'key_2', name: 'Dev Testing', created: 'Feb 10, 2026', lastUsed: '1d ago' },
];

export const mockStats = { projects: 3, documents: 47, queries: 1842, avgLatency: '1.3s' };
