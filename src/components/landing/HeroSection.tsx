import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
});

const HeroSection = () => (
  <section className="bg-white pt-[140px] pb-20 px-6 md:px-12">
    <div className="max-w-[1100px] mx-auto text-center">
      {/* Badge */}
      <motion.div {...fadeUp(0.2)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3.5 py-1.5 mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse-dot" />
        <span className="font-mono text-xs text-gray-500">Now in Private Beta</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 {...fadeUp(0.1)} className="text-[clamp(48px,8vw,80px)] font-extrabold tracking-tightest leading-[1.02] text-brand-black max-w-[900px] mx-auto mb-6">
        Build Your Production-Grade
        <br />
        <span className="text-transparent" style={{ WebkitTextStroke: '2.5px #09090B' }}>
          RAG Chatbot
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p {...fadeUp(0.2)} className="text-lg text-gray-500 leading-relaxed max-w-[520px] mx-auto mb-10">
        RagFloe is a RAG-as-a-Service platform for teams that need control, scale, and reliability — powered by your data.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-3 mb-5">
        <Link
          to="/register"
          className="inline-flex items-center rounded-lg bg-brand-black px-7 py-3 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-gray-800 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          Get Early Access →
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center rounded-lg border border-gray-300 px-7 py-3 text-[15px] font-semibold text-gray-600 transition-all duration-150 hover:border-brand-black hover:text-brand-black"
        >
          See Architecture ↗
        </a>
      </motion.div>

      {/* Social Proof */}
      <motion.p {...fadeUp(0.35)} className="font-mono text-[13px] text-gray-400">
        Trusted by developers building with OpenAI · Pinecone · LangChain
      </motion.p>
    </div>
  </section>
);

export default HeroSection;
