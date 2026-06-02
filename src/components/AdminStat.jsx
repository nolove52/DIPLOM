function AdminStat({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <p className="mb-2 text-gray-400">{title}</p>
      <p className="text-4xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

export default AdminStat;
