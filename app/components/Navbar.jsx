"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold">
        EcoHaven🏡
      </h1>

      <div className="space-x-6">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/destinations">Destinations</a>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}