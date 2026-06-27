const STATS = [
  { n: "500+", l: "Events Catered" },
  { n: "25", l: "Years of Excellence" },
  { n: "98%", l: "Client Retention" },
  { n: "50+", l: "Master Chefs" },
];
export default function StatsBar() {
  return (
    <section className="bg-primary text-on-primary py-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(s => (
          <div key={s.l}>
            <div className="font-display text-headline-md text-gold">{s.n}</div>
            <div className="font-body text-label-caps uppercase tracking-widest mt-2 opacity-80">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
