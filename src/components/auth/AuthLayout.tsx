import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const bullets = [
  'Upload any data source — PDFs, databases, APIs, or web content',
  'Configure your pipeline with complete transparency and control',
  'Deploy as a widget, REST API, or SDK in minutes',
];

const tags = ['ragfloe', 'customer-support-bot', 'product-docs-ai'];

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen">
    {/* Left panel */}
    <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-200 flex flex-col px-6 py-10 md:px-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-brand-black">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-brand-black">RagFloe</span>
      </Link>

      {/* Form area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="w-full max-w-[360px]">
          {children}
        </div>
      </motion.div>
    </div>

    {/* Right panel — hidden on mobile */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="hidden md:flex w-1/2 bg-dark-bg items-center justify-center p-12 relative overflow-hidden"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.6)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-[420px]">
        <span className="font-mono text-[11px] text-brand-blue uppercase tracking-widest">
          MULTI-AGENT RAG PLATFORM
        </span>
        <h2 className="text-[32px] font-bold text-white tracking-tighter leading-[1.2] mt-4">
          The intelligence layer between your data and your users.
        </h2>

        <div className="mt-8 flex flex-col gap-4">
          {bullets.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-brand-green" />
              </div>
              <span className="text-sm text-[#94A3B8] leading-relaxed">{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-dark-border" />

        <div className="mt-6">
          <span className="text-xs text-[#475569] flex items-center gap-2">
            Indexes on Pinecone →
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <span key={t} className="font-mono text-[10px] text-[#475569] bg-dark-surface border border-dark-border rounded px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default AuthLayout;
