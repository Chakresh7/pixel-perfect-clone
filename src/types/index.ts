export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'pro' | 'enterprise';
}

export interface Project {
  id: string;
  name: string;
  vectorStore: string;
  llm: string;
  documents: number;
  queries: number;
  status: 'active' | 'indexing' | 'failed';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'queued' | 'failed';
  chunks: number | null;
  uploaded: string;
}

export interface ApiKey {
  id: string;
  name: string;
  created: string;
  lastUsed: string;
}

export interface QuerySource {
  chunkId: string;
  documentName: string;
  text: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: QuerySource[];
  latency: number;
}
