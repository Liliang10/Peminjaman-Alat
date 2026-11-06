export default function StatCard({ title, value, icon, color = 'text-indigo-600 bg-indigo-50 border-indigo-100' }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group">
      <div>
        <span className="text-xs font-semibold text-slate-500 block mb-1">{title}</span>
        <span className="text-2xl font-black text-slate-950 tracking-tight">{value}</span>
      </div>
      {icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${color} shadow-xs group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
      )}
    </div>
  );
}
