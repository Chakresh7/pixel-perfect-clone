import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ragfloe/SectionLabel';

const steps = [
  {
    num: '01',
    title: 'Connect Your Data',
    desc: 'Upload files, connect databases, or stream via API.',
    code: [
      { text: '# Upload documents', color: 'comment' },
      { text: 'client.ingest(', color: 'default' },
      { text: '  project=', color: 'key', val: '"my-bot"', valColor: 'string' },
      { text: '  files=', color: 'key', val: '["docs.pdf"]', valColor: 'string' },
      { text: ')', color: 'default' },
    ],
  },
  {
    num: '02',
    title: 'Configure Pipeline',
    desc: 'Set chunking strategy, retrieval, and your LLM of choice.',
    code: [
      { text: '# Pipeline config', color: 'comment' },
      { text: 'chunk_size: ', color: 'key', val: '512', valColor: 'number' },
      { text: 'retrieval: ', color: 'key', val: '"hybrid"', valColor: 'string' },
      { text: 'llm: ', color: 'key', val: '"gpt-4o"', valColor: 'string' },
    ],
  },
  {
    num: '03',
    title: 'Query Your Data',
    desc: 'Agents handle embedding, retrieval, and generation automatically.',
    code: [
      { text: '# Query the pipeline', color: 'comment' },
      { text: 'response = client.query(', color: 'default' },
      { text: '  ', color: 'default', val: '"What is refund policy?"', valColor: 'string' },
      { text: ')', color: 'default' },
      { text: 'print(response.answer)', color: 'func' },
    ],
  },
  {
    num: '04',
    title: 'Deploy Anywhere',
    desc: 'Widget, REST API, or SDK — ship to production in one line.',
    code: [
      { text: '<!-- Embed widget -->', color: 'comment' },
      { text: '<script', color: 'func' },
      { text: '  src=', color: 'key', val: '"widget.ragfloe.io"', valColor: 'string' },
      { text: '  data-token=', color: 'key', val: '"rf_xxx"', valColor: 'string' },
      { text: '></script>', color: 'func' },
    ],
  },
];

const colorMap: Record<string, string> = {
  comment: 'text-[#475569]',
  default: 'text-[#94A3B8]',
  key: 'text-[#60A5FA]',
  string: 'text-[#86EFAC]',
  number: 'text-[#FCA5A5]',
  func: 'text-[#F0ABFC]',
};

const HowItWorksSection = () => (
  <section id="how-it-works" className="bg-dark-bg py-24 px-6 md:px-12">
    <div className="max-w-[1100px] mx-auto">
      <SectionLabel variant="dark">WORKFLOW</SectionLabel>
      <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-tighter text-white max-w-[480px] mt-3 mb-12">
        From data to deployed AI in minutes.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#232323] border border-[#232323] rounded-xl overflow-hidden">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-dark-bg p-7 hover:bg-dark-surface transition-colors duration-150"
          >
            <span className="font-mono text-[11px] font-semibold text-brand-blue tracking-wide">{step.num}</span>
            <h3 className="text-[15px] font-semibold text-white mt-3 tracking-snug">{step.title}</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5 mb-4">{step.desc}</p>
            <div className="bg-black border border-[#232323] rounded-md px-3.5 py-3">
              <code className="font-mono text-[10px] leading-[1.7] block">
                {step.code.map((line, j) => (
                  <div key={j}>
                    <span className={colorMap[line.color]}>{line.text}</span>
                    {line.val && <span className={colorMap[line.valColor || 'default']}>{line.val}</span>}
                  </div>
                ))}
              </code>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
