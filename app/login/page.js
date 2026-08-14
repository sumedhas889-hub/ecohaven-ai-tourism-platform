"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Footer from "../components/Footer";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("jwt_token", data.token);

      router.push("/about");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server");
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("jwt_token", data.token);

      router.push("/about");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server");
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    >
      <>
        <main className="min-h-screen p-10 bg-[#F5F7F2]">
          <h1 className="text-4xl font-bold text-[#2D4F3A]">
            👤 Login
          </h1>

          <p className="mt-4 text-gray-600">
            Sign in to manage bookings, save favorite stays, and plan your
            next eco adventure.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-500 bg-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-500 bg-white"
            />

            {error && (
              <p className="text-red-600 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </div>
        </main>

        <Footer />
      </>
    </GoogleOAuthProvider>
  );
}