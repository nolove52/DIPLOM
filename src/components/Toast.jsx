function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-cyan-500/30 bg-[#101321] px-6 py-4 font-semibold text-cyan-300 shadow-2xl shadow-cyan-500/10">
      {message}
    </div>
  );
}

export default Toast;
