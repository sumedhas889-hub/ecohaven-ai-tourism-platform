"use client";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Test from "./components/Test";
import Footer from "./components/Footer";

export default function Home() {

  const [homestays, setHomestays] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/homestays")
      .then((res) => res.json())
      .then((data) => setHomestays(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <div className="grid md:grid-cols-3 gap-6 p-8 bg-slate-[#F5F7F2]">
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