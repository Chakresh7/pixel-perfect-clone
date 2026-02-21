import { motion } from 'framer-motion';
import { Upload, Sparkles, Database, GitBranch, Shield, Zap } from 'lucide-react';
import { SectionLabel } from '@/components/ragfloe/SectionLabel';

const features = [
  { icon: Upload, title: 'Data Ingestion', desc: 'Unified processing for PDFs, databases, and APIs without custom parsers.', tags: ['PDF', 'DOCX', 'JSON', 'SQL', 'API'] },
  { icon: Sparkles, title: 'Embeddings', desc: 'Generate and manage vector embeddings with full model control.', tags: ['OpenAI', 'Cohere'] },
  { icon: Database, title: 'Vector Store', desc: 'Semantic search across multiple vector databases with one interface.', tags: ['Pinecone', 'pgvector', 'Qdrant'] },
  { icon: GitBranch, title: 'RAG Pipeline', desc: 'Configure chunking, retrieval, and generation. Zero black boxes.', tags: ['Dense', 'Hybrid', 'Rerank'] },
  { icon: Shield, title: 'Multi-Tenant', desc: 'Complete data isolation per project with enterprise-grade security.', tags: ['RBAC', 'Audit Logs'] },
  { icon: Zap, title: 'Deploy Anywhere', desc: 'Ship as a REST API, embeddable widget, or native SDK.', tags: ['API', 'Widget', 'SDK'] },
];

const FeaturesSection = () => (
  <section id="features" className="bg-white py-24 px-6 md:px-12">
    <div className="max-w-[1100px] mx-auto">
      <SectionLabel>PLATFORM</SectionLabel>
      <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-tighter text-brand-black max-w-[480px] mt-3 mb-12">
        Everything you need to ship RAG
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white p-7 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 border border-gray-200">
              <f.icon className="w-[18px] h-[18px] text-gray-700" />
            </div>
            <h3 className="text-[15px] font-semibold text-brand-black mt-4 tracking-snug">{f.title}</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mt-1.5 mb-4">{f.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {f.tags.map((t) => (
                <span key={t} className="font-mono text-[11px] text-gray-500 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
