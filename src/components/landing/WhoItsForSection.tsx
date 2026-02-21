import { SectionLabel } from '@/components/ragfloe/SectionLabel';

const personas = [
  {
    letter: 'D',
    title: 'Developers',
    subtitle: 'For engineers',
    items: ['Full pipeline control', 'API-first design', 'No vendor lock-in', 'Complete observability'],
  },
  {
    letter: 'S',
    title: 'Startups',
    subtitle: 'For product teams',
    items: ['Launch AI features fast', 'Predictable costs', 'Scale without rearchitecting', 'Multi-project support'],
  },
  {
    letter: 'E',
    title: 'Enterprise',
    subtitle: 'For organizations',
    items: ['Secure data isolation', 'Role-based access control', 'Org-level audit logs', 'Multiple chatbots per org'],
  },
];

const WhoItsForSection = () => (
  <section className="bg-white py-24 px-6 md:px-12">
    <div className="max-w-[1100px] mx-auto">
      <SectionLabel>WHO IT'S FOR</SectionLabel>
      <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-tighter text-brand-black max-w-[440px] mt-3 mb-12">
        Built for teams that take AI seriously.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personas.map((p) => (
          <div
            key={p.letter}
            className="border border-gray-200 rounded-[10px] p-7 transition-all duration-200 hover:border-brand-black hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-black">
              <span className="text-lg font-bold font-mono text-white">{p.letter}</span>
            </div>
            <h3 className="text-[17px] font-bold text-brand-black tracking-tight mt-4">{p.title}</h3>
            <p className="text-xs font-mono text-gray-400 mt-1">{p.subtitle}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {p.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhoItsForSection;
