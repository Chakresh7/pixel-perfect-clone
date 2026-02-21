import { Link } from 'react-router-dom';

const CTASection = () => (
  <section className="bg-dark-bg py-24 px-6 md:px-12 text-center">
    <h2 className="text-[clamp(36px,5vw,56px)] font-extrabold tracking-tightest text-white leading-[1.05] max-w-[600px] mx-auto">
      Turn Knowledge Into Intelligence.
    </h2>
    <p className="text-base text-[#64748B] mt-3 mx-auto">
      Join teams already building with RagFloe.
    </p>
    <div className="flex flex-wrap justify-center gap-3 mt-9">
      <Link
        to="/auth/register"
        className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gray-100"
      >
        Join the Waitlist
      </Link>
      <a
        href="#"
        className="inline-flex items-center rounded-lg border border-gray-800 px-6 py-3 text-sm text-[#94A3B8] transition-colors hover:border-gray-600 hover:text-white"
      >
        Talk to Us →
      </a>
    </div>
  </section>
);

export default CTASection;
