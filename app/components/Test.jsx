export default function Test({ title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">
      <h2 className="text-2xl font-bold text-slate-800">
        {title}
      </h2>

      <p className="mt-3 text-slate-600">
        {description}
      </p>

      <button className="mt-5 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
        View Details
      </button>
    </div>
  );
}