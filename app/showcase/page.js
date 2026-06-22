"use client";

import { useState } from "react";
import { Button, Input, Modal, Toast, Loader } from "../components/ui";

export default function Showcase() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen p-8 space-y-6 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-3xl font-bold">
        UI Components Showcase
      </h1>

      <Input placeholder="Enter your name" />

      <Button text="Book Now" />

      <Loader />

      <Modal isOpen={false} title="Sample Modal" />

      <Toast message="Booking Successful!" />
    </div>
  );
}