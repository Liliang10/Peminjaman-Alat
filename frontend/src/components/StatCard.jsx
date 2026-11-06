export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-medium text-gray-500 block mb-1">{title}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  );
}