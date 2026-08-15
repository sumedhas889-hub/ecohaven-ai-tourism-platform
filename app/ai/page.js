"use client";

import { useState } from "react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a request.");
      return;
    }

    setLoading(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI request failed.");
      }

      setOutput(data.output);
    } catch (err) {
      setError(err.message || "AI service failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7F2] p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-[#2D4F3A]">
          EcoHaven AI Assistant
        </h1>

        <p className="mt-3 text-gray-600">
          Get AI-powered eco-tourism recommendations.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >
          <label className="mb-2 block font-semibold text-gray-700">
            What would you like to know?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Suggest three eco-friendly destinations in India."
            className="min-h-32 w-full rounded-lg border border-gray-300 p-4 text-gray-800 outline-none focus:border-[#2D4F3A]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg bg-[#2D4F3A] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Getting AI recommendations..." : "Ask EcoHaven AI"}
          </button>

          {loading && (
            <div className="mt-5 rounded-lg bg-gray-100 p-4 text-gray-600">
              ⏳ AI is generating your recommendation...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {output && !loading && (
            <div className="mt-5 rounded-lg bg-green-50 p-5">
              <h2 className="text-xl font-bold text-[#2D4F3A]">
                AI Recommendation
              </h2>

              <p className="mt-3 whitespace-pre-line text-gray-700">
                {output}
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}