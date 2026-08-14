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
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <div className="bg-black py-16">
        <div className="grid md:grid-cols-3 gap-8 px-10">

          {homestays.map((home) => (
            <Test
              key={home.id}
              title={home.name}
              description={`${home.location} • ₹${home.price}`}
            />
          ))}

        </div>
      </div>

      <Footer />
    </>
  );
}