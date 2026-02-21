const stats = [
  { value: '6–8 wks → Days', label: 'Time to Production' },
  { value: '10×', label: 'Infrastructure Cost Savings' },
  { value: '100%', label: 'Pipeline Transparency' },
];

const StatsStrip = () => (
  <section className="bg-gray-50 border-t border-b border-gray-200 py-14 px-6 md:px-12">
    <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`text-center py-6 md:py-0 md:px-12 ${
            i < stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''
          }`}
        >
          <div className="font-mono text-[clamp(28px,4vw,40px)] font-extrabold text-brand-black tracking-tightest leading-none">
            {s.value}
          </div>
          <div className="text-[13px] text-gray-500 mt-2.5">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsStrip;
