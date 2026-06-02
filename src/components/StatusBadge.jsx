function StatusBadge({ status, compact = false }) {
  return (
    <span
      className={`w-fit rounded-full font-bold ${
        compact ? "px-4 py-1 text-xs" : "px-4 py-2 text-sm"
      } ${
        status === "Принята" || status === "Регистрация открыта"
          ? "bg-green-500/10 text-green-300"
          : status === "Отклонена"
          ? "bg-red-500/10 text-red-300"
          : status === "Скоро"
          ? "bg-purple-500/10 text-purple-300"
          : "bg-yellow-500/10 text-yellow-300"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
