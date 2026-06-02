function StatsSection({ teamsCount }) {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        <StatCard value="50+" label="проведённых турниров" />
        <StatCard value="1200+" label="участников" />
        <StatCard value={teamsCount} label="созданных команд" />
        <StatCard value="24/7" label="поддержка команд" />
      </div>
    </section>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="mb-2 text-4xl font-black text-cyan-300">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

export default StatsSection;
