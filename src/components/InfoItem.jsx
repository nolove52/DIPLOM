function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-200">{value}</p>
    </div>
  );
}

export default InfoItem;
