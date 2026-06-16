export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold"> EcoHaven🏡</h1>

      <div className="space-x-6">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/destinations">Destinations</a>
        <a href="/login">Login</a>
      </div>
    </nav>
  );
}