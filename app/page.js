"use client";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Test from "./components/Test";
import Footer from "./components/Footer";
import Loader from "./components/ui/Loader";
import Toast from "./components/ui/Toast";

export default function Home() {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/homestays")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setHomestays(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load homestays");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Hero />

      {error && <Toast message={error} />}

      <div className="grid md:grid-cols-3 gap-6 p-8 bg-black">
        {homestays.map((stay) => (
          <Test
            key={stay.id}
            title={stay.name}
            description={`${stay.location} • ₹${stay.price}/night`}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}