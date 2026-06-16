import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen p-10 bg-[#F5F7F2]">
        <h1 className="text-4xl font-bold text-[#2D4F3A]">
          🌿 About EcoHaven
        </h1>

        <p className="mt-4 text-gray-600">
          EcoHaven helps travelers discover sustainable homestays and eco-friendly travel experiences.
        </p>
      </main>

      <Footer />
    </>
  );
}